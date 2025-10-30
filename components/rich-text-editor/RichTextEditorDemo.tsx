"use client";

import { useState, useEffect, useRef } from "react";
import { SerializedEditorState } from "lexical";
import { Label } from "@/components/ui/label";

import { Editor } from "@/components/blocks/editor-x/editor";

// extra added
import { createEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";

import { nodes } from "@/components/blocks/editor-x/nodes";

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
            text: "Hello World 🚀",
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

export default function RichTextEditorDemo({ className = "", label = "", state = {}, setState = () => {} }: any) {
  const [editorState, setEditorState] = useState<SerializedEditorState>(
    state.editorState
  );
  const getFormattedContent = () => {
    if (!editorState) return;

    // Create a temporary Lexical editor instance to parse the saved state
    const tempEditor = createEditor({
      nodes: nodes,
    });

    // Parse and set the serialized state
    const parsed = tempEditor.parseEditorState(editorState);
    tempEditor.setEditorState(parsed);

    // --- Generate outputs ---
    let html = "";
    let markdown = "";
    const json = JSON.stringify(editorState);

    tempEditor.update(() => {
      html = $generateHtmlFromNodes(tempEditor);
      markdown = $convertToMarkdownString(TRANSFORMERS);
    });

    // console.log("🧾 HTML:", html);
    // console.log("🪶 Markdown:", markdown);
    // console.log("🧠 JSON:", json);
    let cleaned = html.replace(/ style="[^"]*"/g, "");
    cleaned = cleaned
      .replace(/<p>/g, '<p class="leading-7 [&:not(:first-child)]:mt-6">')
      .replace(/<h1>/g, '<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">')
      .replace(/<h2>/g, '<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">')
      .replace(/<h3>/g, '<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">')
      .replace(/<ul>/g, '<ul class="m-0 p-0 list-disc list-inside [&>li]:mt-2">')
      .replace(/<ol>/g, '<ol class="m-0 p-0 list-decimal list-inside [&>li]:mt-2">')
      .replace(/<li>/g, '<li class="ml-6 [&>ul]:ml-6 [&>ol]:ml-6">')
      .replace(/<strong>/g, '<strong class="font-bold">')
      .replace(/<b>/g, '<b class="font-bold">')
      .replace(/<em>/g, '<em class="italic">')
      .replace(/<code>/g, '<code class="bg-gray-100 p-1 rounded-md">');

    return { html: cleaned, markdown, json };

    // You can now send { html, markdown, json } to your database
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
      }}
      className={`grid items-center gap-1.5 relative ${className}`}
    >
      {label && <Label className="w-fit text-sm font-medium">{label}</Label>}
      <Editor
        editorSerializedState={editorState}
        onSerializedChange={(value) => {
          setEditorState(value);
          const formattedContent = getFormattedContent();
          if (!formattedContent) return;

          setState((prev: any) => ({
            ...prev,
            content: formattedContent.html,
            editorState: JSON.stringify(value),
          }));
        }}
      />
    </div>
  );
}
