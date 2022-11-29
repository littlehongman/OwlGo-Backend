import { Document } from "mongoose";

export type IUser = Document &{
	username: string;
	salt?: string;
	hash?: string;
    googleId?: string;
    
}

export type IProfile = Document & {
    // id: number,
	username: string;
    name: string;
	email: string;
    phone: string;
    birthday: string;
    zipCode: string;
    avatar: string;
    friends: string[];
	headline: string;
}

export interface IArticle{
    pid: number,
    author: {
        username: string,
        avatar: string
    }
    username: string,
    text: string,
    img: string,
    timestamp: number;
    comments: IComment[];
}

export interface IComment{
    cid: number,
    author: {
        username: string,
        avatar: string
    }
    text: string
    timestamp: number;
}
