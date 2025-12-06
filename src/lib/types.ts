export type HttpResponse<T, M = undefined> = {
	message: string;
	data: T;
	meta?: M;
};

export type GormModel = {
	CreatedAt: string;
	UpdatedAt: string;
	DeletedAt: null | string;
};

export type PaginatedMeta = {
	total_count: number;
	total_page: number;
	page: number;
	count: number;
};

export type GetAuthMe = {
	ID: string;
	Email: string;
	Name: string;
	Role: string;
} & GormModel;

export type PostAuthLogin = {
	accessToken: string;
	refreshToken: string;
};

export type PostAuthRefesh = {
	accessToken: string;
};

export type GetUser = {
	ID: string;
	Email: string;
	Name: string;
	Role: string;
} & GormModel;
