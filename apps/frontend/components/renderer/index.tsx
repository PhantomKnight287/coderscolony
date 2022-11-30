import { FC, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";
import remarkGfm from "remark-gfm";
import { Prism } from "@mantine/prism";
import styles from "./renderer.module.scss";
import { useMantineColorScheme } from "@mantine/core";
import { slugify } from "@helpers/slugify";
import rehypeRaw from "rehype-raw";
import remarkImages from "remark-images";
export const Renderer: FC<{ children: string }> = ({ children }) => {
  const { colorScheme } = useMantineColorScheme();
  const components:
    | Partial<
        Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
      >
    | undefined = useMemo(() => {
    return {
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <Prism
            language={match[1].replace("language-", "") as any}
            {...props}
            children={String(children).replace(/\n$/, "")}
          />
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      h1: ({ node, children, ...props }) => (
        <h1
          className={styles.h1}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
          id={children ? slugify(children.toString()) : ""}
        >
          <a href={`#${children ? slugify(children.toString()) : ""}`}>
            {children}
          </a>
        </h1>
      ),
      h2: ({ node, children, ...props }) => (
        <h2
          {...props}
          className={styles.h2}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
          id={children ? slugify(children.toString()) : ""}
        >
          <a href={`#${children ? slugify(children.toString()) : ""}`}>
            {children}
          </a>
        </h2>
      ),
      h3: ({ node, children, ...props }) => (
        <h3
          {...props}
          className={styles.h3}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
          id={children ? slugify(children.toString()) : ""}
        >
          <a href={`#${children ? slugify(children.toString()) : ""}`}>
            {children}
          </a>
        </h3>
      ),
      h4: ({ node, ...props }) => (
        <h4
          {...props}
          className={styles.h4}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
        />
      ),
      h5: ({ node, ...props }) => (
        <h5
          {...props}
          className={styles.h5}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
        />
      ),
      h6: ({ node, ...props }) => (
        <h6
          {...props}
          className={styles.h6}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
        />
      ),
      ul: ({ node, ...props }) => (
        <ul {...props} className={"list-disc ml-4"} />
      ),
      ol: ({ node, ...props }) => (
        <ol {...props} className={"list-decimal ml-4"} />
      ),
      a: ({ node, ...props }) => {
        return <a {...props} target="blank" rel="noreferrer noopener" className="hover:underline text-blue-500" />;
      },
    };
  }, []);
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkImages]}
      components={components}
      skipHtml={false}
      rehypePlugins={[
        rehypeRaw,
        // rehypeSanitize,
        // rehypeHighlight,
      ]}
      children={children}
      className={styles.renderer}
    />
  );
};
