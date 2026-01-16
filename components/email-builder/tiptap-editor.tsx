"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import { useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { emailEditorExtensions } from "@/lib/tiptap-extensions";

interface TiptapEditorProps {
  content: JSONContent;
  onUpdate: (content: JSONContent) => void;
  className?: string;
  textColor?: string;
  simulateMode?: "light" | "dark";
}

export function TiptapEditor({
  content,
  onUpdate,
  className,
  textColor,
  simulateMode = "light",
}: TiptapEditorProps) {
  // Track if content change is from external source vs editor typing
  const isExternalUpdate = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: emailEditorExtensions,
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[60px] px-3 py-2",
          "prose-p:my-1 prose-ul:my-1 prose-ol:my-1",
          className
        ),
        style: textColor ? `color: ${textColor}` : "",
      },
    },
    onUpdate: ({ editor }) => {
      if (!isExternalUpdate.current) {
        onUpdate(editor.getJSON());
      }
    },
  });

  // Sync external content changes to editor
  useEffect(() => {
    if (editor && content) {
      const currentJSON = JSON.stringify(editor.getJSON());
      const newJSON = JSON.stringify(content);
      if (currentJSON !== newJSON) {
        isExternalUpdate.current = true;
        editor.commands.setContent(content);
        isExternalUpdate.current = false;
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-md border",
        simulateMode === "dark"
          ? "border-zinc-600 bg-zinc-800"
          : "border-input bg-background"
      )}
    >
      <EditorToolbar editor={editor} simulateMode={simulateMode} />
      <EditorContent editor={editor} />
    </div>
  );
}

function EditorToolbar({
  editor,
  simulateMode,
}: {
  editor: Editor;
  simulateMode: "light" | "dark";
}) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 border-b px-2 py-1.5",
        simulateMode === "dark" ? "border-zinc-600" : "border-input"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", editor.isActive("bold") && "bg-muted")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", editor.isActive("italic") && "bg-muted")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", editor.isActive("underline") && "bg-muted")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", editor.isActive("strike") && "bg-muted")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-5 w-px bg-border" />

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7",
          editor.isActive({ textAlign: "left" }) && "bg-muted"
        )}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7",
          editor.isActive({ textAlign: "center" }) && "bg-muted"
        )}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7",
          editor.isActive({ textAlign: "right" }) && "bg-muted"
        )}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-5 w-px bg-border" />

      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", editor.isActive("bulletList") && "bg-muted")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", editor.isActive("orderedList") && "bg-muted")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-5 w-px bg-border" />

      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", editor.isActive("link") && "bg-muted")}
        onClick={setLink}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
