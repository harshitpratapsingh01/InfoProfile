import { PostServiceV1 } from "..";
import { MESSAGES } from "../../../config";
import { UserServiceV1 } from "../../user";
import { PostRequest } from "../post.request";

export class PostController{
    /**
     * @function createPost
     * @description  user create post
     * @param params.userId: user's ID (required)
     * @param params.content: Picture or Video User's want's to post (required)
     */
    async createPost(params: PostRequest.CreatePost){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }

            const data = await PostServiceV1.createPost(params);
            if(data){
                return MESSAGES.SUCCESS.POST({id:data._id});
            }
            else{
                return MESSAGES.ERROR.CANT_POST;
            }
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function editPost
     */
    async editPost(params: PostRequest.EditPost){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const postExist = await PostServiceV1.findPostById(params.postId); // to check is post exists or not 
            if(!postExist){
                return Promise.reject(MESSAGES.ERROR.POST_NOT_FOUND);
            }
            const result = await PostServiceV1.editPostById(params);
            return MESSAGES.SUCCESS.EDIT_POST_DETAILS;
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function deletePost
     */
    async deletePost(params){
        try{
            const isExist = await PostServiceV1.findPostById(params.postId); // to check is post exists or not 
            if(!isExist){
                return Promise.reject(MESSAGES.ERROR.POST_NOT_FOUND);
            }
            const result = await PostServiceV1.deletePost(params);
            if(result){
                return MESSAGES.SUCCESS.DELETE_POST;
            }
            else{
                return MESSAGES.ERROR.ALREADY_DELETED_POST;
            }
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function getMyPost
     */
    async getMyPost(params: PostRequest.GetPost){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const result = await PostServiceV1.getPost(params.UserId);
            return MESSAGES.SUCCESS.LIST({Posts: result});
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function getUserPost
     */
    async getUserPost(params: PostRequest.GetPost){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const result = await PostServiceV1.getPost(params.userId);
            return MESSAGES.SUCCESS.LIST({Posts: result});
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function getSinglePost
     */
    async getSinglePost(params: PostRequest.GetPost){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const result = await PostServiceV1.getSinglePost(params);
            return MESSAGES.SUCCESS.LIST(result);
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function postLike
     * @description like a post
     * @param params.postId Post Id (required)
     */
    async postLike(params: PostRequest.PostLike){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const isPost = await PostServiceV1.findPostById(params.postId); // to check is post exists or not 
            if(!isPost){
                return Promise.reject(MESSAGES.ERROR.POST_NOT_FOUND);
            }

            const result = await PostServiceV1.postLike(params);
            if(result){
                return MESSAGES.SUCCESS.LIKE_POST;
            }
            else{
                return MESSAGES.ERROR.ALREADY_LIKED_POST;
            }
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function postLike
     * @description dislike a post
     * @param params.postId Post Id (required)
     */
    async postDislike(params: PostRequest.PostLike){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const isPost = await PostServiceV1.findPostById(params.postId); // to check is post exists or not 
            if(!isPost){
                return Promise.reject(MESSAGES.ERROR.POST_NOT_FOUND);
            }

            const result = await PostServiceV1.postDislike(params);
            if(result){
                return MESSAGES.SUCCESS.UNLIKE_POST;
            }
            else{
                return MESSAGES.ERROR.CANT_DISLIKE_POST;
            }
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function postLikesList
     * @param params.postId Post Id (required)
     */
    async postLikesList(params: PostRequest.PostLike){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const isPost = await PostServiceV1.findPostById(params.postId); // to check is post exists or not 
            if(!isPost){
                return Promise.reject(MESSAGES.ERROR.POST_NOT_FOUND);
            }

            const result = await PostServiceV1.postLikesList(params);
            return MESSAGES.SUCCESS.LIST({Likes: result});
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function createComment
     * @description comment on a post
     * @param params.postId Post id (required)
     * @param params.comment comment on post (required)
     */
    async createComment(params: PostRequest.PostComment){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const isPost = await PostServiceV1.findPostById(params.postId); // to check is post exists or not 
            if(!isPost){
                return Promise.reject(MESSAGES.ERROR.POST_NOT_FOUND);
            }

            const result:any = await PostServiceV1.createComment(params);
            if(result.status){
                return MESSAGES.SUCCESS.ADD_COMMENT(result.comment);
            }
            else{
                return MESSAGES.ERROR.CANT_ADD_COMMENT;
            }
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function createComment
     * @description comment on a post
     * @param params.postId Post id (required)
     * @param params.commentId Comment id (required)
     */
    async deleteComment(params: PostRequest.PostComment){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const isPost = await PostServiceV1.findPostById(params.postId); // to check is post exists or not 
            if(!isPost){
                return Promise.reject(MESSAGES.ERROR.POST_NOT_FOUND);
            }

            const result = await PostServiceV1.deleteComment(params, isPost);
            if(result){
                return MESSAGES.SUCCESS.DELETE_COMMENT;
            }
            else{
                return MESSAGES.ERROR.ALREADY_DELETED_COMMENT;
            }
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function listComment
     * @description list comment's on a post
     * @param params.postId Post id (required)
     */
    async listComment(params: PostRequest.PostComment){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const isPost = await PostServiceV1.findPostById(params.postId); // to check is post exists or not 
            if(!isPost){
                return Promise.reject(MESSAGES.ERROR.POST_NOT_FOUND);
            }

            const result = await PostServiceV1.listComment(params);
            return MESSAGES.SUCCESS.LIST({Comments: result});
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function editComment
     * @param params.postId Post id (required)
     * @param params.commentId Comment id (required)
     */
    async editComment(params: PostRequest.PostComment){
        try{
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is userId exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const isPost = await PostServiceV1.findPostById(params.postId); // to check is post exists or not 
            if(!isPost){
                return Promise.reject(MESSAGES.ERROR.POST_NOT_FOUND);
            }

            const result = await PostServiceV1.editComment(params);
            if(result){
                return MESSAGES.SUCCESS.EDIT_COMMENT;
            }
            else{
                return MESSAGES.ERROR.CANT_EDIT_COMMENT;
            }
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @function reportPost
     * @description User can report post
     * @param params.userId // user id (required)
     * @param params.postId // post id (required)
     */
    async reportPost(params: PostRequest.ReportPost){
        try{
            const [isExist, isPost] = await Promise.all([
                UserServiceV1.findUserById(params.UserId),
                PostServiceV1.findPostById(params.postId)
            ])  // to check is userId exists or not // to check is post exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            } 
            if(!isPost){
                return Promise.reject(MESSAGES.ERROR.POST_NOT_FOUND);
            }

            if(params.UserId == isPost.userId.toString()){
                return Promise.reject(MESSAGES.ERROR.CANT_REPORT_POST);
            }

            const result = await PostServiceV1.reportPost(params);
            return MESSAGES.SUCCESS.REPORT_POST;

        }
        catch(error){
            throw error;
        }
    }
}

export const postController = new PostController()