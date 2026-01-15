import { nanoid } from "nanoid";
import type {
  EmailBlock,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  HeaderBlock,
  ColumnsBlock,
  DividerBlock,
  SpacerBlock,
  SocialLinksBlock,
  FooterBlock,
  BlockType,
} from "@/types/email-builder";
import { createEmptyContent } from "./tiptap-react-email-renderer";

export function createBlock(type: BlockType): EmailBlock {
  const id = nanoid();

  switch (type) {
    case "heading":
      return {
        id,
        type: "heading",
        content: createEmptyContent("Your Heading Here"),
        level: 1,
        align: "center",
        color: "#000000",
      } as HeadingBlock;

    case "text":
      return {
        id,
        type: "text",
        content: createEmptyContent(
          "Enter your text here. You can style this text using the properties panel."
        ),
        align: "center",
        color: "#374151",
      } as TextBlock;

    case "image":
      return {
        id,
        type: "image",
        src: "",
        alt: "Image description",
        width: 600,
        height: 300,
        align: "center",
      } as ImageBlock;

    case "button":
      return {
        id,
        type: "button",
        text: "Click Here",
        url: "https://example.com",
        backgroundColor: "#000000",
        textColor: "#ffffff",
        borderRadius: 4,
        align: "center",
      } as ButtonBlock;

    case "header":
      return {
        id,
        type: "header",
        logoSrc: "",
        brandName: "Your Brand",
        showBadge: true,
      } as HeaderBlock;

    case "columns":
      return {
        id,
        type: "columns",
        columns: 2,
        gap: 16,
        content: [[], []],
      } as ColumnsBlock;

    case "divider":
      return {
        id,
        type: "divider",
        color: "#e5e7eb",
        thickness: 1,
        style: "solid",
      } as DividerBlock;

    case "spacer":
      return {
        id,
        type: "spacer",
        height: 32,
      } as SpacerBlock;

    case "social-links":
      return {
        id,
        type: "social-links",
        links: [
          { platform: "twitter", url: "https://twitter.com" },
          { platform: "facebook", url: "https://facebook.com" },
          { platform: "instagram", url: "https://instagram.com" },
        ],
        iconSize: 24,
        align: "center",
      } as SocialLinksBlock;

    case "footer":
      return {
        id,
        type: "footer",
        content: createEmptyContent(
          "© 2026 Your Company. All rights reserved.\nUnsubscribe | Privacy Policy"
        ),
        align: "center",
        color: "#6b7280",
      } as FooterBlock;

    default:
      throw new Error(`Unknown block type: ${type}`);
  }
}
