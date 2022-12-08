import { User } from "db";
export interface LoginResponse {
	token: string;
	user: Exclude<User, "password">;
}
export type SignUpResponse = LoginResponse;
