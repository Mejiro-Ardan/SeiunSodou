declare global {
	interface ArticleDetail {
		code: string;
		data: Article;
	}
	interface Article {
		_id: string;
		slug: number;
		title: string;
		summary: string;
		category: string;
		tags: string[];
		author: {
			_id: string;
			uid: number;
			avatar: string;
			nick: string;
			post_count: number;
			bio: string;
		};
		created: string;
		modified: string | null;
		image: string;
		text: string;
	}
	interface ArticleCategories {
		code: string;
		categories: string[];
	}
	interface PagingData {
		page: number;
		size: number;
		total: number;
		totalPages: number;
		articles: Article[];
	}
	interface JWTPayload {
		uid: string;
		exp: number;
		email: string;
		role: string;
		iat: number;
	}
	interface UserInfoResponse {
		code: string;
		message?: string;
		status: string;
		data?: {
			uid: string;
			avatar: string;
			nick: string;
			bio: string;
			post_count: number;
			register_time: string;
			email: string;
		}
	}
	interface Status {
		code: string;
		message: string;
		uid?: number;
		tokenCreated?: number;
		status: string;
		error?: string;
	}

	interface UserInfo {
		uid: number;
		avatar: string;
		nick: string;
		bio: string;
		post_count: number;
		register_time: number;
		email: string;
	}

	interface AuthState {
		token: string | null;
		Status: Status | null;
		userInfo: UserInfo | null;
	}
}

export { };