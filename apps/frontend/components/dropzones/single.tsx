import { Group, Image, Text, useMantineTheme } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Dispatch, SetStateAction } from "react";
import { showNotification } from "@mantine/notifications";

type Props = {
  file: File | undefined;
  setFile: Dispatch<SetStateAction<File | undefined>>;
  title?: string;
} & Partial<DropzoneProps>;

export function SingleFileDropzone(props: Props) {
  const theme = useMantineTheme();
  return (
    <Dropzone
      onDrop={(files) => props.setFile(files[0])}
      onReject={(files) =>
        showNotification({
          message: files[0].errors[0].message,
          color: "red",
        })
      }
      maxSize={3 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      multiple={false}
      {...props}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: 220, pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          {props.file ? null : (
            <IconUpload
              size={50}
              stroke={1.5}
              color={
                theme.colors[theme.primaryColor][
                  theme.colorScheme === "dark" ? 4 : 6
                ]
              }
            />
          )}
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          {props.file ? null : <IconPhoto size={50} stroke={1.5} />}
          {props.file ? "Click on Image To Select Another Image" : null}
        </Dropzone.Idle>

        <div>
          {props.file === undefined ? (
            <Text size="xl" inline>
              {props.title !== undefined
                ? props.title
                : "Drag image here or click to select file"}
            </Text>
          ) : (
            <Image src={URL.createObjectURL(props.file)} />
          )}
        </div>
      </Group>
    </Dropzone>
  );
}
