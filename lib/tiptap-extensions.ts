import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

/**
 * Shared Tiptap extension configuration.
 * Used by both the live editor and static renderer to ensure consistent output.
 */
export const emailEditorExtensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "list-disc pl-4",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal pl-4",
      },
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Link.configure({
    openOnClick: false,
  }),
  Underline,
];
