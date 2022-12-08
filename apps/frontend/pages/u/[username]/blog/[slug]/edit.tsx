import { Container } from "@components/container";
import { Editor } from "@components/editor";
import Image from "@components/image/with-loader";
import { outfit } from "@fonts/index";
import { readCookie } from "@helpers/cookies";
import { imageResolver } from "@helpers/profile-url";
import { getMarkdownString } from "@helpers/showdown";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { Button, Group, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FormStatus } from "@mantine/form/lib/types";
import { showNotification } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function EditBlog() {
	useCollapsedSidebar();
	const { isReady, query } = useRouter();
	async function fetcher(): Promise<{
		content: string;
		description: string;
		ogImage: string;
		title: string;
	}> {
		const data = await fetch(`/api/blog-edit/${query.slug}`, {
			headers: {
				authorization: `Bearer ${readCookie("token")}`,
			},
		});
		const body = await data.json();
		if (data.ok) return body;
		throw new Error(body.message);
	}

	const { data, error, isLoading, refetch } = useQuery(["blog"], fetcher, {
		enabled: isReady,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
	const formState = useForm({
		initialValues: {
			description: "",
			title: "",
			content: "",
			ogImage: "",
		},
	});
	useHydrateUserContext();
	useEffect(() => {
		if (isLoading || !data) return;
		formState.resetDirty({
			content: data.content,
			description: data.description,
			ogImage: data.ogImage,
			title: data.title,
		});
	}, [isLoading]);

	function updateBlog(values: typeof formState.values) {
		axios
			.post(`/api/blog-edit/${query.slug}/edit`, values, {
				headers: {
					authorization: `Bearer ${readCookie("token")}`,
				},
			})
			.then(() => {
				refetch();
				formState.resetDirty();
				return showNotification({
					message: "Blog Updated Successfully",
					color: "green",
				});
			})
			.catch((err) => {
				return showNotification({
					message:
						err?.repsonse?.data?.message || "Something went wrong",
					color: "red",
				});
			});
	}
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center">
				<p className="text-2xl">{(error as Error).message}</p>
			</div>
		);
	}

	return (
		<Container>
			{data ? (
				<>
					<div className="flex flex-col items-center justify-center">
						<h1 className={`mb-1 ${outfit.className}`}>
							Edit Blog
						</h1>
						<p className={`mb-4 ${outfit.className} text-sm `}>
							(Editing Blog will not change its slug)
						</p>
					</div>
					<Image
						src={imageResolver(formState.values.ogImage)}
						alt="Banner Image"
					/>
					<form onSubmit={formState.onSubmit((d) => updateBlog(d))}>
						<SimpleGrid
							cols={2}
							breakpoints={[
								{ cols: 1, maxWidth: 600, spacing: "sm" },
							]}
							my="lg"
						>
							<TextInput
								label="Title"
								required
								{...formState.getInputProps("title")}
							/>
							<TextInput
								label="Description"
								required
								{...formState.getInputProps("description")}
							/>
						</SimpleGrid>
						<div className="mt-4">
							<Editor
								content={formState.values.content}
								setContent={(d) =>
									formState.setFieldValue(
										"content",
										d as string
									)
								}
								createPost={() => {}}
							/>
						</div>
						{formState.isDirty() ? (
							<Group position="center" my="md">
								<Button variant="outline" type="submit">
									Update
								</Button>
							</Group>
						) : null}
					</form>
				</>
			) : null}
		</Container>
	);
}

export default EditBlog;
