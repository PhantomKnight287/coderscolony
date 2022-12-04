import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { AppProps } from "next/app";
import "../styles/globals.css";
import { SpotlightProvider } from "@mantine/spotlight";
import { IconMoonStars, IconSunHigh } from "@tabler/icons";
import { Header } from "../components/header";
import { NotificationsProvider } from "@mantine/notifications";
import { motion, AnimatePresence } from "framer-motion";
import { RouterTransition } from "@components/router";
import { UserProvider } from "../context/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ModalsProvider } from "@mantine/modals";
import Layout from "../layouts";
import { DrawerProvider } from "../context/drawer";
import { SidebarProvider } from "../context/sidebar";
import "../styles/code.scss";

export const client = new QueryClient();

export default function App(props: AppProps) {
	const { Component, ...pageProps } = props;
	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: "mantine-color-scheme",
		defaultValue: "light",
		getInitialValueInEffect: true,
	});

	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

	return (
		<SidebarProvider>
			<QueryClientProvider client={client}>
				<DrawerProvider>
					<UserProvider>
						<ColorSchemeProvider
							colorScheme={colorScheme}
							toggleColorScheme={toggleColorScheme}
						>
							<MantineProvider
								theme={{
									colorScheme,
									fontFamily: "Inter",
									white: "#ffffff",
									globalStyles: (theme) => ({
										body: {
											backgroundColor:
												theme.colorScheme === "dark"
													? "#171718"
													: "unset",
										},
									}),
								}}
								withGlobalStyles
								withNormalizeCSS
								withCSSVariables
							>
								<SpotlightProvider
									actions={[
										{
											title: "Toggle Theme",
											onTrigger: () =>
												toggleColorScheme(),
											description:
												"Toggle Theme Between Light and Dark Mode",
											icon:
												colorScheme === "dark" ? (
													<IconSunHigh size={24} />
												) : (
													<IconMoonStars size={24} />
												),
											keywords: [
												"theme",
												"dark",
												"light",
											],
										},
									]}
									shortcut="mod + J"
								>
									<NotificationsProvider>
										<ModalsProvider>
											<Header />
											<ReactQueryDevtools />
											<RouterTransition />
											<Layout>
												<AnimatePresence mode="wait">
													<motion.div
														variants={{
															initial: {
																opacity: 0,
															},
															animate: {
																opacity: 1,
															},
															exit: {
																opacity: 0,
															},
														}}
														initial="initial"
														animate="animate"
														exit="exit"
														key={
															pageProps.router
																.pathname
														}
													>
														<Component
															{...pageProps}
														/>
													</motion.div>
												</AnimatePresence>
											</Layout>
										</ModalsProvider>
									</NotificationsProvider>
								</SpotlightProvider>
							</MantineProvider>
						</ColorSchemeProvider>
					</UserProvider>
				</DrawerProvider>
			</QueryClientProvider>
		</SidebarProvider>
	);
}
