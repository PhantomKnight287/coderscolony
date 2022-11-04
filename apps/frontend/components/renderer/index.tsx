import { FC } from "react";
import ReactMarkdown from "react-markdown";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";
import remarkGfm from "remark-gfm";
import { Prism } from "@mantine/prism";

const components:
  | Partial<Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents>
  | undefined = {
  code({ node, inline, className, children, ...props }) {
    console.log({
      node,
      inline,
      className,
      children: String(children).replace(/\n$/, ""),
    });
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <Prism
        language={match[1].replace("language-", "") as any}
        {...props}
        children={"console.log('hello')\nconsole.log('yo')"}
      />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export const Renderer: FC<{ children: string }> = ({ children }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
      {children}
    </ReactMarkdown>
  );
};
