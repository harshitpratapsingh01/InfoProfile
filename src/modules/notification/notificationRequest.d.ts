export declare namespace NotificationRequest {

	export interface Id {
		notificationId: string;
	}

	export interface Add {
		eventId?: string;
		senderId: string;
		receiverId: string;
		activityId:string;
		title: string;
		message: string;
		type: string;
        image: string;
	}
}