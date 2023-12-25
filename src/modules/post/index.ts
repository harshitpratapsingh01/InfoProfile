"use strict";

export {posts, likes, comments, reportposts} from "./post.model";
export {postService as PostServiceV1} from "./v1/post.service"
export {postController as PostControllerV1} from "./v1/post.controller"
export {postRoute} from "./v1/post.routes"