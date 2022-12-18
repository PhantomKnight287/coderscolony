import { SingleFileDropzone } from "@components/dropzones/single";
import { MetaTags } from "@components/meta";
import { SelectItem } from "@components/select/item";
import { icons, Value } from "@components/select/value";
import { readCookie } from "@helpers/cookies";
import { imageResolver, profileImageResolver } from "@helpers/profile-url";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { useUser } from "@hooks/user";
import {
	Avatar,
	Badge,
	Button,
	Card,
	Center,
	ColorInput,
	ColorPicker,
	Container,
	createStyles,
	Group,
	Image,
	Modal,
	MultiSelect,
	SimpleGrid,
	Skeleton,
	Tabs,
	Text,
	TextInput,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useForceUpdate } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { createInterest, fetchInterest } from "@services/interest";
import {
	RemoveBannerImage,
	UpdateBannerImage,
	changeProfileImage,
	changeBannerColor,
	updateName,
	updateOneLiner,
	updateProfile,
} from "@services/profile-actions";
import { uploadSingleFile } from "@services/upload";
import { IconHeart } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import { User } from "db";
import { useEffect, useState } from "react";
import { interest } from "~types/interest";

const useStyles = createStyles((theme) => ({
	image: {
		objectFit: "cover",
		maxHeight: "300px",
	},
}));

export default function SettingsPage() {
	useCollapsedSidebar();
	const fetchProfile = useHydrateUserContext();
	const { username } = useUser();
	const { classes } = useStyles();
	const [imageLoaded, setImageLoaded] = useState(false);
	const [bannerImage, setBannerImage] = useState<File>();
	const [bannerImageUploadModalOpened, setBannerImageUploadModalOpened] =
		useState(false);
	const [bannerImageUploadLoading, setBannerImageUploadLoading] =
		useState(false);
	const [profileImageModalOpened, setProfileImageModalOpened] =
		useState(false);
	const [profileImageUploadLoading, setProfileImageUploadLoading] =
		useState(false);
	const theme = useMantineTheme();
	const newInterestFormState = useForm({
		initialValues: {
			name: "",
			icon: "",
			color: "",
		},
	});
	async function fetcher(): Promise<
		(Partial<User> & { tags: string[] }) | null
	> {
		const data = await fetch(`/api/auth/settings`, {
			headers: {
				Authorization: `Bearer ${readCookie("token")}`,
			},
		});
		if (data.ok) return await data.json();

		return null;
	}

	useHydrateUserContext();

	const {
		isLoading,
		error,
		data: user,
		refetch,
	} = useQuery(["user-data"], fetcher, {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: true,
		enabled: (typeof window !== "undefined") === true,
	});
	const [usernameState, setUsername] = useState(user?.username || "");
	const [email, setEmail] = useState(user?.email || "");
	const [oneLiner, setOneLiner] = useState(user?.oneLiner || "");
	const [name, setName] = useState(user?.name || "");
	const [color, setColor] = useState(user?.bannerColor || "");
	const [interest, setInterest] = useState<interest>([]);
	const [createNewInterestModalOpened, setCreateNewInterestModalOpened] =
		useState(false);
	const [createNewInterestLoading, setCreateNewInterestLoading] =
		useState(false);
	const [tags, setTags] = useState<Array<string>>([]);
	useEffect(() => {
		fetcher().then((d) => {
			if (d === null) return;
			setUsername(d.username || "");
			setEmail(d.email || "");
			setOneLiner(d.oneLiner || "");
			setName(d.name || "");
			setColor(d.bannerColor || "");
			setTags(d.tags || []);
		});
	}, []);

	useEffect(() => {
		fetchInterest()
			.then((d) => setInterest(d.data))
			.catch((err) => {
				showNotification({
					message:
						err?.response?.data?.message || "Something went wrong",
					color: "red",
				});
			});
	}, []);

	const Icon = icons[newInterestFormState.values.icon];

	return (
		<>
			<MetaTags description="Update Your Profile" title="Settings" />
			<Container>
				<Skeleton visible={isLoading} className="mt-16 pb-5" />

				{error && isLoading === false ? (
					<p> (error as Error).message </p>
				) : user && isLoading === false ? (
					<div>
						{user.bannerColor || user.bannerImage ? (
							<div className="flex flex-col items-center justify-center">
								{user.bannerImage ? (
									<Skeleton visible={!imageLoaded}>
										<div className="relative">
											<Image
												classNames={{
													image: classes.image,
												}}
												onLoad={() =>
													setImageLoaded(true)
												}
												src={imageResolver(
													user.bannerImage
												)}
												className="rounded-md overflow-hidden object-cover"
												alt="Banner Image"
											/>
											<div
												className="absolute"
												style={{
													right: "24px",
													bottom: "24px",
												}}
											>
												<Button
													className="bg-[#4595d0] hover:bg-[#317fb9]"
													onClick={() =>
														setBannerImageUploadModalOpened(
															(o) => !o
														)
													}
												>
													Change
												</Button>
												<Button
													className="ml-3  bg-red-600 hover:bg-red-800"
													onClick={async () =>
														await RemoveBannerImage(
															username!,
															readCookie("token")!
														).then(refetch)
													}
												>
													Remove
												</Button>
											</div>
										</div>
									</Skeleton>
								) : user.bannerColor ? (
									<div className="relative w-[100%]">
										<div
											className="rounded-md overflow-hidden max-h-[300px] h-[300px] w-[100%]"
											style={{
												backgroundColor: color,
											}}
										></div>
										<div className="absolute right-[24px] bottom-[24px] ">
											<Button
												className="bg-[#4595d0] hover:bg-[#317fb9]"
												onClick={() =>
													setBannerImageUploadModalOpened(
														(o) => !o
													)
												}
											>
												Change
											</Button>
											<Button
												className="bg-[#4595d0] hover:bg-[#317fb9] ml-3"
												onClick={() =>
													setBannerImageUploadModalOpened(
														(o) => !o
													)
												}
											>
												Change Color
											</Button>
										</div>
									</div>
								) : null}
							</div>
						) : null}
						<div
							className={clsx(
								"w-max h-max  flex items-center justify-center mt-2 "
							)}
						>
							<Avatar
								src={profileImageResolver({
									profileURL: user.profileImage!,
									username: user.username!,
								})}
								size={160}
								radius={80}
								onClick={() =>
									setProfileImageModalOpened((o) => !o)
								}
								className="bg-[#171718] border-4 ml-[20px] cursor-pointer border-[#171718]"
							/>
							<Text ml="xl">
								Click on image to upload a new image
							</Text>
						</div>
					</div>
				) : null}
				<form
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<SimpleGrid cols={2} breakpoints={[]}>
						<TextInput
							label="Email"
							required
							value={email}
							type="email"
							onChange={(e) => setEmail(e.target.value)}
						/>
						<TextInput
							label="Display Name"
							required
							value={name}
							onChange={(d) => setName(d.target.value)}
						/>
						<TextInput
							label="Username"
							required
							value={username}
							onChange={(d) => setUsername(d.target.value)}
						/>
						<ColorInput
							value={color}
							onChange={(e) => setColor(e)}
							label="Banner Color"
						/>
						<TextInput
							label="One Liner"
							value={oneLiner}
							onChange={(d) => setOneLiner(d.target.value)}
						/>
						<MultiSelect
							label="Interests"
							data={interest.map((i) => ({
								value: i.id,
								label: i.name,
								color: i.color,
								icon: i.icon,
							}))}
							placeholder="Select Interests"
							searchable
							creatable
							itemComponent={SelectItem}
							getCreateLabel={(query) => `+ Create New`}
							valueComponent={Value}
							filter={(value, selected, item) =>
								!selected &&
								(item.label
									?.toLowerCase()
									.includes(value.toLowerCase().trim()) ||
									item.description
										.toLowerCase()
										.includes(value.toLowerCase().trim()))
							}
							onCreate={(value) => {
								setCreateNewInterestModalOpened((o) => !o);
								return null;
							}}
							value={tags}
							onChange={(e) => {
								setTags(e);
							}}
						/>
					</SimpleGrid>
					<Group my="xl" position="center">
						<Button
							variant="filled"
							className="bg-[#4595d0] hover:bg-[#317fb9]"
							onClick={() => {
								if (tags.length > 10)
									return showNotification({
										message:
											"You can only select 10 interests",
										color: "red",
									});
								updateProfile(
									{
										color,
										username,
										name,
										email,
										oneLiner,
										tags: tags.map((t) =>
											interest.find((i) => i.id === t)
										),
									},
									readCookie("token")!
								)
									.then(() => {
										showNotification({
											message: "Profile Updated",
											color: "green",
										});
										refetch();
									})
									.catch((err) => {
										showNotification({
											message: "Error Updating Profile",
											color: "red",
										});
									});
							}}
						>
							Save Changes
						</Button>
					</Group>
				</form>
			</Container>
			<Modal
				opened={bannerImageUploadModalOpened}
				onClose={() => setBannerImageUploadModalOpened((o) => !o)}
				centered
				title="Upload Banner Image"
			>
				<SingleFileDropzone
					file={bannerImage}
					setFile={setBannerImage}
				/>
				<Group position="center" mt="xl">
					<Button
						variant="outline"
						color="green"
						loading={bannerImageUploadLoading}
						onClick={() => {
							setBannerImageUploadLoading(true);
							if (!bannerImage) {
								setBannerImageUploadLoading(false);
								return setBannerImageUploadModalOpened(
									(o) => !o
								);
							}
							uploadSingleFile(bannerImage, readCookie("token")!)
								.then((d) => d.data)
								.then(({ path }) => {
									UpdateBannerImage(
										path,
										username,
										readCookie("token")!
									)
										.then(refetch)
										.finally(() =>
											setBannerImageUploadLoading(false)
										);
								})
								.catch(() => {
									return showNotification({
										message:
											"An Error Occured While Uploading Image",
										color: "red",
									});
								})
								.finally(() =>
									setBannerImageUploadLoading(false)
								);
						}}
					>
						Confirm
					</Button>
				</Group>
			</Modal>
			<Modal
				opened={profileImageModalOpened}
				onClose={() => setProfileImageModalOpened((o) => !o)}
				centered
				title="Upload Profile Image"
			>
				<SingleFileDropzone
					file={bannerImage}
					setFile={setBannerImage}
				/>
				<Group position="center" mt="xl">
					<Button
						variant="outline"
						color="green"
						loading={profileImageUploadLoading}
						onClick={() => {
							setProfileImageUploadLoading(true);
							if (!bannerImage) {
								setProfileImageUploadLoading(false);
								return setProfileImageModalOpened((o) => !o);
							}
							uploadSingleFile(bannerImage, readCookie("token")!)
								.then((d) => d.data)
								.then(({ path }) => {
									changeProfileImage(
										username,
										path,
										readCookie("token")!
									)
										.then(refetch)
										.then(fetchProfile)
										.finally(() =>
											setProfileImageModalOpened(false)
										);
								})
								.catch(() => {
									return showNotification({
										message:
											"An Error Occured While Uploading Image",
										color: "red",
									});
								})
								.finally(() =>
									setProfileImageModalOpened(false)
								);
						}}
					>
						Confirm
					</Button>
				</Group>
			</Modal>
			<Modal
				opened={createNewInterestModalOpened}
				onClose={() => setCreateNewInterestModalOpened((o) => !o)}
				centered
			>
				<div className="flex flex-col items-center justify-center">
					<Text>Preview</Text>
					<Badge
						styles={{
							root: {
								backgroundColor: newInterestFormState.isDirty(
									"color"
								)
									? newInterestFormState.values.color
									: undefined,
								color:
									theme.colorScheme === "dark"
										? theme.white
										: theme.black,
							},
						}}
						leftSection={Icon ? <Icon /> : null}
						style={{ textTransform: "none" }}
						p="md"
					>
						{newInterestFormState.values.name || "Name"}
					</Badge>
				</div>
				<form
					onSubmit={newInterestFormState.onSubmit((d) => {
						setCreateNewInterestLoading(true);
						createInterest({
							token: readCookie("token")!,
							...d,
						})
							.then(() => {
								setCreateNewInterestLoading(false);
								setCreateNewInterestModalOpened(false);
								fetchInterest()
									.then((d) => setInterest(d.data))
									.catch((err) => null);
							})
							.catch(() => {
								setCreateNewInterestLoading(false);
								showNotification({
									message:
										"An Error Occured While Creating Interest",
									color: "red",
								});
							});
					})}
				>
					<TextInput
						label="Name"
						placeholder="Web Development"
						required
						{...newInterestFormState.getInputProps("name")}
					/>
					<ColorInput
						my="md"
						label="Color"
						required
						{...newInterestFormState.getInputProps("color")}
					/>
					<SimpleGrid cols={4} my="md">
						{Object.entries(icons).map(([key, Icon]) => (
							<Card
								key={key}
								className={clsx(
									"flex flex-col items-center justify-center cursor-pointer",
									{
										"border-2 border-green-500":
											newInterestFormState.values.icon ===
											key,
									}
								)}
								onClick={() =>
									newInterestFormState.setFieldValue(
										"icon",
										key
									)
								}
							>
								<Icon />
							</Card>
						))}
					</SimpleGrid>
					<Group position="center" my="lg">
						<Button
							variant="outline"
							color="green"
							loading={createNewInterestLoading}
							type="submit"
						>
							Create
						</Button>
					</Group>
				</form>
			</Modal>
		</>
	);
}
