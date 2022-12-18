import { SingleFileDropzone } from "@components/dropzones/single";
// import { Editor } from "@components/editor";
import Label from "@components/label";
import { MetaTags } from "@components/meta";
import { readCookie } from "@helpers/cookies";
import { slugify } from "@helpers/slugify";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import {
	Button,
	Group,
	Modal,
	Select,
	TextInput,
	useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { uploadSingleFile } from "@services/upload";
import clsx from "clsx";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { createBlog as createBlogWithApi } from "@services/blogs";
import { useRouter } from "next/router";
import { useUser } from "@hooks/user";
import { Editor } from "@components/editor";
import { Container } from "@components/container";
import { createSeries, fetchSeriesByUsername } from "@services/series.service";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";

function CreateBlog() {
	const { getInputProps, values, onSubmit, isDirty, setFieldValue } = useForm(
		{
			initialValues: {
				content: "",
				title: "",
				description: "",
				seriesId: "",
			},
		}
	);
	const [submitModal, setSubmitModal] = useState(false);
	const [file, setFile] = useState<File>();
	const [loading, setLoading] = useState(false);
	const { colorScheme } = useMantineColorScheme();
	const { push } = useRouter();
	const { username } = useUser();
	const [optionPrompt, setOptionPrompt] = useState(false);
	const [createSeriesPrompt, setCreateSeriesPrompt] = useState(false);
	const [series, setSeries] = useState<{ id: string; title: string }[]>([]);

	useEffect(() => {
		fetchSeriesByUsername(username)
			.then((d) => d.data)
			.then((d) => {
				setSeries(d);
			})
			.catch(() => {
				showNotification({
					message: "An error occured while fetching series.",
					color: "red",
				});
			});
	}, []);

	useHydrateUserContext();
	const seriesFormState = useForm({
		initialValues: {
			title: "",
			description: "",
		},
	});
	const [seriesBannerImage, setSeriesBannerImage] = useState<File>();

	async function createBlog() {
		console.log(values);
		const { content, title, description, seriesId } = values;
		let path = null;

		setLoading(true);
		if (file) {
			const link = await uploadSingleFile(file, readCookie("token")!)
				.then((d) => d.data)
				.catch((err) => null);
			if (link === null) {
				setLoading(false);
				return showNotification({
					message: "An error occured while uploading image.",
					color: "red",
				});
			}
			path = link.path;
		} else {
			path = null;
		}
		createBlogWithApi({
			content,
			title,
			ogImage: path,
			token: readCookie("token")!,
			description,
			seriesId,
		})
			.then((d) => d.data)
			.then((d) => {
				setSubmitModal(false);
				showNotification({
					message: "Blog Create Successfully. 👌",
					color: "green",
				});
				push(`/u/${username}/blog/${d.slug}`);
			})
			.catch((err) => {
				console.log(err.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}
	useCollapsedSidebar();

	return (
		<>
			<MetaTags description="Create New Blog" title="Create New Blog" />
			<Container>
				<form
					onSubmit={onSubmit((d) => {
						setSubmitModal(true);
					})}
				>
					<TextInput
						placeholder="An interesting title"
						required
						{...getInputProps("title")}
						mb="xl"
						size="xl"
						className={
							(clsx(""),
							{
								"bg-[#171718]": colorScheme === "dark",
							})
						}
						classNames={{
							input: clsx("border-none", {
								"bg-[#171718]": colorScheme === "dark",
							}),
						}}
					/>
					<Editor
						content={values.content}
						createPost={() => setSubmitModal((o) => !o)}
						setContent={(content) =>
							setFieldValue("content", content as string)
						}
						slug={`${slugify(values.title)}-${nanoid(10)}`}
						clickOnSendIconHandler={() => setSubmitModal((o) => !o)}
						size="xl"
						classNames={{
							input: clsx("border-none", {
								"bg-[#171718]": colorScheme === "dark",
							}),
						}}
					/>
					{isDirty("content") && isDirty("title") ? (
						<Group mt="xl" position="center">
							<Button
								variant="outline"
								color="cyan"
								type="submit"
							>
								Create
							</Button>
						</Group>
					) : null}
				</form>
			</Container>
			<Modal
				centered
				title="Create Blog"
				onClose={() => setSubmitModal((o) => !o)}
				opened={submitModal}
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						createBlog();
					}}
				>
					<TextInput
						mt="md"
						mb="md"
						label="Description"
						required
						placeholder="A description for your blog."
						{...getInputProps("description")}
					/>
					<Select
						data={series.map((d) => ({
							value: d.id,
							label: d.title,
						}))}
						mt="md"
						mb="md"
						label="Series"
						placeholder="Series"
						allowDeselect
						{...getInputProps("seriesId")}
					/>

					<Label required={false}>Banner Image</Label>
					<SingleFileDropzone file={file} setFile={setFile} />
					<Group mt="xl">
						<Button
							variant="outline"
							color="green"
							onClick={() => {
								setOptionPrompt(true);
							}}
							loading={loading}
							fullWidth
						>
							Add Blog to Series
						</Button>
						<Button
							variant="outline"
							color="blue"
							type="submit"
							loading={loading}
							fullWidth
						>
							Create
						</Button>
					</Group>
				</form>
			</Modal>
			<Modal
				centered
				title="Add Blog to Series"
				onClose={() => setOptionPrompt(false)}
				opened={optionPrompt}
			>
				<Group mt="xl">
					<Button
						variant="outline"
						color="green"
						onClick={() => {
							setOptionPrompt(false);
							setCreateSeriesPrompt(true);
						}}
						loading={loading}
						fullWidth
					>
						Create New Series
					</Button>
					<Button
						variant="outline"
						color="blue"
						onClick={() => {
							setOptionPrompt(false);
							// setAddToSeries(true)
						}}
						loading={loading}
						fullWidth
					>
						Add to Existing Series
					</Button>
				</Group>
			</Modal>
			<Modal
				centered
				title="Create New Series"
				onClose={() => setCreateSeriesPrompt(false)}
				opened={createSeriesPrompt}
			>
				<form
					onSubmit={seriesFormState.onSubmit(async (d) => {
						let path = null;
						if (seriesBannerImage) {
							const data = await uploadSingleFile(
								seriesBannerImage,
								readCookie("token")!
							).catch(() => null);
							if (data === null) {
								return showNotification({
									message: "Failed to upload image",
									color: "red",
								});
							}
							path = data.data.path;
						}
						const res = await createSeries({
							title: d.title,
							description: d.description,
							image: path,
							token: readCookie("token")!,
						}).catch(() => null);
						if (res === null) {
							return showNotification({
								message: "Failed to create series",
								color: "red",
							});
						}
						const { id } = res.data;
						showNotification({
							message: "Series created successfully",
							color: "green",
						});
						fetchSeriesByUsername(username)
							.then((d) => d.data)
							.then(setSeries);
						setFieldValue("seriesId", id);
						setCreateSeriesPrompt(false);
					})}
				>
					<TextInput
						mt="md"
						mb="md"
						label="Series Title"
						required
						placeholder="A title for your series."
						{...seriesFormState.getInputProps("title")}
					/>
					<TextInput
						mt="md"
						mb="md"
						label="Series Description"
						required
						placeholder="A description for your series."
						{...seriesFormState.getInputProps("description")}
					/>
					<Label required={false}>Series Banner Image</Label>
					<SingleFileDropzone
						file={seriesBannerImage}
						setFile={setSeriesBannerImage}
					/>
					<Group mt="xl">
						<Button
							variant="outline"
							color="blue"
							type="submit"
							loading={loading}
							fullWidth
						>
							Create
						</Button>
					</Group>
				</form>
			</Modal>
		</>
	);
}

export default CreateBlog;
