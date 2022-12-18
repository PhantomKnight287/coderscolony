import {
	Anchor,
	Button,
	Container,
	Paper,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import clsx from "clsx";
import { MetaTags } from "@components/meta";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { signIn } from "@services/auth";
import { showNotification } from "@mantine/notifications";
import { useUser, useUserDispatch } from "@hooks/user";
import { useRouter } from "next/router";
import { createCookie, readCookie } from "@helpers/cookies";
import { useEffect } from "react";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";

export default function Login() {
	const formState = useForm({
		initialValues: {
			email: "",
			password: "",
		},
		validate: {
			password: (p) =>
				p.length < 8 ? "Password Must be 8 Characters Long" : null,
		},
	});
	const dispatch = useUserDispatch();
	const { id } = useUser();
	const { replace, query, isReady } = useRouter();
	useCollapsedSidebar();
	const handleFormSubmit = (e: typeof formState.values) => {
		signIn(e.email, e.password)
			.then((d) => d.data)
			.then((d) => {
				createCookie("token", d.token);
				dispatch({
					type: "SetUser",
					payload: d.user,
				});
				replace("/");
			})
			.catch((err) => {
				showNotification({
					message: err.response?.data?.message || "An Error Occured",
					color: "red",
				});
			});
	};

	useEffect(() => {
		if (id && readCookie("token")) return void replace("/");
	}, [id]);

	useEffect(() => {
		if (query.message) {
			showNotification({
				message: query.message,
			});
		}
	}, [isReady]);
	useHydrateUserContext();
	return (
		<>
			<MetaTags
				title="Welcome Back!"
				description="Login To Your Account to Customize Your Profile"
			/>
			<Container className={clsx("mt-20")} size={420} my={40}>
				<Title
					align="center"
					sx={(theme) => ({
						fontFamily: `Greycliff CF, ${theme.fontFamily}`,
						fontWeight: 900,
					})}
				>
					Welcome back!
				</Title>
				<Text color="dimmed" size="sm" align="center" mt={5}>
					Do not have an account yet?{" "}
					<Anchor href="/auth/signup" size="sm" component={Link}>
						Create account
					</Anchor>
				</Text>
				<Paper withBorder shadow="md" p={30} mt={30} radius="md">
					<form
						onSubmit={formState.onSubmit((d) =>
							handleFormSubmit(d)
						)}
					>
						<TextInput
							label="Email"
							placeholder="you@developer.me"
							required
							type="email"
							{...formState.getInputProps("email")}
						/>
						<PasswordInput
							label="Password"
							placeholder="Your password"
							required
							mt="md"
							{...formState.getInputProps("password")}
						/>
						{/* <Group position="right" mt="md">
              <Anchor
                onClick={(event) => event.preventDefault()}
                href="/auth/reset-password"
                size="sm"
                component={Link}
              >
                Forgot password?
              </Anchor>
            </Group> */}
						<Button
							fullWidth
							mt="xl"
							type="submit"
							className="bg-[#1864ab] bg-opacity-80 hover:scale-110  duration-[110ms]"
						>
							Login
						</Button>
					</form>
				</Paper>
			</Container>
		</>
	);
}
