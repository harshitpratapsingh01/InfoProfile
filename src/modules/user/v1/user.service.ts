"use strict";

import { BaseEntity } from "../../baseEntity/baseEntity";
import { UserRequest } from "../UserRequest";
import { DB_MODEL_REF, STATUS } from "../../../config";
import mongoose from "mongoose";

export class UserService extends BaseEntity {

    /**
     * @function isEmailExists
     */
    async isEmailExists(params, userId?: string) {
        try {
            const query: any = {};
            query.email = params.email;
            if (userId) query._id = { "$not": { "$eq": userId } };
            query.status = { "$ne": STATUS.DELETED };

            const projection = { updatedAt: 0, createdAt: 0, __v: 0 };

            const result = await this.findOne(<any>DB_MODEL_REF.USER, query, projection);
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**    
     * @function findUserById
     */
    async findUserByUsername(username: string, project = {}) {
        try {
            const query: any = {};
            query.username = username;
            query.status = { "$ne": STATUS.DELETED };

            const projection = (Object.values(project).length) ? project : { createdAt: 0, updatedAt: 0 };

            return await this.findOne(<any>DB_MODEL_REF.USER, query, projection);
        } catch (error) {
            throw error;
        }
    }
    /**
     * @function signUp
     */
    async signUp(params: UserRequest.SignUp) {
        try {
            const userData = {
                "username": params.username,
                "email": params.email,
                "password": params.password,
                "fullName": params.fullName || " ",
                "profilePic": params.profilePic || " ",
                "profileBio": params.profilePic || " "
            }
            let user = await this.save(<any>DB_MODEL_REF.USER, userData);
            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function VerifyUser
     */
    async VerifyUser(params: UserRequest.VerifyOtp) {
        try {
            const query: any = { email: params.email };
            const update = { $set: { accountVerify: 1 } };
            const options = { new: true };
            return await this.findOneAndUpdate(<any>DB_MODEL_REF.USER, query, update, options)
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function changePassword   
     */
    async changePassword(params: UserRequest.ChangeForgotPassword) {
        try {
            const query: any = {};
            query._id = params.UserId;

            const update = {};
            update["$set"] = {
                password: params.newPassword
            };

            return await this.updateOne(<any>DB_MODEL_REF.USER, query, update, {});
        } catch (error) {
            throw error;
        }
    }

    /**    
     * @function findUserById
     */
    async findUserById(userId: string, project = {}) {
        try {
            const query: any = {};
            query._id = userId;
            query.status = { "$ne": STATUS.DELETED };

            const projection = (Object.values(project).length) ? project : { createdAt: 0, updatedAt: 0 };

            return await this.findOne(<any>DB_MODEL_REF.USER, query, projection);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function 
     */
    async userProfile(params, project = {}) {
        try {
            let pipeline = [];
            pipeline.push(
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(params.userId)
                    }
                },
                {
                    $lookup: {
                        from: DB_MODEL_REF.POST,
                        let: { userId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$userId', '$$userId']
                                    }
                                }
                            },
                            {
                                $match: {
                                    postStatus: true
                                }
                            },
                            {
                                $sort: {
                                    createdAt: -1
                                }
                            }
                        ],
                        as: 'UserPosts'
                    }
                },
                {
                    $lookup: {
                        from: DB_MODEL_REF.FOLLOW,
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$userId', new mongoose.Types.ObjectId(params.UserId)] },
                                            { $eq: ['$followingId', new mongoose.Types.ObjectId(params.userId)] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'Following'
                    }
                },
                {
                    $addFields: {
                        'isFollowing': {
                            $cond: {
                                if: {
                                    $gt: [{ $size: "$Following" }, 0]
                                },
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: DB_MODEL_REF.FOLLOW,
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$followingId', new mongoose.Types.ObjectId(params.UserId)] },
                                            { $eq: ['$userId', new mongoose.Types.ObjectId(params.userId)] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'Follower'
                    }
                },
                {
                    $addFields: {
                        'isFollower': {
                            $cond: {
                                if: {
                                    $gt: [{ $size: "$Follower" }, 0]
                                },
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: DB_MODEL_REF.LIKE,
                        let: { post_id: '$UserPosts._id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$userId', new mongoose.Types.ObjectId(params.UserId)] },
                                            { $eq: ['$postId', '$$post_id'] },
                                            { $eq: ['$likeStatus', true] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'LikedPost'
                    }
                },
                {
                    $addFields: {
                        'UserPosts.isLiked': {
                            $cond: {
                                if: {
                                    $gt: [{ $size: "$LikedPost" }, 0]
                                },
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                {
                    $project: {
                        '_id': 0,
                        'password': 0,
                        'accountVerify': 0,
                        'createdAt': 0,
                        'updatedAt': 0,
                        '__v': 0,
                        'UserPosts.postStatus': 0,
                        'UserPosts.updatedAt': 0,
                        'UserPosts.__v': 0,
                        'Following': 0,
                        'Follower': 0,
                        'LikedPost': 0
                    }
                }
            )
            return await this.aggregate(<any>DB_MODEL_REF.USER, pipeline);
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function editProfile
     */
    async editProfile(params: any, userData: any) {
        try {
            const query: any = {};
            query._id = params.UserId;

            return await this.findOneAndUpdate(<any>DB_MODEL_REF.USER, query, params, {});
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function userFeed
     */
    async userFeed(params: UserRequest.UserFeed, tokenData: any) {
        try {
            const query:any = {};
            query.userId = tokenData.UserId
            const followings = await this.find(<any>DB_MODEL_REF.FOLLOW, query, {});
            let pipeline = [];
            if (followings.length) {
                pipeline.push(
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(tokenData.UserId)
                        }
                    },
                    {
                        $lookup: {
                            from: DB_MODEL_REF.POST,
                            let: { user_Id: '$followingId' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $or: [
                                                        { $eq: ['$userId', '$$user_Id'] },
                                                        { $eq: ['$userId', new mongoose.Types.ObjectId(tokenData.UserId)] }
                                                    ]
                                                },
                                                {
                                                    $eq: ['$postStatus', true]
                                                }
                                            ]
                                        }
                                    }
                                },
                            ],
                            as: 'UserPosts'
                        }
                    },
                    {
                        $unwind: "$UserPosts"
                    },
                    {
                        $lookup: {
                            from: DB_MODEL_REF.REPORT_POST,
                            let: { post_id: '$UserPosts._id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$userId', new mongoose.Types.ObjectId(tokenData.UserId)] },
                                                { $eq: ['$postId', '$$post_id'] },
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: 'ReportedPosts'
                        }
                    },
                    {
                        $addFields: {
                            'UserPosts.isReported': {
                                $cond: {
                                    if: {
                                        $gt: [{ $size: "$ReportedPosts" }, 0]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $match: {
                            'UserPosts.isReported': false
                        }
                    },
                    {
                        $lookup: {
                            from: DB_MODEL_REF.LIKE,
                            let: { post_id: '$UserPosts._id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$userId', new mongoose.Types.ObjectId(tokenData.UserId)] },
                                                { $eq: ['$postId', '$$post_id'] },
                                                { $eq: ['$likeStatus', true] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: 'LikedPost'
                        }
                    },
                    {
                        $addFields: {
                            'UserPosts.isLiked': {
                                $cond: {
                                    if: {
                                        $gt: [{ $size: "$LikedPost" }, 0]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: DB_MODEL_REF.USER,
                            localField: "UserPosts.userId",
                            foreignField: "_id",
                            as: "UserData"
                        }
                    },
                    {
                        $unwind: "$UserData"
                    },
                    {
                        $group: {
                            _id: '$UserPosts._id', // Group by the unique post ID
                            UserData: { $first: '$UserData' },
                            UserPosts: { $first: '$UserPosts' },
                            LikedPost: { $first: '$LikedPost' },
                            ReportedPosts: { $first: '$ReportedPosts' }
                        }
                    },
                    {
                        $sort: {
                            'UserPosts.createdAt': -1
                        }
                    },
                    {
                        $project: {
                            '_id': 0,
                            'UserData.password': 0,
                            'UserData.accountVerify': 0,
                            'UserData.createdAt': 0,
                            'UserData.updatedAt': 0,
                            'UserData.__v': 0,
                            'UserData.profileBio': 0,
                            'UserData.followingCount': 0,
                            'UserData.followerCount': 0,
                            'UserData.postCount': 0,
                            'UserPosts.updatedAt': 0,
                            'UserPosts.__v': 0,
                            'UserPosts.isReported': 0,
                            'UserPosts.postStatus': 0,
                            '__v': 0,
                            'createdAt': 0,
                            'updatedAt': 0,
                            'userId': 0,
                            'followingId': 0,
                            'ReportedPosts': 0,
                            'LikedPost': 0

                        }
                    }
                )
                const FeedData = await this.paginate(<any>DB_MODEL_REF.FOLLOW, pipeline, params.limit, params.pageNo, {}, true);
                const result = FeedData.data.map((item) => {
                
                    return {
                        PostData: {
                            _id: item.UserData._id,
                            username: item.UserData.username, 
                            email: item.UserData.email,
                            profilePic: item.UserData.profilePic,
                            fullName: item.UserData.fullName,
                            postId: item.UserPosts._id,
                            userId: item.UserPosts.userId,
                            url: item.UserPosts.url,
                            caption: item.UserPosts.caption,
                            likeCount: item.UserPosts.likeCount,
                            commentCount: item.UserPosts.commentCount,
                            createdAt: item.UserPosts.createdAt,
                            isLiked: item.UserPosts.isLiked
                        },
                        
                        
                    };
                });
                return result;
            }
            else {
                pipeline.push(
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(tokenData.UserId)
                        }
                    },
                    {
                        $lookup: {
                            from: DB_MODEL_REF.POST,
                            let: { user_Id: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { 
                                                    $eq: ['$userId', '$$user_Id'] 
                                                },
                                                {
                                                    $eq: ['$postStatus', true]
                                                }

                                            ]
                                        }
                                    }
                                },
                            ],
                            as: 'UserPosts'
                        }
                    },
                    {
                        $unwind: "$UserPosts"
                    },
                    {
                        $lookup: {
                            from: DB_MODEL_REF.LIKE,
                            let: { post_id: '$UserPosts._id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$userId', new mongoose.Types.ObjectId(tokenData.UserId)] },
                                                { $eq: ['$postId', '$$post_id'] },
                                                { $eq: ['$likeStatus', true] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: 'LikedPost'
                        }
                    },
                    {
                        $addFields: {
                            'UserPosts.isLiked': {
                                $cond: {
                                    if: {
                                        $gt: [{ $size: "$LikedPost" }, 0]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $sort: {
                            'UserPosts.createdAt': -1
                        }
                    },
                    {
                        $project: {
                            'UserPosts.updatedAt': 0,
                            'UserPosts.__v': 0,
                            'UserPosts.isReported': 0,
                            'UserPosts.postStatus': 0,
                            '__v': 0,
                            'followingCount':0,
                            'accountVerify': 0,
                            'createdAt': 0,
                            'updatedAt': 0,
                            'password': 0,
                            'profileBio': 0,
                            'followerCount': 0,
                            'postCount': 0,
                            'LikedPost': 0

                        }
                    }
                )
                const FeedData =  await this.paginate(<any>DB_MODEL_REF.USER, pipeline, params.limit, params.pageNo, {}, true);
                const result = FeedData.data.map((item) => {
                
                    return {
                        PostData: {
                            _id: item._id,
                            username: item.username, 
                            email: item.email,
                            profilePic: item.profilePic,
                            fullName: item.fullName,
                            postId: item.UserPosts._id,
                            userId: item.UserPosts.userId,
                            url: item.UserPosts.url,
                            caption: item.UserPosts.caption,
                            likeCount: item.UserPosts.likeCount,
                            commentCount: item.UserPosts.commentCount,
                            createdAt: item.UserPosts.createdAt,
                            isLiked: item.UserPosts.isLiked
                        },
                        
                        
                    };
                });
                return result;
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function userSerach
     */
    async userSearch(name: string) {
        try {
            const searchRegex = new RegExp(name, 'i');
            const query: any = {
                $or: [
                    { username: searchRegex },
                    { fullName: searchRegex }
                ],
                accountVerify: { $ne: 0 }
            };

            const projection = {
                _id: 1,
                username: 1,
                fullName: 1,
                profilePic: 1
            };

            const users = await this.find(<any>DB_MODEL_REF.USER, query, projection);
            return users;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function allUsers 
     */
    async allUsers(userId: string){
        try{
            const query: any = {
                _id: {
                    $ne: userId
                }
            };

            const projection = {updatedAt: 0, createdAt: 0, __v: 0, password: 0, email: 0, accountVerify: 0, followerCount: 0, followingCount: 0, postCount: 0 };
            return await this.find(<any>DB_MODEL_REF.USER, query, projection, {});
        }
        catch(error){
            throw error;
        }
    }
}


export const userService = new UserService();


