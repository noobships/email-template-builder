import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import { Text, Link as EmailLink } from "@react-email/components";
import { emailEditorExtensions } from "./tiptap-extensions";
import type { JSONContent } from "@tiptap/core";
import type { ReactNode } from "react";

interface RenderOptions {
  textColor?: string;
  textAlign?: "left" | "center" | "right";
  fontSize?: number;
}

/**
 * Renders Tiptap JSON content to React Email components.
 *
 * This uses the static renderer with custom node/mark mappings to ensure
 * all content flows through React Email's rendering pipeline.
 *
 * @see docs/tiptap/api/utilities/static-renderer.md
 */
export function renderTiptapToReactEmail(
  content: JSONContent,
  options: RenderOptions = {}
): ReactNode {
  const { textColor, textAlign, fontSize = 16 } = options;

  return renderToReactElement({
    extensions: emailEditorExtensions,
    content,
    options: {
      nodeMapping: {
        // Map paragraph to React Email's Text component
        paragraph: ({ children }) => (
          <Text
            style={{
              color: textColor,
              textAlign: textAlign,
              fontSize,
              lineHeight: 1.6,
              margin: "0 0 8px 0",
            }}
          >
            {children}
          </Text>
        ),
        // Lists with inline styles (email clients don't support external CSS)
        bulletList: ({ children }) => (
          <ul
            style={{
              paddingLeft: 24,
              margin: "0 0 8px 0",
              color: textColor,
            }}
          >
            {children}
          </ul>
        ),
        orderedList: ({ children }) => (
          <ol
            style={{
              paddingLeft: 24,
              margin: "0 0 8px 0",
              color: textColor,
            }}
          >
            {children}
          </ol>
        ),
        listItem: ({ children }) => (
          <li style={{ marginBottom: 4 }}>{children}</li>
        ),
        // Hard break handling
        hardBreak: () => <br />,
      },
      markMapping: {
        bold: ({ children }) => <strong>{children}</strong>,
        italic: ({ children }) => <em>{children}</em>,
        underline: ({ children }) => <u>{children}</u>,
        strike: ({ children }) => <s>{children}</s>,
        link: ({ mark, children }) => (
          <EmailLink
            href={mark.attrs.href as string}
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            {children}
          </EmailLink>
        ),
      },
    },
  });
}

/**
 * Creates an empty Tiptap JSON document.
 * Use this as the default content for new blocks.
 */
export function createEmptyContent(
  text = "Enter your text here..."
): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text,
          },
        ],
      },
    ],
  };
}
