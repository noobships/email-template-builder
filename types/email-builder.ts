import type { JSONContent } from "@tiptap/core";

export type BlockType =
  | "heading"
  | "text"
  | "image"
  | "button"
  | "header"
  | "columns"
  | "divider"
  | "spacer"
  | "social-links"
  | "footer";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  content: JSONContent;
  level: 1 | 2 | 3;
  align: "left" | "center" | "right";
  color: string;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  content: JSONContent;
  align: "left" | "center" | "right";
  color: string;
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
  align: "left" | "center" | "right";
}

export interface ButtonBlock extends BaseBlock {
  type: "button";
  text: string;
  url: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  align: "left" | "center" | "right";
}

export interface HeaderBlock extends BaseBlock {
  type: "header";
  logoSrc: string;
  brandName: string;
  showBadge: boolean;
}

export interface ColumnsBlock extends BaseBlock {
  type: "columns";
  columns: 2 | 3;
  gap: number;
  content: EmailBlock[][];
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
  color: string;
  thickness: number;
  style: "solid" | "dashed" | "dotted";
}

export interface SpacerBlock extends BaseBlock {
  type: "spacer";
  height: number;
}

export interface SocialLink {
  platform: "twitter" | "facebook" | "instagram" | "linkedin" | "youtube";
  url: string;
}

export interface SocialLinksBlock extends BaseBlock {
  type: "social-links";
  links: SocialLink[];
  iconSize: number;
  align: "left" | "center" | "right";
}

export interface FooterBlock extends BaseBlock {
  type: "footer";
  content: JSONContent;
  align: "left" | "center" | "right";
  color: string;
}

export type EmailBlock =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | ButtonBlock
  | HeaderBlock
  | ColumnsBlock
  | DividerBlock
  | SpacerBlock
  | SocialLinksBlock
  | FooterBlock;

export interface EmailDocument {
  name: string;
  blocks: EmailBlock[];
  settings: {
    backgroundColor: string;
    contentWidth: number;
    previewText?: string;
  };
}
