import {
	Anchor,
	Button,
	Container,
	Group,
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
import { signIn, signUp } from "@services/auth";
import { showNotification } from "@mantine/notifications";
import { useUser, useUserDispatch } from "@hooks/user";
import { createCookie, readCookie } from "@helpers/cookies";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";

export default function SignUP() {
	const formState = useForm({
		initialValues: {
			email: "",
			password: "",
			username: "",
			name: "",
		},
		validate: {
			password: (p) =>
				p.length < 8 ? "Password Must be 8 Characters Long" : null,
		},
	});
	const dispatch = useUserDispatch();
	const { id } = useUser();
	const { replace } = useRouter();
	useCollapsedSidebar();
	const handleFormSubmit = (e: typeof formState.values) => {
		signUp(e)
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
	useHydrateUserContext();
	return (
		<>
			<MetaTags
				title="Welcome!"
				description="Create New Account To Meet Other Developers"
			/>
			<Container className={clsx("mt-20")} size={420} my={40}>
				<Title
					align="center"
					sx={(theme) => ({
						fontFamily: `Greycliff CF, ${theme.fontFamily}`,
						fontWeight: 900,
					})}
				>
					Welcome!
				</Title>
				<Text color="dimmed" size="sm" align="center" mt={5}>
					Already have an account?{" "}
					<Anchor href="/auth/login" size="sm" component={Link}>
						Login
					</Anchor>
				</Text>
				<Paper withBorder shadow="md" p={30} mt={30} radius="md">
					<form
						onSubmit={formState.onSubmit((d) =>
							handleFormSubmit(d)
						)}
					>
						<TextInput
							label="Name"
							placeholder="John Doe"
							required
							{...formState.getInputProps("name")}
						/>
						<TextInput
							label="Username"
							placeholder="johndoe"
							required
							value={formState.values.username}
							onChange={(e) => {
								formState.setFieldValue(
									"username",
									e.target.value
										.replace(" ", "")
										.replace(/[^a-zA-Z0-9_ ]/g, "")
								);
							}}
						/>
						<TextInput
							label="Email"
							placeholder="you@developer.me"
							required
							type="email"
							mt="md"
							{...formState.getInputProps("email")}
						/>
						<PasswordInput
							label="Password"
							placeholder="Your password"
							required
							mt="md"
							{...formState.getInputProps("password")}
						/>
						<Button
							fullWidth
							mt="xl"
							type="submit"
							className="bg-[#1864ab] bg-opacity-80 hover:scale-110  duration-[110ms]"
						>
							Sign in
						</Button>
					</form>
				</Paper>
			</Container>
		</>
	);
}
