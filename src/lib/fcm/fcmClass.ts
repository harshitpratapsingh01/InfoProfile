
import { toObjectId } from "../../utils";
import { baseEntity } from "../../modules/baseEntity";
import { DB_MODEL_REF } from "../../config";

const fs = require("fs");
const path = require('path');
var FCM = require('fcm-node');


export const sendPushNotification = async (userId, message) => {

  try {

    console.log('User Id:- ' + userId);
    console.log('message:- ' + message);

    fs.readFile(path.join(__dirname, '../../../../src/lib/fcm/firebaseConfig.json'), "utf8", async (err, jsonString) => {
      if (err) {
        console.log("Error reading file from disk:", err);
        return err;
      }
      try {

        //firebase push notification send
        const data = JSON.parse(jsonString);
        let serverKey = data.SERVER_KEY;
        let fcm = new FCM(serverKey);

        const query: any = {};
        query.userId = toObjectId(userId)
        let push_tokens = await baseEntity.find(<any>DB_MODEL_REF.SESSION, query,{});

        let reg_ids = [];
        push_tokens.forEach(token => {
          reg_ids.push(token.fcm_token)
        })

        if (reg_ids.length > 0) {
          console.log(reg_ids);
          let pushMessage = {
            registration_ids: reg_ids,
            content_available: true,
            mutable_content: true,
            notification: {
              body: message,
              icon: 'myicon',
              sound: 'mySound',
            },
          };

          fcm.send(pushMessage, function (err, response) {
            if (err) {
              console.log("Something has gone wrong!", err);
            } else {
              console.log("Push notification sent.", response);
            }
          });

        }


      } catch (err) {
        console.log("Error parsing JSON string:", err);
      }
    });

  } catch (error) {
    console.log(error);
  }

}