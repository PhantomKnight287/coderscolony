/* eslint-disable @next/next/no-img-element */
import { NextApiRequest, NextApiResponse } from "next";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
	runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
	const { searchParams: query } = new URL(req.url);

	if (
		!query ||
		!query.get("title") ||
		!query.get("username") ||
		!query.get("name") ||
		!query.get("profileImage")
	)
		return new Response("Invalid query", { status: 400 });
	const title = query.get("title");
	const username = query.get("username");
	const name = query.get("name");
	const profileImage = query.get("profileImage");
	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					height: "100%",
					width: "100%",
					textAlign: "center",
					backgroundColor: "white",
					fontFamily: "outfit",
				}}
				tw="flex-col"
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "nowrap",
						width: "100%",
						margin: "0",
						padding: "10px",
					}}
				>
					<button
						style={{
							backgroundColor: "rgba(76, 169, 175, 0.1)",
							borderColor: "rgba(76, 169, 175, 0.1)",
							color: "rgb(76, 169, 175)",
							borderRadius: "6px",
							padding: "5px",
							marginTop: "10px",
							marginBottom: "10px",
							marginLeft: "20px",
						}}
					>
						<div style={{ display: "flex" }}>
							<div
								style={{
									margin: "0px",
									color: "rgb(76, 169, 175)",
									display: "flex",
									alignItems: "center",
									flexDirection: "row",
								}}
							>
								<div
									style={{
										color: "rgb(76, 169, 175)",
										cursor: "pointer",
										opacity: 1,
										padding: 0,
										borderRadius: 4,
										backgroundColor: "transparent",
										display: "flex",
										position: "relative",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>
						</div>
						<div>Blog</div>
					</button>
					<div
						style={{
							display: "flex",
							marginLeft: "auto",
							marginRight: "20px",
						}}
						tw="rounded-md p-1 bg-blue-100/75"
					>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<img
								src={profileImage ? profileImage : ""}
								alt="Image"
								style={{
									// margin: "0 30px",
									aspectRatio: "1/1",
									objectFit: "cover",
									borderRadius: "50%",
									width: "50px",
								}}
							/>
							<div tw="flex flex-col p-0 m-0">
								<p
									style={{
										lineClamp: 2,
									}}
									tw="p-0 m-0 pl-2"
								>
									{name}
								</p>
								<p tw="m-0 text-left pl-2 mt-1 text-gray-600">
									@{username}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div tw="text-center w-full h-[70vh] flex flex-col items-center justify-center font-bold text-xl">
					{title}
				</div>
			</div>
		),
		{
			width: 800,
			height: 400,
		}
	);
}
