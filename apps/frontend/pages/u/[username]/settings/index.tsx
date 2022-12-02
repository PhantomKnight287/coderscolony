import { SingleFileDropzone } from "@components/dropzones/single";
import { MetaTags } from "@components/meta";
import { readCookie } from "@helpers/cookies";
import { imageResolver } from "@helpers/profile-url";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { useUser } from "@hooks/user";
import {
  Avatar,
  Button,
  ColorInput,
  ColorPicker,
  Container,
  createStyles,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Skeleton,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useForceUpdate } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
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
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { User } from "db";
import { useEffect, useState } from "react";

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
  const [profileImageModalOpened, setProfileImageModalOpened] = useState(false);
  const [profileImageUploadLoading, setProfileImageUploadLoading] =
    useState(false);

  async function fetcher(): Promise<Partial<User> | null> {
    const data = await fetch(`/api/auth/settings`, {
      headers: {
        Authorization: `Bearer ${readCookie("token")}`,
      },
    });
    if (data.ok) return await data.json();
    console.log(await data.json());
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

  useEffect(() => {
    fetcher().then((d) => {
      if (d === null) return;
      console.log(d);
      setUsername(d.username || "");
      setEmail(d.email || "");
      setOneLiner(d.oneLiner || "");
      setName(d.name || "");
      setColor(d.bannerColor || "");
    });
  }, []);

  return (
    <>
      <MetaTags description="Update Your Profile" title="Settings" />
      <Container>
        <Skeleton visible={isLoading} className="mt-16 h-[100%] mb-5">
          {error ? (
            <p> (error as Error).message </p>
          ) : user ? (
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
                          onLoad={() => setImageLoaded(true)}
                          src={imageResolver(user.bannerImage)}
                          className="rounded-md overflow-hidden object-cover"
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
                              setBannerImageUploadModalOpened((o) => !o)
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
                          backgroundColor: user.bannerColor,
                        }}
                      ></div>
                      <div className="absolute right-[24px] bottom-[24px] ">
                        <Button
                          className="bg-[#4595d0] hover:bg-[#317fb9]"
                          onClick={() =>
                            setBannerImageUploadModalOpened((o) => !o)
                          }
                        >
                          Change
                        </Button>
                        <Button
                          className="bg-[#4595d0] hover:bg-[#317fb9] ml-3"
                          onClick={() =>
                            setBannerImageUploadModalOpened((o) => !o)
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
                  src={
                    user.profileImage
                      ? user.profileImage.startsWith("https://avatar.dicebar")
                        ? user.profileImage
                        : `/images/${user.profileImage}`
                      : `https://avatars.dicebear.com/api/big-smile/${user.username}.svg`
                  }
                  size={160}
                  radius={80}
                  onClick={() => setProfileImageModalOpened((o) => !o)}
                  className="bg-[#171718] border-4 ml-[20px] cursor-pointer border-[#171718]"
                />
                <Text ml="xl">Click on image to upload a new image</Text>
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
            </SimpleGrid>
            <Group mt="xl" position="center" className="w-full">
              <TextInput
                label="One Liner"
                required
                className="w-[90%]"
                value={oneLiner}
                onChange={(d) => setOneLiner(d.target.value)}
              />
              <Button
                variant="filled"
                className="bg-[#4595d0] hover:bg-[#317fb9]"
                onClick={() => {
                  updateProfile(
                    { color, username, name, email, oneLiner },
                    readCookie("token")!
                  ).then(() => {
                    showNotification({
                      message: "Profile Updated",
                      color: "green",
                    });
                    refetch();
                  });
                }}
              >
                Save Changes
              </Button>
            </Group>
          </form>
        </Skeleton>
      </Container>
      <Modal
        opened={bannerImageUploadModalOpened}
        onClose={() => setBannerImageUploadModalOpened((o) => !o)}
        centered
        title="Upload Banner Image"
      >
        <SingleFileDropzone file={bannerImage} setFile={setBannerImage} />
        <Group position="center" mt="xl">
          <Button
            variant="outline"
            color="green"
            loading={bannerImageUploadLoading}
            onClick={() => {
              setBannerImageUploadLoading(true);
              if (!bannerImage) {
                setBannerImageUploadLoading(false);
                return setBannerImageUploadModalOpened((o) => !o);
              }
              uploadSingleFile(bannerImage, readCookie("token")!)
                .then((d) => d.data)
                .then(({ path }) => {
                  UpdateBannerImage(path, username, readCookie("token")!)
                    .then(refetch)
                    .finally(() => setBannerImageUploadLoading(false));
                })
                .catch(() => {
                  return showNotification({
                    message: "An Error Occured While Uploading Image",
                    color: "red",
                  });
                })
                .finally(() => setBannerImageUploadLoading(false));
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
        <SingleFileDropzone file={bannerImage} setFile={setBannerImage} />
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
                  changeProfileImage(username, path, readCookie("token")!)
                    .then(refetch)
                    .then(fetchProfile)
                    .finally(() => setProfileImageModalOpened(false));
                })
                .catch(() => {
                  return showNotification({
                    message: "An Error Occured While Uploading Image",
                    color: "red",
                  });
                })
                .finally(() => setProfileImageModalOpened(false));
            }}
          >
            Confirm
          </Button>
        </Group>
      </Modal>
    </>
  );
}
