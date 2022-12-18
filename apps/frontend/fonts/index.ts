import { Inter, Outfit, Space_Grotesk } from "@next/font/google";

export const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const spaceGrotest = Space_Grotesk({
	variable: "--font-space-grotest",
	subsets: ["latin"],
});

export const outfit = Outfit({
	variable: "--font-outfit",
	weight: ["400", "700"],
	subsets: ["latin"],
});
