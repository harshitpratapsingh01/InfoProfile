// "use strict";

// import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import * as	fs from "fs";
// import * as path from "path";

// import * as appUtils from "../utils"
// import { image, video } from "../json/mime-type.json"
// import { SERVER, fileUploadExts } from "../config";

// export class ImageUtil {
//     private s3: S3Client;

//     constructor() {
//         this.s3 = new S3Client({
//             region: SERVER.S3.REGION,
//             credentials: {
//                 accessKeyId: SERVER.AWS_IAM_USER.ACCESS_KEY_ID,
//                 secretAccessKey: SERVER.AWS_IAM_USER.SECRET_ACCESS_KEY
//             },
//         });
//     }

//     private filters(file) {
//         const mimetypes = [
//             video.filter(v => v.extension === ".mp4")[0].mimetype,
//             video.filter(v => v.extension === ".flv")[0].mimetype,
//             video.filter(v => v.extension === ".mov")[0].mimetype,
//             video.filter(v => v.extension === ".avi")[0].mimetype,
//             video.filter(v => v.extension === ".wmv")[0].mimetype,

//             image.filter(v => v.extension === ".jpg")[0].mimetype,
//             image.filter(v => v.extension === ".jpeg")[0].mimetype,
//             image.filter(v => v.extension === ".png")[0].mimetype,
//             image.filter(v => v.extension === ".jpg")[0].mimetype,
//             image.filter(v => v.extension === ".svg")[0].mimetype,

//         ];

//         if (
//             fileUploadExts.indexOf(path.extname(file.hapi.filename.toLowerCase())) !== -1 &&
//             mimetypes.indexOf(file.hapi.headers["content-type"]) !== -1
//         ) {
//             return true;
//         }
//         return false;
//     }

//     /**
//      * @function uploadImage This Function is used to uploading image to S3 Server
//      */
//     private async _uploadToS3(fileName, fileBuffer, contentType) {
//         try {
//             const params = {
//                 Key: String(fileName),
//                 Body: fileBuffer,
//                 ContentType: contentType,
//                 Bucket: SERVER.S3.BUCKET_NAME,
//                 // ACL: "public-read"
//             }

//             const command = new PutObjectCommand(params);
//             const response = await this.s3.send(command);
//             const Location = `https://${params.Bucket}.s3.amazonaws.com/${fileName}`;
//             return {response,Location};
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     /**
//      * @function uploadSingleMediaToS3 This Function is used to upload single image to S3 Server
//      */
//     uploadSingleMediaToS3(file) {
//         console.log("content-type=========>", file.hapi.headers["content-type"]);
//         console.log("extension============>", path.extname(file.hapi.filename.toLowerCase()));
//         return new Promise((resolve, reject) => {
//             if (this.filters(file)) {
//                 const fileName = appUtils.getDynamicName(file);
//                 // const fileName = file.hapi.filename.split(".png")[0];
//                 const filePath = `${SERVER.UPLOAD_DIR}${fileName}`;
//                 console.log("filePath==========>", filePath);

//                 const r = file.pipe(fs.createWriteStream(filePath));
//                 r.on("close", () => {
//                     fs.readFile(filePath, (error, fileBuffer) => {
//                         if (error) reject(error);
//                         this._uploadToS3(fileName, fileBuffer, file.hapi.headers["content-type"])
//                             .then((data: any) => {
//                                 appUtils.deleteFiles(filePath);
//                                 const location = data.Location;
//                                 resolve(location);
//                             })
//                             .catch((error) => {
//                                 reject(error);
//                             });
//                     });
//                 });
//             } else {
//                 reject(new Error("Invalid file type!"));
//             }
//         });
//     }

//     async deleteFromS3(filename: string) {
//         try {
//             filename = filename.split("/").slice(-1)[0];
//             const params = {
//                 Bucket: SERVER.S3.BUCKET_NAME,
//                 Key: filename,
//             };

//             const command = new DeleteObjectCommand(params);
//             const response = await this.s3.send(command);

//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }
// }

// export const imageUtil = new ImageUtil();