export declare namespace PostRequest {

    export interface PostId{
        postId: string;
    }

	export interface CreatePost {
		UserId: any;
		content: string;
        caption?: string;
        postStatus: boolean;
        likeCount: bigint;
        commentCount: bigint;
	}

    export interface EditPost{
        postId: any;
        UserId: any;
        caption?: string;
    }
	
    export interface GetPost{
        UserId: string;
        userId: string;
        postId: string;
    }

    export interface PostLike{
        UserId: string;
        postId: string;
        likeStatus: boolean;
    }

    export interface PostComment{
        UserId: string;
        postId: string;
        comment: string;
        commentId: string;
        commentStatus: boolean;
    }

    export interface ReportPost{
        UserId: string;
        postId: string;
    }
}