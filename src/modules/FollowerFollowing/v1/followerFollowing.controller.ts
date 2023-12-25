"use strict";
import { FollowServiceV1 } from "..";
import { MESSAGES } from "../../../config";
import { UserServiceV1 } from "../../user";
import { FollowRequest } from "../followerFollowing.request";


export class FollowController{
    /**
     * @function followUser
     * @description  follow a user
     * @param params.userId: user ID the user who follow the other users (required)
     * @param params.followingId: Following Id the user wants to follow (required)
     */
    async followUser(params: FollowRequest.FollowUser){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }

            const isFollowing = await FollowServiceV1.findUserById(params);
            if(isFollowing){
                return Promise.reject(MESSAGES.ERROR.FOLLOWING_ALREADY_EXIST)
            }

            if(params.UserId == params.followingId){
                return MESSAGES.ERROR.CANT_FOLLOW_USER;
            }

            const result = await FollowServiceV1.followUser(params);
            if(result){
                return MESSAGES.SUCCESS.ADD_FOLLOWING;
            }
            else{
                return MESSAGES.ERROR.BAD_GATEWAY;
            }
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function unfollowUser
     */
    async unfollowUser(params: FollowRequest.FollowUser){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }

            const isFollowing = await FollowServiceV1.findUserById(params);
            if(!isFollowing){
                return Promise.reject(MESSAGES.ERROR.FOLLOWING_NOT_FOUND);
            }
            
            const result = await FollowServiceV1.unfollowUser(params);
            if(result){
                return MESSAGES.SUCCESS.REMOVE_FOLLOWING;
            }
            else{
                return MESSAGES.ERROR.BAD_GATEWAY;
            }
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function getFollowers
     */
    async getFollowers(params: FollowRequest.FollowUser){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const result = await FollowServiceV1.getFollowers(params.userId);
            return MESSAGES.SUCCESS.LIST({Followers:result});
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function getFollowing
     */
    async getFollowing(params: FollowRequest.FollowUser){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const result = await FollowServiceV1.getFollowing(params.userId);
            return MESSAGES.SUCCESS.LIST({Following:result});
        }
        catch(error){
            throw error;
        }
    }
}

export const followController = new FollowController();