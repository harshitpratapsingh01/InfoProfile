"use strict";

import * as _ from "lodash";
import { QueryOptions } from "mongoose";

import * as models from "../models";
import { ModelNames } from "../../interfaces/Model";

export class BaseEntity {

	async save(model: ModelNames, data: any) {
		try {
			const ModelName: any = models[model];
			return (await new ModelName(data).save()).toJSON();
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async find(model: ModelNames, query: any, projection: any, options = {}, sort?, paginate?, populateQuery?: any) {
		try {
			const ModelName: any = models[model];
			options = { ...options, lean: true };
			if (!_.isEmpty(sort) && !_.isEmpty(paginate) && _.isEmpty(populateQuery)) { // sorting with pagination
				return await ModelName.find(query, projection, options).sort(sort).skip((paginate.pageNo - 1) * paginate.limit).limit(paginate.limit);
			} else if (_.isEmpty(sort) && !_.isEmpty(paginate) && _.isEmpty(populateQuery)) { // pagination
				return await ModelName.find(query, projection, options).skip((paginate.pageNo - 1) * paginate.limit).limit(paginate.limit);
			} else if (_.isEmpty(sort) && _.isEmpty(paginate) && !_.isEmpty(populateQuery)) { // populate
				return await ModelName.find(query, projection, options).populate(populateQuery).exec();
			} else if (_.isEmpty(sort) && !_.isEmpty(paginate) && !_.isEmpty(populateQuery)) { // pagination with populate
				return await ModelName.find(query, projection, options).skip((paginate.pageNo - 1) * paginate.limit).limit(paginate.limit).populate(populateQuery).exec();
			} else if (!_.isEmpty(sort) && _.isEmpty(paginate) && _.isEmpty(populateQuery)) { // only sorting
				return await ModelName.find(query, projection, options).sort(sort).exec();
			} else {
				return await ModelName.find(query, projection, options);
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async distinct(model: ModelNames, path: string, query: any) {
		try {
			const ModelName: any = models[model];
			return await ModelName.distinct(path, query);
		} catch (error) {
			return Promise.reject(error);
		}
	}

    async updateOne(model: ModelNames, query: any, update: any, options: any) {
		try {
			const ModelName: any = models[model];
			return await ModelName.updateOne(query, update, options);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async findOne(model: ModelNames, query: any, projection = {}, options = {}, sort?: any, populateQuery?: any) {
		try {
			const ModelName: any = models[model];
            if (!ModelName) {
                throw new Error(`Model "${model}" not found`);
            }
			options = { ...options, lean: true };
			if (!_.isEmpty(populateQuery) && _.isEmpty(sort)) { // populate
				return await ModelName.findOne(query, projection, options).populate(populateQuery).exec();
			} else if (!_.isEmpty(sort) && _.isEmpty(populateQuery)) { // populate
				return await ModelName.findOne(query, projection, options).sort(sort).exec();
			} else if (!_.isEmpty(sort) && !_.isEmpty(populateQuery)) { // populate
				return await ModelName.findOne(query, projection, options).sort(sort).populate(populateQuery).exec();
			} else {
                const result = await ModelName.findOne(query, projection, options)
				// return await ModelName.findOne(query, projection, options);
                return result;
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async updateMany(model: ModelNames, query: any, update: any, options: QueryOptions) {
		try {
			const ModelName: any = models[model];
			return await ModelName.updateMany(query, update, options);
		} catch (error) {
			return Promise.reject(error);
		}
	}

    async findOneAndUpdate(model: ModelNames, query: any, update: any, options = {}) {
		try {
			options = { ...options, lean: true };
			const ModelName: any = models[model];
			return await ModelName.findOneAndUpdate(query, update, options);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async deleteOne(model: ModelNames, query: any) {
		try {
			const ModelName: any = models[model];
			return await ModelName.deleteOne(query);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async aggregate(model: ModelNames, aggPipe, options: any = {}) {
		try {
			const ModelName: any = models[model];
			const aggregation: any = ModelName.aggregate(aggPipe);
			if (options) {
				aggregation.options = options;
			}
			return await aggregation.allowDiskUse(true).exec();
		} catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 * @description Add skip and limit to pipleine
	 */
	addSkipLimit = (limit, pageNo) => {
		if (limit) {
			limit = Math.abs(limit);
			// If limit exceeds max limit
			if (limit > 100) {
				limit = 100;
			}
		} else {
			limit = 10;
		}
		if (pageNo && (pageNo !== 0)) {
			pageNo = Math.abs(pageNo);
		} else {
			pageNo = 1;
		}
		let skip = (limit * (pageNo - 1));
		return [
			{ "$skip": skip },
			{ "$limit": limit+1 }
		];
	}

	paginate = async (model: ModelNames, pipeline: Array<Object>, limit: number, pageNo: number, options: any = {}, pageCount = false) => {
		try {
			pipeline = [...pipeline, ...this.addSkipLimit(limit, pageNo)];
			let ModelName: any = models[model];

			let promiseAll = [];
			if (!_.isEmpty(options)) {
				if (options.collation) {
					promiseAll = [
						ModelName.aggregate(pipeline).collation({ "locale": "en" }).allowDiskUse(true)
					];
				} else {
					promiseAll = [
						ModelName.aggregate(pipeline).allowDiskUse(true)
					];
				}
			} else {
				promiseAll = [
					ModelName.aggregate(pipeline).allowDiskUse(true)
				];
			}

			if (pageCount) {

				for (let index = 0; index < pipeline.length; index++) {
					if ("$skip" in pipeline[index]) {
						pipeline = pipeline.slice(0, index);
					} else {
						// pipeline = pipeline;
					}
				}
				pipeline.push({ "$count": "total" });
				promiseAll.push(ModelName.aggregate(pipeline).allowDiskUse(true));
			}
			let result = await Promise.all(promiseAll);

			let nextHit = 0;
			let total = 0;
			let totalPage = 0;

			if (pageCount) {

				total = result[1] && result[1][0] ? result[1][0]["total"] : 0;
				totalPage = Math.ceil(total / limit);
			}

			let data: any = result[0];
			if (result[0].length > limit) {
				nextHit = pageNo + 1;
				data = result[0].slice(0, limit);
			}
			return {
				"data": data,
				"total": total,
				"pageNo": pageNo,
				"totalPage": totalPage,
				"nextHit": nextHit,
				"limit": limit
			};
		} catch (error) {
			throw new Error(error);
		}
	}
}

export const baseEntity = new BaseEntity();