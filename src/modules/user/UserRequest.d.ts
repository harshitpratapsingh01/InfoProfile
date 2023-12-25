export declare namespace UserRequest {

	export interface SignUp {
		email: string;
		password: string;
		username: string;
        fullName: string;
		profilePic?: string;
		profileBio?: string;
		followerCount?: number;
		followingCount?: number;
		postCount?: number;
	}

	export interface editProfile{
		UserId: string;
		username?: string;
		profilePic?: string;
		profileBio?: string;
	}
	export interface VerifyOtp {
		email: string;
        otp: string;
	}

    export interface SendOtp {
		email: string;
	}

    export interface Login {
		email: string;
		password: string;
	}

    export interface ForgotPassword {
		email: string;
	}

    export interface ChangeForgotPassword extends Device {
		newPassword: string;
        UserId: any;
		authorization?: string;
	}
	export interface RemoveSession{
		userId: string
		deviceId: string
	}
	export interface GetUserProfile{
		userId: string;
		UserId: string;
	}

	export interface UserFeed{
		pageNo: number;
		limit: number;
	}

}