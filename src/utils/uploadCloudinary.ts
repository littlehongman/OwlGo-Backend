import cloudinary from "cloudinary"

import { Request } from 'express';

export const uploadImage = async(req: Request) => {
    const uploadFinished = (err: any, result: any) => {
        return result.url;
    }

    cloudinary.v2.uploader.upload_stream({ resource_type: "image" }, uploadFinished).end(req.file!.buffer);
} 
