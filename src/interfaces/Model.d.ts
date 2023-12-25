declare interface UserId {
	UserId: string;
}

declare interface Device {
	platform?: string;
	authorization?: string;
	language?: string;
}
declare interface ListingRequest extends Pagination, Filter {
	timezone?: string;
}
declare interface JwtPayload {
	sub: string;
	iat: number;
	exp: number;
}

declare interface TokenData extends Device, UserId {
	name?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	countryCode?: string;
	mobileNo?: string;
	userType?: string;
	// status?: number;
	isApproved?: boolean;
	profileSteps?: string[];
	profilePicture?: string;
	created?: number;
}

declare interface ChangePasswordRequest {
	password: string;
	oldPassword: string;
}

declare interface ComposeMail {
	email: string;
	subject: string;
	message: string;
	name: string;
}

declare interface Pagination {
	pageNo?: number;
	limit?: number;
}

declare interface ListingRequest extends Pagination, Filter {
	timezone?: string;
}

declare interface VerifyOTP {
	email: string;
	otp: string;
}

interface Interests {
	_id: string;
	name: string;
	image: string;
}

// Model Type For DAO manager
export declare type ModelNames =
	"users" |
	"sessions" |
	"posts" |
	"follows" |
	"likes" |
	"comments" |
	"reportposts" |
	"notifications" ;