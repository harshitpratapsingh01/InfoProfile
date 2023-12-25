import mongoose from "mongoose";
import { DB_MODEL_REF } from "../../../config";
import { BaseEntity } from "../../baseEntity";

export class FollowService extends BaseEntity {

    /**    
     * @function findFollowingById
     */
    async findUserById(params: any, project = {}) {
        try {
            const query: any = {
                $and: [
                    { userId: params.UserId },
                    { followingId: params.followingId },
                ]
            };

            const projection = (Object.values(project).length) ? project : { createdAt: 0, updatedAt: 0 };

            return await this.findOne(<any>DB_MODEL_REF.FOLLOW, query, projection);
        } catch (error) {
            throw error;
        }
    }

    /**
    * @function followUser
    */
    async followUser(params) {
        try {
            const createFollowing = {
                "userId": params.UserId,
                "followingId": params.followingId,
            }

            const follow = await this.save(<any>DB_MODEL_REF.FOLLOW, createFollowing);

            if(follow){
                const query1: any = {};
                query1._id = params.UserId;
    
                const update1 = {
                    $inc: { followingCount: 1 }
                };
    
                const query2: any = {};
                query2._id = params.followingId;
    
                const update2 = {
                    $inc: { followerCount: 1 }
                };
    
                await Promise.all([
                    this.updateOne(<any>DB_MODEL_REF.USER, query1, update1, {}),
                    this.updateOne(<any>DB_MODEL_REF.USER, query2, update2, {})
                ])
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function unfollowUser
     */
    async unfollowUser(params) {
        try {
            const query: any = {
                $and: [
                    { userId: params.UserId },
                    { followingId: params.followingId },
                ]
            };
            const unfollow = await this.deleteOne(<any>DB_MODEL_REF.FOLLOW, query);

            if(unfollow){
                const query1: any = {};
                query1._id = params.UserId;
    
                const update1 = {
                    $inc: { followingCount: -1 }
                };
    
                const query2: any = {};
                query2._id = params.followingId;
    
                const update2 = {
                    $inc: { followerCount: -1 }
                };
    
                await Promise.all([
                    this.updateOne(<any>DB_MODEL_REF.USER, query1, update1, {}),
                    this.updateOne(<any>DB_MODEL_REF.USER, query2, update2, {})
                ]);
                return true;
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
     * @function getFollowers
     */
    async getFollowers(userId: string, project = {}) {
        try {
            const pipeline = [
                {
                    $match: {
                        followingId: new mongoose.Types.ObjectId(userId)
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
                        'User._id': 1,
                        'User.username': 1,
                        'User.email': 1,
                        'User.accountVerify': 1,
                        'User.profilePic': 1
                    }
                }
            ]

            return await this.aggregate(<any>DB_MODEL_REF.FOLLOW, pipeline);
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function getFollowing
     */
    async getFollowing(userId: string, project = {}) {
        try {
            const pipeline = [
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: DB_MODEL_REF.USER,
                        localField: 'followingId',
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
                        'User._id': 1,
                        'User.username': 1,
                        'User.email': 1,
                        'User.accountVerify': 1,
                        'User.profilePic': 1
                    }
                }
            ]

            return await this.aggregate(<any>DB_MODEL_REF.FOLLOW, pipeline);
        }
        catch (error) {
            throw error;
        }
    }
}

export const followService = new FollowService();