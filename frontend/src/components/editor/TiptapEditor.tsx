"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2 sticky top-0 bg-white z-10">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("bold")
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("italic")
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("strike")
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Strike
      </button>
      <div className="w-[1px] bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("heading", { level: 2 })
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("heading", { level: 3 })
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        H3
      </button>
      <div className="w-[1px] bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("bulletList")
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("orderedList")
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Ordered
      </button>
      <div className="w-[1px] bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("blockquote")
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Quote
      </button>
      <button
        type="button"
        onClick={addImage}
        className="px-2 py-1 rounded text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100"
      >
        Image
      </button>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Typography,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // Return HTML content
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none min-h-[300px]",
      },
    },
  });

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
