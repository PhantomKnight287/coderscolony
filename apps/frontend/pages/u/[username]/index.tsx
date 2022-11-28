import { MetaTags } from "@components/meta";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import {
  Avatar,
  Button,
  ColorPicker,
  Container,
  Group,
  Modal,
  TextInput,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import clsx from "clsx";
import { User } from "db";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "@styles/username.module.scss";
import { SingleFileDropzone } from "@components/dropzones/single";
import {
  changeBannerColor,
  changeProfileImage,
  fetchProfile,
  RemoveBannerImage,
  UpdateBannerImage,
  updateName,
  updateOneLiner,
} from "@services/profile-actions";
import { readCookie } from "@helpers/cookies";
import Label from "@components/label";
import { uploadSingleFile } from "@services/upload";
import { useForm } from "@mantine/form";
import { useUserDispatch } from "@hooks/user";
import { ProfileTabs } from "@components/profile/tabs";

const UsernamePage: NextPage<{
  pageProps: InferGetServerSidePropsType<typeof getServerSideProps>;
}> = ({ pageProps }) => {
  const { colorScheme } = useMantineColorScheme();
  const { opened, setOpened } = useSidebar();
  const { asPath } = useRouter();
  const [modalOpened, setModalOpened] = useState(false);
  const theme = useMantineTheme();
  const [bannerImageModalOpened, setBannerImageModalOpened] = useState(false);
  const [bannerImage, setBannerImage] = useState<File>();
  const [user, setUser] = useState(pageProps);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [profileImage, setProfileImage] = useState<File>();
  const { isDirty, getInputProps, onSubmit, resetDirty } = useForm({
    initialValues: {
      oneLiner: user.oneLiner,
      name: user.name,
    },
  });

  useEffect(() => {
    if (opened === true) {
      return setOpened(false);
    }
    return () => setOpened(true);
  }, [opened]);

  useHydrateUserContext();

  const setGlobalUser = useUserDispatch();
  async function fetchProfileAndUpdateState() {
    const data = await fetchProfile(pageProps.username!, readCookie("token"));
    if (data.error === false) {
      delete data.error;
      setUser(data);
      setGlobalUser({ payload: data, type: "SetUser" });
    }
  }

  return (
    <>
      <MetaTags
        description={`${user.name} on CodersColony`}
        title={`${user.name} | @${user.username} `}
      />
      {user.bannerColor || user.bannerImage ? (
        <div className="flex flex-col items-center justify-center">
          <div
            className={clsx("w-[90vw] h-[300px] rounded-md ", {})}
            style={{
              backgroundColor: user.bannerImage
                ? undefined
                : (user.bannerColor as string | undefined),
              backgroundImage: `url(/images/${user.bannerImage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>
        </div>
      ) : null}
      <Container>
        <div className="w-max h-max mt-[-4rem] flex items-center justify-center">
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
            className="bg-[#171718] border-4 border-[#171718]"
          />
        </div>
        <div className="flex items-center text-[16px] mt-5 font-[700] leading-[24px]">
          <div className="gap-[4px] flex items-center font-[700]">
            <p
              className={clsx("mr-[4px] ml-3", {
                "text-white": colorScheme === "dark",
              })}
            >
              {user.name}
            </p>
          </div>
          {user.edit ? (
            <div className="ml-auto">
              <Button
                variant="outline"
                color={colorScheme == "dark" ? "teal" : undefined}
                onClick={() => setModalOpened((o) => !o)}
              >
                Edit Profile
              </Button>
            </div>
          ) : null}
        </div>
        <div className="flex flex-row items-center justify-start ml-3 gap-8">
          <span
            className={clsx("text-[13px] leading-[18px]", {
              "text-gray-500": colorScheme === "dark",
              "text-[#666666]": colorScheme === "light",
            })}
          >
            @{user.username}
          </span>
        </div>
        {user.oneLiner ? (
          <p
            className={clsx("break-words ml-3 mt-4 leading-[24px]", {
              "text-white": colorScheme === "dark",
            })}
          >
            {user.oneLiner}
          </p>
        ) : null}
        <div className="ml-3 mt-5 flex items-center">
          <div className="flex-wrap items-center flex gap-[8px]">
            <Link href={`${asPath}/followers`}>
              <span
                className={clsx("text-[13px] leading-[18px] hover:underline", {
                  "text-gray-300": colorScheme === "dark",
                  "text-[#666666]": colorScheme === "light",
                })}
              >
                {user.followers} Followers
              </span>
            </Link>
            <span
              className={clsx(
                `text-[13px] leading-[18px] ${styles.following}`,
                {
                  "text-gray-300": colorScheme === "dark",
                  "text-[#666666]": colorScheme === "light",
                }
              )}
            >
              <Link href={`${asPath}/following`} className="hover:underline ">
                {user.following} Following
              </Link>
            </span>
          </div>
        </div>
        <div className="mt-10">
          <ProfileTabs />
        </div>
      </Container>
      <Modal
        onClose={() => setModalOpened((o) => !o)}
        opened={modalOpened}
        centered
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={8}
        title="Edit Profile"
      >
        {user.bannerColor || user.bannerImage ? (
          <>
            <Label>Banner Image</Label>
            <div className="flex flex-col items-center justify-center">
              <div
                className={clsx("w-[100%] h-[150px] rounded-md ", {})}
                style={{
                  backgroundColor: user.bannerImage
                    ? undefined
                    : (user.bannerColor as string | undefined),
                  backgroundImage: `url(${
                    bannerImage
                      ? URL.createObjectURL(bannerImage)
                      : `/images/${user.bannerImage}`
                  })`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
            <div className="flex mt-[-2.5rem] mr-4 flex-row flex-nowrap items-center gap-4 justify-end">
              {!user.bannerImage ? (
                <Button
                  variant="filled"
                  color={"blue"}
                  className="bg-[#1864ab]"
                  onClick={() => setShowColorPicker((o) => !o)}
                >
                  Change Color
                </Button>
              ) : null}
              <Button
                variant="filled"
                color={"blue"}
                className="bg-[#1864ab]"
                onClick={() => setBannerImageModalOpened((o) => !o)}
              >
                Change
              </Button>
              <Button
                variant="filled"
                color={"red"}
                className="bg-[#c92a2a]"
                onClick={async () => {
                  await RemoveBannerImage(
                    pageProps.username!,
                    readCookie("token")!
                  );
                  await fetchProfileAndUpdateState();
                }}
              >
                Remove
              </Button>
            </div>
          </>
        ) : null}
        <div className="flex flex-row flex-wrap mt-5 items-center justify-around">
          <Avatar
            src={
              user.profileImage
                ? user.profileImage.startsWith("https://avatar.dicebar")
                  ? user.profileImage
                  : `/images/${user.profileImage}`
                : `https://avatars.dicebear.com/api/big-smile/${user.username}.svg`
            }
            size={100}
            radius={50}
            className="bg-[#171718] border-4 cursor-pointer border-[#171718]"
            onClick={() => setShowProfileImageModal((o) => !o)}
          />
          Upload An Image
        </div>
        <form
          onSubmit={onSubmit((d) => {
            if (isDirty("name")) {
              updateName(user.username!, d.name!, readCookie("token")!).then(
                fetchProfileAndUpdateState
              );
            }
            if (isDirty("oneLiner")) {
              updateOneLiner(
                user.username!,
                d.oneLiner!,
                readCookie("token")!
              ).then(fetchProfileAndUpdateState);
            }
            resetDirty();
            setModalOpened((o) => !o);
          })}
        >
          <TextInput {...getInputProps("name")} label="Name" />
          <TextInput {...getInputProps("oneLiner")} label="One-Liner" mt="xl" />
          <input type="submit" hidden />
        </form>
        <Group
          align="center"
          mt="xl"
          style={{
            justifyContent: "center",
          }}
        >
          <Button
            variant="outline"
            onClick={() => setModalOpened((o) => !o)}
            color="green"
          >
            Confirm
          </Button>
        </Group>
      </Modal>
      <Modal
        opened={bannerImageModalOpened}
        centered
        title="Upload An Image"
        onClose={() => setBannerImageModalOpened((o) => !o)}
      >
        <SingleFileDropzone file={bannerImage} setFile={setBannerImage} />
        <Group
          mt="xl"
          style={{
            justifyContent: "center",
          }}
        >
          <Button
            variant="outline"
            onClick={() => {
              setBannerImageModalOpened((o) => !o);
              if (bannerImage)
                uploadSingleFile(bannerImage, readCookie("token")!).then(
                  (d) => {
                    UpdateBannerImage(
                      d.data.path,
                      user.username!,
                      readCookie("token")!
                    ).then(fetchProfileAndUpdateState);
                  }
                );
            }}
            color="green"
          >
            Confirm
          </Button>
        </Group>
      </Modal>
      <Modal
        centered
        onClose={() => setShowColorPicker((o) => !o)}
        opened={showColorPicker}
      >
        <ColorPicker
          value={user.bannerColor as string | undefined}
          onChange={(d) => setUser((old) => ({ ...old, bannerColor: d }))}
        />
        <Group
          mt="xl"
          style={{
            justifyContent: "center",
          }}
        >
          <Button
            variant="outline"
            onClick={() => {
              setShowColorPicker((o) => !o);
              changeBannerColor(
                user.username!,
                user.bannerColor!,
                readCookie("token")!
              ).then((d) => {
                if (d.error === false) fetchProfileAndUpdateState();
              });
            }}
            color="green"
          >
            Confirm
          </Button>
        </Group>
      </Modal>
      <Modal
        centered
        opened={showProfileImageModal}
        onClose={() => setShowProfileImageModal((o) => !o)}
        title="Upload A Profile Image"
      >
        <SingleFileDropzone file={profileImage} setFile={setProfileImage} />
        <Group mt="xl" style={{ justifyContent: "center" }}>
          <Button
            variant="outline"
            onClick={() => {
              setShowProfileImageModal((o) => !o);
              if (profileImage)
                uploadSingleFile(profileImage, readCookie("token")!)
                  .then((d) => d.data)
                  .then((d) => {
                    changeProfileImage(
                      user.username!,
                      d.path,
                      readCookie("token")!
                    ).then(fetchProfileAndUpdateState);
                  });
            }}
            color="green"
          >
            Confirm
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  Partial<User & { edit: boolean; followers: number; following: number }>
> = async ({ query, req: { cookies, headers } }) => {
  const token = cookies["token"];
  const header: Record<string, string> = {};
  if (token) header.authorization = `Bearer ${token}`;
  const data = await axios
    .get(
      `${process.env.NODE_ENV !== "production" ? "http" : "https"}://${
        headers.host
      }/api/profile/${query.username}`,
      { headers: header }
    )
    .then((d) => d.data)
    .catch((err) => ({
      status: err?.response?.status || 500,
      message: err?.response?.data?.message || "An Error Occured",
    }));
  if ("status" in data)
    return {
      redirect: {
        destination: `/error/${data.status}?message=${encodeURIComponent(
          data.message
        )}`,
        permanent: false,
      },
    };
  console.log(data);
  return {
    props: data,
  };
};

export default UsernamePage;
