"use strict";

import { userRoute as userRouteV1 } from "../modules/user";
import { postRoute as postRouteV1} from "../modules/post";
import { followRoute as followRouteV1 } from "../modules/FollowerFollowing";
import { notificationRoute as notificationRouteV1 } from "../modules/notification";
// import { commonRoute as commonRouteV1 } from "../modules/common";

export const routes: any = [

	...userRouteV1,
	...postRouteV1,
	...followRouteV1,
	...notificationRouteV1,
	// ...commonRouteV1
];