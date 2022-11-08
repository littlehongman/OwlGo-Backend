
export interface IUser{
	username: string;
	salt: string;
	hash?: string;
}

export interface IProfile{
    id: number,
	username: string;
    name: string;
	email: string;
    phone: string;
    birthday: string;
    zipCode: string;
    avatar: string;
    friends: number[];
	headline: string;
}

export interface IArticle{
    id: number,
    userId: number,
    text: string,
    img: string,
    timestamp: string;
    comments: string[];
}
