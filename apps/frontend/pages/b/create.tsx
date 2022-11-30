import { SingleFileDropzone } from "@components/dropzones/single";
import { Editor } from "@components/editor";
import Label from "@components/label";
import { MetaTags } from "@components/meta";
import { Renderer } from "@components/renderer";
import { readCookie } from "@helpers/cookies";
import { getMarkdownString } from "@helpers/showdown";
import { slugify } from "@helpers/slugify";
import useDebounce from "@hooks/debounce";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import { useUser } from "@hooks/user";
import {
  Button,
  Container,
  Group,
  Modal,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { uploadSingleFile } from "@services/upload";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { createBlog as createBlogWithApi } from "@services/blogs";

function CreateBlog() {
  const { setOpened, opened } = useSidebar();
  const { getInputProps, values, onSubmit, isDirty, setFieldValue } = useForm({
    initialValues: {
      content: "",
      title: "",
      description: "",
    },
  });
  const [submitModal, setSubmitModal] = useState(false);
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  useHydrateUserContext();

  async function createBlog() {
    const { content, title, description } = values;
    if (!file)
      return showNotification({
        message: "Please select a banner image for your blog.",
        color: "red",
      });
    setLoading(true);
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
    const { path } = link;
    createBlogWithApi({
      content,
      title,
      ogImage: path,
      token: readCookie("token")!,
      description,
    })
      .then((d) => d.data)
      .then((d) => {
        console.log(d);
        setSubmitModal(false);
        return showNotification({
          message: "Blog Create Successfully. 👌",
          color: "green",
        });
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (opened === true) {
      return setOpened(false);
    }
    return () => setOpened(true);
  }, [opened]);

  return (
    <>
      <MetaTags description="Create New Blog" title="Create New Blog" />
      <Container>
        <h1 className="text-2xl text-center font-['Inter'] font-bold">
          Create New Blog
        </h1>
        <form
          onSubmit={onSubmit((d) => {
            setSubmitModal(true);
          })}
        >
          <TextInput
            label="Title"
            placeholder="An interesting title"
            required
            {...getInputProps("title")}
            mb="xl"
          />
          <Editor
            content={values.content}
            createPost={() => setSubmitModal((o) => !o)}
            setContent={(content) =>
              setFieldValue("content", content as string)
            }
            slug={`${slugify(values.title)}-${nanoid(10)}`}
            clickOnSendIconHandler={() => setSubmitModal((o) => !o)}
          />
          {isDirty("content") && isDirty("title") ? (
            <Group mt="xl" position="center">
              <Button variant="outline" color="cyan" type="submit">
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
            {...getInputProps("description")}
          />
          <Label required>Banner Image</Label>
          <SingleFileDropzone file={file} setFile={setFile} />
          <Group position="center" mt="xl">
            <Button
              variant="outline"
              color="blue"
              type="submit"
              loading={loading}
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
