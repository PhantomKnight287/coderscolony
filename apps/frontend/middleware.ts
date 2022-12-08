import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	if (
		request.cookies.get("token") === undefined &&
		request.nextUrl.pathname !== "/"
	) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}
	if (request.cookies.get("token") && request.nextUrl.pathname === "/")
		return NextResponse.redirect(new URL("/dashboard", request.url));
	return NextResponse.next();
}
export const config = {
	matcher: ["/dashboard", "/"],
};
