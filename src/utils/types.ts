
export interface IUser{
	username: string;
	salt: string;
	hash?: string;
}

export interface IProfile{
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
    username: string,
    text: string,
    img: string,
    timestamp: string;
    comments: IComment[];
}

export interface IComment{
    cid: number,
    username: string,
    text: string
    timestamp: string;
}
