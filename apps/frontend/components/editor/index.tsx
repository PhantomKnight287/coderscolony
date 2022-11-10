import { readCookie } from "@helpers/cookies";
import {
  Button,
  Divider,
  Modal,
  Tabs,
  Textarea,
  Tooltip,
  TypographyStylesProvider,
  useMantineColorScheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import dynamic from "next/dynamic";
import { IconBrandVscode, IconEye, IconPhoto, IconSend } from "@tabler/icons";
import axios from "axios";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { SingleFileDropzone } from "@components/dropzones/single";
import highlight from "highlight.js";
import { Renderer } from "@components/renderer";
import { getMarkdownString } from "@helpers/showdown";
import Label from "@components/label";

const RTE = dynamic(() => import("@mantine/rte"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface Props {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}
export function Editor({ content, setContent }: Props) {
  const [opened, setOpened] = useState(false);

  const { colorScheme } = useMantineColorScheme();

  const modules = useMemo(
    () => ({
      history: { delay: 2500, userOnly: true },
      syntax: {
        highlight: (text: string) => highlight.highlightAuto(text).value,
      },
    }),
    []
  );
  const [file, setFile] = useState<File>();

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
          .then((d) => resolve({ url: `/images/${d.path}` }))
          .catch(() => reject(new Error("Upload failed")));
      });
    },
    []
  );
  const UpperBar = () => (
    <>
      <div className="flex flex-row items-center justify-between flex-wrap">
        <div className="cursor-pointer p-2 ">
          <Tooltip label="Upload An Image">
            <span onClick={() => setOpened(true)}>
              <IconPhoto
                size={25}
                className="hover:scale-125 duration-[110ms]"
              />
            </span>
          </Tooltip>
        </div>
        <div className="cursor-pointer p-2 ">
          <Tooltip label="Post">
            <span>
              <IconSend
                size={25}
                className="hover:scale-125 duration-[110ms]"
              />
            </span>
          </Tooltip>
        </div>
      </div>
    </>
  );
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
          {/* <EditorContent
            editor={editor}
            className={"break-words whitespace-pre-line break-all"}
          /> */}
          {/* <RTE
            value={content}
            onChange={setContent}
            modules={modules}
            // onImageUpload={handleImageUpload}
          /> */}
          <UpperBar />
          <Textarea
            autosize
            placeholder="Write Something Here"
            value={content}
            onChange={(d) => setContent(d.target.value)}
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
          <Divider orientation="horizontal" />
      <Modal centered opened={opened} onClose={() => setOpened((o) => !o)}>
        <Label required>Image To Upload</Label>
        <SingleFileDropzone mt={"md"} file={file} setFile={setFile} />
        <Button
          fullWidth
          mt="xl"
          onClick={() =>
            handleImageUpload(file!)
              .then((d) => {
                setContent((old) => `${old}\n![alt text](${d.url})\n`);
                setOpened(false);
                setFile(undefined);
              })
              .catch((err) =>
                showNotification({ message: err.message || "An Error Occured" })
              )
          }
          className="bg-[#1864ab] bg-opacity-80 hover:scale-110 duration-[110ms]"
        >
          Upload
        </Button>
      </Modal>
    </>
  );
}
