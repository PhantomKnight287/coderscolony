import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).end("Method not allowed");
	}
	// check if secret provided is correct
	if (req.body.secret !== process.env.SECRET) {
		return res.status(401).end("Unauthorized");
	}
	// get the "route" from the request body and ISR it
	const { route } = req.body;

	res.revalidate(route);
	return res.send("ok");
}
