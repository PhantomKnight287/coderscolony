// TypeScript users only add this code
import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

import { useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

export default function App() {
  const [editor] = useState(() => withReact(createEditor()));
  return (
    <Slate
      editor={editor}
      value={[
        {
          type: "paragraph",
          children: [{ text: "A Paragraph" }],
        },
      ]}
    >
      <Editable />
    </Slate>
  );
}
