"use client";

import { useState, useEffect } from "react";
import { SerializedEditorState } from "lexical";

import { Editor } from "@/components/blocks/editor-x/editor";

export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function EditorPage() {
  const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <Editor editorSerializedState={editorState} onSerializedChange={(value) => setEditorState(value)} />;
}
