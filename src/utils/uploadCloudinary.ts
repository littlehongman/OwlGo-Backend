import cloudinary from "cloudinary"

import { Request } from 'express';

export const uploadImage = async(req: Request) => {
    // const uploadFinished = (err: any, result: any) => {
    //     return result.url;
    // }
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream({ resource_type: "image" }, (err: any, result: any) => {
            if (err) return reject(err);
            return resolve(result.url);
        }).end(req.file!.buffer);
    })
} 
