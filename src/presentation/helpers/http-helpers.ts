import { IHttpResponse } from "../protocols";

export const badRequest = (error: Error): IHttpResponse => ({
	statusCode: 400,
	body: error,
});
export const serverError = (): IHttpResponse => ({
	statusCode: 500,
	body: null,
});
export const forbidden = (error: Error): IHttpResponse => ({
	statusCode: 403,
	body: error,
});
export const ok = (body: any = null): IHttpResponse => ({
	statusCode: 200,
	body,
});
