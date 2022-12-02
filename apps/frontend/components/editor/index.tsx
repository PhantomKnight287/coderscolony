import { readCookie } from "@helpers/cookies";
import {
  Button,
  DefaultProps,
  Divider,
  Modal,
  Tabs,
  Textarea,
  TextareaProps,
  TextInput,
  TextInputStylesNames,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import dynamic from "next/dynamic";
import {
  IconBrandVscode,
  IconDice,
  IconEye,
  IconPhoto,
  IconSend,
} from "@tabler/icons";
import axios from "axios";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { SingleFileDropzone } from "@components/dropzones/single";
import { nanoid } from "nanoid";
import { Renderer } from "@components/renderer";
import { getMarkdownString } from "@helpers/showdown";
import Label from "@components/label";
import { ToolBar } from "./toolbar";
import { useForm } from "@mantine/form";

const RTE = dynamic(() => import("@mantine/rte"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface Props extends TextareaProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  createPost: (content: string, slug: string) => void | Promise<boolean>;
  slug?: string;
  clickOnSendIconHandler?: () => void;
  renderDivider?: boolean;
}
export function Editor({
  content,
  setContent,
  createPost,
  slug,
  clickOnSendIconHandler,
  renderDivider,
  ...other
}: Props) {
  const [opened, setOpened] = useState(false);
  const [file, setFile] = useState<File>();
  const [submitModalOpened, setSubmitModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleImageUpload = useCallback(
    (file: File | undefined): Promise<{ url: string }> => {
      return new Promise((resolve, reject) => {
        if (!file) return reject(new Error("Please Select A File."));
        const cookie = readCookie("token");
        if (!cookie) {
          showNotification({
            message: "Session Expired. Please Login Again.",
          });
          reject(new Error("Upload Failed"));
        }
        const formData = new FormData();
        formData.append(
          "file",
          new File([file!], file.name.replace(/\s/g, "-").replace(/_+/g, "-"), {
            type: file.type,
          })
        );
        axios
          .post("/api/upload", formData, {
            headers: {
              authorization: `Bearer ${cookie}`,
            },
          })
          .then((d) => d.data)
          .then((d) => {
            setFile(undefined);
            resolve({ url: `/images/${d.path}` });
          })
          .catch(() => reject(new Error("Upload failed")));
      });
    },
    []
  );
  const formState = useForm({
    initialValues: {
      slug: slug || "",
    },
  });
  const _handler = () => {
    if (!content)
      return showNotification({
        message: "Please Type Content of the Post",
        color: "red",
      });
    setSubmitModalOpened(true);
  };
  const handler = clickOnSendIconHandler ?? _handler;
  return (
    <>
      <Tabs defaultValue={"editor"}>
        <Tabs.List>
          <Tabs.Tab value="editor" icon={<IconBrandVscode size={14} />}>
            Editor
          </Tabs.Tab>
          <Tabs.Tab value="preview" icon={<IconEye size={14} />}>
            Preview
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="editor" pt="xs">
          <ToolBar setOpened={setOpened} handler={handler} />
          <Textarea
            autosize
            placeholder="Write Something Here"
            value={content}
            onChange={(d) => setContent(d.target.value)}
            {...other}
            className="mb-5"
          />
        </Tabs.Panel>
        <Tabs.Panel value="preview" pt="xs">
          {content ? (
            <Renderer children={getMarkdownString(content)} />
          ) : (
            <p className="text-center my-5">Nothing To Preview</p>
          )}
        </Tabs.Panel>
      </Tabs>
      {!renderDivider ? null : <Divider orientation="horizontal" />}
      <Modal centered opened={opened} onClose={() => setOpened((o) => !o)}>
        <Label required>Image To Upload</Label>
        <SingleFileDropzone mt={"md"} file={file} setFile={setFile} />
        <Button
          fullWidth
          mt="xl"
          onClick={() => {
            setLoading(true);
            handleImageUpload(file!)
              .then((d) => {
                setContent((old) => `${old}\n![alt text](${d.url})\n`);
                setOpened(false);
                setFile(undefined);
              })
              .catch((err) =>
                showNotification({ message: err.message || "An Error Occured" })
              )
              .finally(() => setLoading(false));
          }}
          loading={loading}
          className="bg-[#1864ab] bg-opacity-80 hover:scale-110 duration-[110ms]"
        >
          Upload
        </Button>
      </Modal>
      <Modal
        centered
        opened={submitModalOpened}
        onClose={() => setSubmitModalOpened((o) => !o)}
        title="Last Step"
      >
        <form onSubmit={formState.onSubmit((d) => createPost(content, d.slug))}>
          <TextInput
            label="Slug"
            placeholder="Unique Slug for Your Post"
            required
            type="text"
            {...formState.getInputProps("slug")}
            rightSection={
              <Button
                onClick={() => {
                  formState.setFieldValue("slug", nanoid(10));
                }}
                className="cursor-pointer min-w-max mr-8 hover:bg-inherit "
              >
                Random
              </Button>
            }
          />
          <Button
            fullWidth
            mt="xl"
            type="submit"
            className="bg-[#1864ab] bg-opacity-80 hover:scale-105  duration-[110ms]"
          >
            Create <IconSend size={25} />
          </Button>
        </form>
      </Modal>
    </>
  );
}
