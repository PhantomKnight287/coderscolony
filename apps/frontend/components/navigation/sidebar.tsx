import { useState } from "react";
import {
	Button,
	Container,
	Group,
	Modal,
	Text,
	Textarea,
	TextInput,
	Title,
	UnstyledButton,
	useMantineTheme,
} from "@mantine/core";
import { NavbarLinksGroup } from "@components/collapsible";
import { IconMessageCircle2, IconPencil } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import axios from "axios";
import { readCookie } from "@helpers/cookies";
import { showNotification } from "@mantine/notifications";
import { Forums } from "db";
import { useRouter } from "next/router";
import { DrawerWrapper } from "../../wrapper/drawer";
import { SingleFileDropzone } from "@components/dropzones/single";
import Label from "@components/label";
import { uploadSingleFile } from "@services/upload";
import { client } from "../../pages/_app";
import { useUser } from "@hooks/user";

export function Sidebar() {
	const formState = useForm({
		initialValues: {
			name: "",
			slug: "",
			description: "",
		},
	});
	const { push } = useRouter();
	const [modalOpened, setModalOpened] = useState(false);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const { id } = useUser();
	const openFormModal = () => {
		setModalOpened((o) => !o);
	};

	const createForum = async (e: typeof formState.values) => {
		if (!file)
			return showNotification({
				message: "Please Select A Profile Image for Forum",
				color: "red",
			});
		const cookie = readCookie("token");
		if (!cookie)
			return showNotification({
				message: "No Authentication Method Found. Please Login Again.",
			});
		setLoading(true);
		const fileURL = await uploadSingleFile(file, cookie).catch(() => null);
		if (fileURL === null) {
			showNotification({
				message:
					"An Error Occured while Uploading Image, Please Try Again Later.",
				color: "red",
			});
			return setLoading(false);
		}
		axios
			.post<{
				admin: {
					id: string;
					user: {
						name: string;
						profileImage: string;
						verified: boolean;
					};
				};
				forum: Forums;
			}>(
				"/api/forums/create",
				{ ...e, profileURL: fileURL.data.path },
				{
					headers: {
						authorization: `Bearer ${cookie}`,
					},
				}
			)
			.then((d) => d.data)
			.then((d) => {
				showNotification({
					message: `New Forum Created With Name: ${d.forum.name}`,
				});
				formState.reset();
				setModalOpened(false);
				client.refetchQueries({ queryKey: ["forums"] });
			})
			.catch((err) => {
				if (err.response?.headers["X-Error"] === "expired")
					return showNotification({
						message:
							"This session has expired. Please Login Again To Continue.",
					});
				return showNotification({
					message: err.response?.data?.message || "An Error Occured",
					color: "red",
				});
			})
			.finally(() => setLoading(false));
	};

	const openWarningModal = () =>
		openConfirmModal({
			title: "Create A New Forum",
			centered: true,
			children: (
				<>
					Creating A New Forums means running it actively and keeping
					an eye over activity of the users. Duplicate Forums will be
					deleted as it makes it hard for users to find the right
					information.
				</>
			),
			labels: {
				cancel: "Cancel",
				confirm: "Confirm",
			},
			onConfirm: () => openFormModal(),
		});
	return (
		<DrawerWrapper>
			<aside className="lg:border-r-[1px] border-[#2c2c2c] mr-5 h-[100vh]  mt-20">
				<Container size={220}>
					<NavbarLinksGroup
						icon={IconMessageCircle2}
						label="Forums"
						initiallyOpened={true}
						links={[
							{
								id: "CREATE",
								label: (
									<UnstyledButton
										color="blue"
										className="flex flex-row items-center justify-center  hover:bg-[#233449] py-2 px-4 rounded-lg ml-2 min-w-[100px]"
									>
										Create
									</UnstyledButton>
								),
								handler: () => {
									if (id) {
										openWarningModal();
									} else {
										push("/auth/login");
									}
								},
							},
							{
								id: "LIST",
								label: (
									<UnstyledButton
										color="blue"
										className="flex flex-row items-center justify-center  hover:bg-[#233449] py-2 px-4 rounded-lg ml-2 min-w-[100px]"
									>
										View All
									</UnstyledButton>
								),
								link: "/f",
							},
						]}
					/>
					<NavbarLinksGroup
						icon={IconPencil}
						label="Blogs"
						initiallyOpened={true}
						links={[
							{
								id: "CREATE",
								label: (
									<UnstyledButton
										color="blue"
										className="flex flex-row items-center justify-center  hover:bg-[#233449] py-2 px-4 rounded-lg ml-2 min-w-[100px]"
									>
										Create
									</UnstyledButton>
								),
								link: "/b/create",
							},
							{
								id: "LIST",
								label: (
									<UnstyledButton
										color="blue"
										className="flex flex-row items-center justify-center  hover:bg-[#233449] py-2 px-4 rounded-lg ml-2 min-w-[100px]"
									>
										View All
									</UnstyledButton>
								),
								link: "/b",
							},
						]}
					/>
				</Container>
			</aside>
			<Modal
				onClose={() => setModalOpened((o) => !o)}
				opened={modalOpened}
				centered
				title="Create New Forum"
			>
				<form onSubmit={formState.onSubmit((d) => createForum(d))}>
					<TextInput
						label="Name"
						required
						placeholder="Name of the Forum"
						{...formState.getInputProps("name")}
					/>
					<TextInput
						label="Slug"
						required
						placeholder="A Unique Slug for this forum ex: /f/<slug>"
						{...formState.getInputProps("slug")}
					/>
					<Textarea
						label="Description(supports markdown)"
						placeholder="Description Of The Forum"
						required
						autosize
						{...formState.getInputProps("description")}
					/>
					<Label required>Profile of Forum</Label>
					<SingleFileDropzone file={file} setFile={setFile} mt="sm" />
					<Group position="center">
						<Button
							mt="xs"
							type="submit"
							className="bg-[#1864ab] bg-opacity-80 hover:scale-110  duration-[110ms]"
							loading={loading}
							disabled={loading}
						>
							Create
						</Button>
					</Group>
				</form>
			</Modal>
		</DrawerWrapper>
	);
}
