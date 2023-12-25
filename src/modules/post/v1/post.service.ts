import mongoose from "mongoose";
import { DB_MODEL_REF, STATUS } from "../../../config";
import { BaseEntity } from "../../baseEntity";
import { toObjectId } from "../../../utils";

export class PostService extends BaseEntity {

    /**    
    * @function findPostById
    */
    async findPostById(postId: string, project = {}) {
        try {
            const query: any = {};
            query._id = postId;
            query.status = { "$ne": STATUS.DELETED };

            const projection = (Object.values(project).length) ? project : { createdAt: 0, updatedAt: 0 };

            return await this.findOne(<any>DB_MODEL_REF.POST, query, projection);
        } catch (error) {
            throw error;
        }
    }

    /**
    * @function createPost
    */
    async createPost(params) {
        try {
            const createPostData = {
                "userId": params.UserId,
                "url": params.url,
                "caption": params.caption || " "
            }
            const postData = await this.save(<any>DB_MODEL_REF.POST, createPostData);
            if (postData) {
                const query1: any = {}
                query1._id = params.UserId;

                const update1 = {};
                update1["$inc"] = {
                    postCount: 1
                };
                await this.updateOne(<any>DB_MODEL_REF.USER, query1, update1, {});
                return postData;
            }
            else {
                return false
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function editPostById
     */
    async editPostById(params) {
        try {
            const query: any = {
                $and: [
                    { _id: params.postId },
                    { userId: params.UserId },
                ]
            };

            const update = {};
            update["$set"] = {
                caption: params.caption
            };

            return await this.updateOne(<any>DB_MODEL_REF.POST, query, update, {});
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function deletePost
     */
    async deletePost(params) {
        try {
            let query: any = {}, query1: any = {}, query2: any = {};
            let update = {}, update1 = {}, update2 = {}, update3 = {};
            query = {
                $and: [
                    { _id: params.postId },
                    { userId: params.UserId },
                    {postStatus: true}
                ]
            };
            update["$set"] = {
                postStatus: false
            };
            const deletePost = await this.findOneAndUpdate(<any>DB_MODEL_REF.POST, query, update, {});
            if (deletePost) {
                query1 = {
                    postId: params.postId
                }
                update1["$set"] = {
                    likeStatus: false
                }
                update2["$set"] = {
                    commentStatus: false
                }
                const options = { multi: true };
                query2._id = params.UserId;
                update3["$inc"] = {
                    postCount: -1
                };
                await Promise.all([
                    this.updateOne(<any>DB_MODEL_REF.USER, query2, update3, {}),
                    this.updateMany(<any>DB_MODEL_REF.LIKE, query1, update1, options ),
                    this.updateMany(<any>DB_MODEL_REF.COMMENT, query1, update2, options ),
                ])
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function getPost
     */
    async getPost(userId: string, project = {}) {
        try {
            const query: any = {
                $and: [
                    { userId: userId },
                    { postStatus: true }
                ]
            };
            query.status = { "$ne": STATUS.DELETED };

            const projection = (Object.values(project).length) ? project : { __v: 0, updatedAt: 0 };

            return await this.find(<any>DB_MODEL_REF.POST, query, projection);
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function getSinglePost
     */
    async getSinglePost(params: any, project = {}) {
        try {
            const pipeline = [];
            pipeline.push(
                {
                    $match: {
                        _id: toObjectId(params.postId)
                    }
                },
                {
                    $lookup: {
                        from: DB_MODEL_REF.LIKE,
                        let: { post_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$userId', toObjectId(params.UserId)] },
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
                        'isLiked': {
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
                        'updatedAt': 0,
                        '__v': 0,
                        'postStatus': 0,
                        'LikedPost': 0
                    }
                }
            )
            return await this.aggregate(<any>DB_MODEL_REF.POST, pipeline);
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function postLike
     */
    async postLike(params) {
        try {
            const query: any = {
                $and: [
                    { postId: params.postId },
                    { userId: params.UserId },
                    // { likeStatus: true }
                ]

            };

            const isLiked = await this.findOne(<any>DB_MODEL_REF.LIKE, query);
            if (!isLiked) {
                const createLike = {
                    "userId": params.UserId,
                    "postId": params.postId
                }

                const liked = await this.save(<any>DB_MODEL_REF.LIKE, createLike);

                const query1: any = {};
                query1._id = params.postId;

                const update1 = {
                    $inc: { likeCount: 1 }
                };

                await this.updateOne(<any>DB_MODEL_REF.POST, query1, update1, {});
                return true;
            }
            else if (isLiked && isLiked.likeStatus == false) {
                const update = {};
                update["$set"] = {
                    likeStatus: true
                };

                await this.updateOne(<any>DB_MODEL_REF.LIKE, query, update, {});

                const query1: any = {};
                query1._id = params.postId;

                const update1 = {
                    $inc: { likeCount: 1 }
                };

                await this.updateOne(<any>DB_MODEL_REF.POST, query1, update1, {});
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function postDislike
     */
    async postDislike(params) {
        try {
            const query: any = {
                $and: [
                    { postId: params.postId },
                    { userId: params.UserId },
                    { likeStatus: true }
                ]
            };

            const update = {};
            update["$set"] = {
                likeStatus: false
            };

            const dislike = await this.findOneAndUpdate(<any>DB_MODEL_REF.LIKE, query, update, {});

            if (dislike) {
                const query1: any = {};
                query1._id = params.postId;

                const update1 = {
                    $inc: { likeCount: -1 }
                };

                await this.updateOne(<any>DB_MODEL_REF.POST, query1, update1, {});
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function postLikesList
     */
    async postLikesList(params: any) {
        try {
            const pipeline = [
                {
                    $match: {
                        $and: [
                            { postId: new mongoose.Types.ObjectId(params.postId) },
                            { likeStatus: true }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: DB_MODEL_REF.USER,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'User'
                    }
                },
                {
                    $unwind: '$User'
                },
                {
                    $project: {
                        '_id': 0,
                        'createdAt': 1,
                        'User._id': 1,
                        'User.username': 1,
                        'User.email': 1,
                        'User.profilePic': 1
                    }
                }
            ]

            const data = await this.paginate(<any>DB_MODEL_REF.LIKE, pipeline, params.limit, params.pageNo, {});
            return data.data;
        }
        catch (error) {

        }
    }

    /**
     * @function createComment
     */
    async createComment(params: any) {
        try {
            const createCommentData = {
                "userId": params.UserId,
                "postId": params.postId,
                "comment": params.comment
            }

            const comment = await this.save(<any>DB_MODEL_REF.COMMENT, createCommentData);
            if(comment){
                const query1: any = {};
                query1._id = params.postId;
    
                const update1 = {
                    $inc: { commentCount: 1 }
                };

                await this.updateOne(<any>DB_MODEL_REF.POST, query1, update1, {});
                return {status: true,comment: comment};
            }
            else{
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function listComment
     */
    async listComment(params: any) {
        try {
            const pipeline = [
                {
                    $match: {
                        $and: [
                            { postId: new mongoose.Types.ObjectId(params.postId) },
                            { commentStatus: true }
                        ]
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $lookup: {
                        from: DB_MODEL_REF.USER,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'User'
                    }
                },
                {
                    $unwind: '$User'
                },
                {
                    $project: {
                        '_id': 1,
                        'comment': 1,
                        'createdAt': 1,
                        'User._id': 1,
                        'User.username': 1,
                        'User.email': 1,
                        'User.profilePic': 1
                    }
                }
            ]

            const data = await this.paginate(<any>DB_MODEL_REF.COMMENT, pipeline, params.limit, params.pageNo);
            return data.data;
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function deleteComment
     */
    async deleteComment(params: any, postData: any) {
        try {
            let query: any = {};
            let update = {};
            let query1: any = {};
            let update1 = {};

            if (postData.userId.toString() == params.UserId) {
                console.log("post owner");
                query = {
                    $and: [
                        { postId: params.postId },
                        { _id: params.commentId },
                        {commentStatus: true}
                    ]
                }
                update["$set"] = {
                    commentStatus: false
                };

                const deleteComment = await this.findOneAndUpdate(<any>DB_MODEL_REF.COMMENT, query, update, {});

                if (deleteComment) {
                    query1._id = params.postId;

                    update1["$inc"] = {
                        commentCount: -1
                    };

                    await this.updateOne(<any>DB_MODEL_REF.POST, query1, update1, {});
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                console.log("Commetn owner");
                query = {
                    $and: [
                        { userId: params.UserId },
                        { postId: params.postId },
                        { _id: params.commentId }
                    ]
                }
                update["$set"] = {
                    commentStatus: false
                };

                const deleteComment = await this.findOneAndUpdate(<any>DB_MODEL_REF.COMMENT, query, update, {});

                if (deleteComment) {
                    query1._id = params.postId;

                    update1["$inc"] = {
                        commentCount: -1
                    };
                    await this.updateOne(<any>DB_MODEL_REF.POST, query1, update1, {});
                    return true;
                }

                else {
                    return false;
                }
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function editComment
     */
    async editComment(params: any) {
        try {
            const query: any = {
                $and: [
                    { userId: params.UserId },
                    { postId: params.postId },
                    { _id: params.commentId }
                ]
            }
            const update = {};
            update["$set"] = {
                comment: params.comment
            };

            return await this.findOneAndUpdate(<any>DB_MODEL_REF.COMMENT, query, update, {});
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function reportPost 
     */
    async reportPost(params: any) {
        try {
            const reportedPost = {
                "userId": params.UserId,
                "postId": params.postId
            }

            return await this.save(<any>DB_MODEL_REF.REPORT_POST, reportedPost);
        }
        catch (error) {
            throw error;
        }
    }
}

export const postService = new PostService();