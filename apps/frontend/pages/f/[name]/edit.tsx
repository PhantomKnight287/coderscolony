import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  ColorInput,
  Container,
  Group,
  Image,
  Loader,
  Modal,
  SimpleGrid,
  Skeleton,
  Text,
  TextInput,
} from "@mantine/core";
import { MetaTags } from "@components/meta";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { readCookie } from "@helpers/cookies";
import { Forums } from "db";
import { imageResolver } from "@helpers/profile-url";
import clsx from "clsx";
import { useForm } from "@mantine/form";
import {
  ChangeForumBannerImage,
  ChangeForumProfileImage,
  EditForum_BASE,
  RemoveBannerImage,
} from "@services/forum-edit.actions";
import { showNotification } from "@mantine/notifications";
import Label from "@components/label";
import { SingleFileDropzone } from "@components/dropzones/single";
import { uploadSingleFile } from "@services/upload";
import { useHydrateUserContext } from "@hooks/hydrate/context";

function EditForum() {
  const { query, replace, push, isReady } = useRouter();
  useHydrateUserContext();
  async function fetcher(): Promise<Partial<Forums> | null | undefined> {
    const data = await fetch(`/api/forum-edit/${query.name}/details`, {
      headers: {
        authorization: `Bearer ${readCookie("token")}`,
      },
    });
    if (data.ok) {
      return await data.json();
    }
    if (data.status === 404) return void replace("/404");
    if (data.status === 401) return void push(`/f/${query.name}`);
    if (data.status == 403) return void push(`/f/${query.name}`);
    return null;
  }

  useCollapsedSidebar();
  const { data, refetch, error, isLoading } = useQuery({
    queryKey: ["forum"],
    queryFn: fetcher,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: typeof window !== "undefined" && isReady,
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [profileImageModal, setProfileImageModal] = useState(false);
  const [profileImage, setProfileImage] = useState<File>();
  const [bannerImageModal, setBannerImageModal] = useState(false);

  const formState = useForm({
    initialValues: {
      name: "",
      bannerColor: "",
    },
  });
  const [loading, setLoading] = useState({
    bannerButtonLoading: false,
    profileButtonLoading: false,
  });

  useEffect(() => {
    if (isLoading || !data) return;
    formState.setFieldValue("bannerColor", data.bannerColor!);
    formState.setFieldValue("name", data.name!);
  }, [isLoading]);

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader color="green" variant="bars" />
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className={clsx("text-center font-outfit")}>An Error Occured</p>
      </div>
    );
  return (
    <>
      <MetaTags title="Edit Forum" description="Edit Forum" />
      <Container>
        <Skeleton visible={isLoading && data} className="h-screen">
          <Group position="center">
            {data?.bannerImage ? (
              <Skeleton visible={!imageLoaded}>
                <div className="relative">
                  <Image
                    classNames={{
                      image: "object-cover max-h-[300px]",
                    }}
                    onLoad={() => setImageLoaded(true)}
                    src={imageResolver(data.bannerImage)}
                    className="rounded-md overflow-hidden object-cover"
                    alt="Banner Image"
                  />
                  <div className="absolute right-[24px] bottom-[24px]">
                    <Button
                      className="bg-[#4595d0] hover:bg-[#317fb9]"
                      onClick={() => {
                        setProfileImage(undefined);
                        setBannerImageModal((o) => !o);
                      }}
                    >
                      Change
                    </Button>
                    <Button
                      className="ml-3  bg-red-600 hover:bg-red-800"
                      onClick={() => {
                        RemoveBannerImage(
                          readCookie("token")!,
                          query.name as string
                        )
                          .then(() => refetch())
                          .catch((err) => {
                            return showNotification({
                              message:
                                err.response?.data?.message ||
                                "An Error Occured",
                              color: "red",
                            });
                          });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Skeleton>
            ) : data?.bannerColor ? (
              <div className="relative w-full">
                <div
                  className="rounded-md overflow-hidden max-h-[300px] h-[300px] w-[100%]"
                  style={{
                    backgroundColor: formState.isDirty("bannerColor")
                      ? formState.values.bannerColor
                      : data.bannerColor,
                  }}
                ></div>
                <div className="absolute right-[24px] bottom-[24px]">
                  <Button
                    onClick={() => setBannerImageModal((o) => !o)}
                    className="bg-[#4595d0] hover:bg-[#317fb9]"
                  >
                    Upload Image
                  </Button>
                </div>
              </div>
            ) : null}
            <div
              className={clsx(
                "w-max h-max  flex items-center justify-center mt-2 "
              )}
            >
              <Avatar
                src={imageResolver(data?.profileImage!)}
                size={160}
                radius={80}
                onClick={() => setProfileImageModal((o) => !o)}
                className="bg-[#171718] border-4 ml-[20px] cursor-pointer border-[#171718]"
              />
              <Text ml="xl">Click on image to upload a new image</Text>
            </div>
          </Group>
          <form
            onSubmit={formState.onSubmit((d) => {
              EditForum_BASE(readCookie("token")!, query.name as string, d)
                .then((d) => d.data)
                .then(({ edited }) => {
                  if (edited === true) {
                    showNotification({
                      color: "green",
                      message: "Details Update Successfully",
                    });
                    refetch();
                  }
                })
                .catch((err) => {
                  return showNotification({
                    message: err.response?.data?.message || "An Error Occured",
                    color: "red",
                  });
                });
            })}
          >
            <SimpleGrid
              cols={2}
              breakpoints={[{ maxWidth: "xs", cols: 1, spacing: "sm" }]}
            >
              <TextInput
                label="Forum Name"
                {...formState.getInputProps("name")}
                required
              />
              <ColorInput
                label="Banner Color"
                {...formState.getInputProps("bannerColor")}
                required
              />
            </SimpleGrid>
            {formState.isDirty() ? (
              <Group position="center" mt="xl">
                <Button variant="outline" type="submit" color="green">
                  Update
                </Button>
              </Group>
            ) : null}
          </form>
        </Skeleton>
      </Container>
      <Modal
        title="Upload A Profile Image"
        overlayBlur={20}
        centered
        opened={profileImageModal}
        onClose={() => setProfileImageModal((o) => !o)}
      >
        <Label required>Image</Label>
        <SingleFileDropzone file={profileImage} setFile={setProfileImage} />
        <Group position="center" mt="md">
          <Button
            variant="outline"
            loading={loading.profileButtonLoading}
            onClick={async () => {
              if (!profileImage) return;
              setLoading((o) => ({ ...o, profileButtonLoading: true }));
              const url = await uploadSingleFile(
                profileImage,
                readCookie("token")!
              ).catch((_) => null);
              if (url === null) {
                setLoading((o) => ({ ...o, profileButtonLoading: false }));
                return showNotification({
                  message: "An Error Occured while uploading Image",
                  color: "red",
                });
              }
              const { path } = url.data;
              const data = await ChangeForumProfileImage(
                path,
                readCookie("token")!,
                query.name as string
              ).catch((err) => {
                showNotification({
                  message: err?.response?.data?.message || "An Error Occured",
                  color: "red",
                });
                return null;
              });
              if (data === null) {
                setLoading((o) => ({ ...o, profileButtonLoading: false }));
                return showNotification({
                  message: "An Error Occured while uploading Image",
                  color: "red",
                });
              }
              refetch();
              setLoading((o) => ({ ...o, profileButtonLoading: false }));

              setProfileImageModal(false);
            }}
          >
            Upload
          </Button>
        </Group>
      </Modal>
      <Modal
        title="Upload Banner Image"
        overlayBlur={20}
        centered
        opened={bannerImageModal}
        onClose={() => setBannerImageModal((o) => !o)}
      >
        <Label required>Image</Label>
        <SingleFileDropzone file={profileImage} setFile={setProfileImage} />
        <Group position="center" mt="md">
          <Button
            variant="outline"
            loading={loading.bannerButtonLoading}
            onClick={async () => {
              if (!profileImage) return;
              setLoading((o) => ({ ...o, bannerButtonLoading: true }));
              const url = await uploadSingleFile(
                profileImage,
                readCookie("token")!
              ).catch((_) => null);
              if (url === null) {
                setLoading((o) => ({ ...o, bannerButtonLoading: false }));
                return showNotification({
                  message: "An Error Occured while uploading Image",
                  color: "red",
                });
              }
              const { path } = url.data;
              const data = await ChangeForumBannerImage(
                path,
                readCookie("token")!,
                query.name as string
              ).catch((err) => {
                showNotification({
                  message: err?.response?.data?.message || "An Error Occured",
                  color: "red",
                });
                return null;
              });
              if (data === null) {
                setLoading((o) => ({ ...o, bannerButtonLoading: false }));
                return showNotification({
                  message: "An Error Occured while uploading Image",
                  color: "red",
                });
              }
              refetch();
              setLoading((o) => ({ ...o, bannerButtonLoading: false }));
              setBannerImageModal(false);
            }}
          >
            Upload
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default EditForum;
