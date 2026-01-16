"use client";

import type React from "react";
import {
  Type,
  Image as ImageIcon,
  LayoutGrid,
  MousePointerClick,
  Table2,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  FileText,
  Columns,
  LayoutTemplate,
  SeparatorHorizontal,
  Maximize2,
  Square,
  Share2,
  ChevronDown,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { BlockType } from "@/types/email-builder";
import { DesignSystemPicker } from "./design-system-picker";

// Hoisted static icons to prevent re-renders (rendering-hoist-jsx)
const ICONS = {
  type: <Type className="size-4" />,
  image: <ImageIcon className="size-4" />,
  layoutGrid: <LayoutGrid className="size-4" />,
  mousePointerClick: <MousePointerClick className="size-4" />,
  table2: <Table2 className="size-4" />,
  code2: <Code2 className="size-4" />,
  heading1: <Heading1 className="size-4" />,
  heading2: <Heading2 className="size-4" />,
  heading3: <Heading3 className="size-4" />,
  heading4: <Heading4 className="size-4" />,
  heading5: <Heading5 className="size-4" />,
  fileText: <FileText className="size-4" />,
  columns: <Columns className="size-4" />,
  layoutTemplate: <LayoutTemplate className="size-4" />,
  separatorHorizontal: <SeparatorHorizontal className="size-4" />,
  maximize2: <Maximize2 className="size-4" />,
  square: <Square className="size-4" />,
  share2: <Share2 className="size-4" />,
  chevronDown: <ChevronDown className="size-3 opacity-50" />,
  list: <List className="size-4" />,
  listOrdered: <ListOrdered className="size-4" />,
  quote: <Quote className="size-4" />,
} as const;

interface BlockPickerToolbarProps {
  onAddBlock: (type: BlockType) => void;
  /** Callback when "Manage Design Systems" is clicked */
  onManageDesignSystemClick?: () => void;
}

interface BlockOption {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface BlockCategory {
  label: string;
  icon: React.ReactNode;
  blocks: BlockOption[];
}

const blockCategories: BlockCategory[] = [
  {
    label: "Text",
    icon: ICONS.type,
    blocks: [
      {
        type: "heading",
        label: "Title (H1)",
        icon: ICONS.heading1,
        description: "Large section title",
      },
      {
        type: "heading",
        label: "Heading (H2)",
        icon: ICONS.heading2,
        description: "Section heading",
      },
      {
        type: "heading",
        label: "Subheading (H3)",
        icon: ICONS.heading3,
        description: "Subsection heading",
      },
      {
        type: "heading",
        label: "H4",
        icon: ICONS.heading4,
      },
      {
        type: "heading",
        label: "H5",
        icon: ICONS.heading5,
      },
      {
        type: "text",
        label: "Paragraph",
        icon: ICONS.fileText,
        description: "Body text content",
      },
      // Future: blockquote, label
    ],
  },
  {
    label: "Media",
    icon: ICONS.image,
    blocks: [
      {
        type: "image",
        label: "Image",
        icon: ICONS.image,
        description: "Add an image",
      },
      // Future: icon, gallery
    ],
  },
  {
    label: "Layout",
    icon: ICONS.layoutGrid,
    blocks: [
      {
        type: "columns",
        label: "Columns",
        icon: ICONS.columns,
        description: "Multi-column layout",
      },
      {
        type: "header",
        label: "Header Section",
        icon: ICONS.layoutTemplate,
        description: "Email header with logo",
      },
      {
        type: "divider",
        label: "Divider",
        icon: ICONS.separatorHorizontal,
        description: "Horizontal line",
      },
      {
        type: "spacer",
        label: "Spacer",
        icon: ICONS.maximize2,
        description: "Vertical spacing",
      },
      {
        type: "footer",
        label: "Footer Section",
        icon: ICONS.fileText,
        description: "Email footer",
      },
    ],
  },
  {
    label: "Interactive",
    icon: ICONS.mousePointerClick,
    blocks: [
      {
        type: "button",
        label: "Button",
        icon: ICONS.square,
        description: "Call-to-action button",
      },
      {
        type: "social-links",
        label: "Social Links",
        icon: ICONS.share2,
        description: "Social media icons",
      },
      // Future: link
    ],
  },
  {
    label: "Data",
    icon: ICONS.table2,
    blocks: [
      {
        type: "list",
        label: "Bullet List",
        icon: ICONS.list,
        description: "Unordered list items",
      },
      {
        type: "list",
        label: "Numbered List",
        icon: ICONS.listOrdered,
        description: "Ordered list items",
      },
    ],
  },
  {
    label: "Advanced",
    icon: ICONS.code2,
    blocks: [
      {
        type: "blockquote",
        label: "Blockquote",
        icon: ICONS.quote,
        description: "Quoted text block",
      },
    ],
  },
];

export function BlockPickerToolbar({
  onAddBlock,
  onManageDesignSystemClick,
}: BlockPickerToolbarProps) {
  return (
    <div className="flex items-center border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Scrollable block categories - uses native scroll for reliability */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex items-center gap-1 px-2 py-1.5 whitespace-nowrap">
          {blockCategories.map((category) => (
            <DropdownMenu key={category.label}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium shrink-0"
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.label}</span>
                  <ChevronDown className="size-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                  {category.label} Blocks
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {category.blocks.map((block, index) => (
                  <DropdownMenuItem
                    key={`${block.type}-${index}`}
                    onClick={() => onAddBlock(block.type)}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md border bg-muted/50">
                      {block.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{block.label}</span>
                      {block.description && (
                        <span className="text-xs text-muted-foreground">
                          {block.description}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

          {/* Design System Picker - visible inside scroll for mobile */}
          <div className="sm:hidden flex items-center shrink-0 pr-2">
            <Separator orientation="vertical" className="mx-1 h-4" />
            <DesignSystemPicker onManageClick={onManageDesignSystemClick} />
          </div>
        </div>
      </div>

      {/* Design System Picker - fixed at right for desktop */}
      <div className="shrink-0 items-center gap-2 px-2 py-1.5 hidden sm:flex">
        <Separator orientation="vertical" className="h-4" />
        <DesignSystemPicker onManageClick={onManageDesignSystemClick} />
      </div>
    </div>
  );
}
