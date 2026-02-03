"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { useEffect } from "react";

interface TiptapViewerProps {
  content: object; // JSON content
}

export default function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false, // Read-only
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: true, // Allow clicking links
      }),
      Typography,
      Youtube.configure({
        controls: false,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none",
      },
    },
  });

  // Update content if it changes (e.g. initial load)
  useEffect(() => {
    if (editor && content) {
      // Tiptap handles JSON content well
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return <EditorContent editor={editor} />;
}
