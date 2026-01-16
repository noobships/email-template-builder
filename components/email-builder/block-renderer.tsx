"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronUp, ChevronDown, ImageIcon } from "lucide-react";
import type { EmailBlock } from "@/types/email-builder";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./social-icon";
import { TiptapEditor } from "./tiptap-editor";
import { generateHTML } from "@tiptap/html";
import { emailEditorExtensions } from "@/lib/tiptap-extensions";
import { useDesignSystem } from "@/lib/design-system-context";

interface BlockRendererProps {
  block: EmailBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  simulateMode: "light" | "dark";
  onUpdateBlock?: (updates: Partial<EmailBlock>) => void;
}

export function BlockRenderer({
  block,
  isSelected,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  simulateMode,
  onUpdateBlock,
}: BlockRendererProps) {
  // Get design system resolved styles
  const { resolveBlockStyles } = useDesignSystem();
  const resolvedStyles = resolveBlockStyles(block);

  // In dark simulate mode, override colors for better contrast
  const getDisplayColor = (resolvedColor?: string, fallback = "#000000") => {
    if (simulateMode === "dark") return "#e5e7eb";
    return resolvedColor ?? fallback;
  };

  const renderBlock = () => {
    switch (block.type) {
      case "heading": {
        const HeadingTag = `h${block.level}` as React.ElementType;
        const headingColor = getDisplayColor(resolvedStyles.color);
        if (isSelected && onUpdateBlock) {
          return (
            <TiptapEditor
              content={block.content}
              onUpdate={(content) => onUpdateBlock({ content })}
              className={cn(
                "font-bold",
                block.level === 1 && "text-3xl",
                block.level === 2 && "text-2xl",
                block.level === 3 && "text-xl"
              )}
              textColor={headingColor}
              simulateMode={simulateMode}
            />
          );
        }
        return (
          <HeadingTag
            className={cn(
              "font-bold",
              block.level === 1 && "text-3xl",
              block.level === 2 && "text-2xl",
              block.level === 3 && "text-xl"
            )}
            style={{
              textAlign: block.align,
              color: headingColor,
              fontFamily: resolvedStyles.fontFamily,
              fontWeight: resolvedStyles.fontWeight,
            }}
            dangerouslySetInnerHTML={{
              __html: generateHTML(block.content, emailEditorExtensions),
            }}
          />
        );
      }

      case "text": {
        const textBlockColor = getDisplayColor(resolvedStyles.color, "#374151");
        if (isSelected && onUpdateBlock) {
          return (
            <TiptapEditor
              content={block.content}
              onUpdate={(content) => onUpdateBlock({ content })}
              className="leading-relaxed"
              textColor={textBlockColor}
              simulateMode={simulateMode}
            />
          );
        }
        return (
          <div
            style={{
              textAlign: block.align,
              color: textBlockColor,
              fontFamily: resolvedStyles.fontFamily,
              fontSize: resolvedStyles.fontSize,
              lineHeight: resolvedStyles.lineHeight,
            }}
            className="leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: generateHTML(block.content, emailEditorExtensions),
            }}
          />
        );
      }

      case "image":
        return (
          <div style={{ textAlign: block.align }}>
            {block.src ? (
              <img
                src={block.src || "/placeholder.svg"}
                alt={block.alt}
                style={{
                  width: block.width,
                  height: block.height,
                  objectFit: "cover",
                  display: "inline-block",
                }}
                className="rounded-md"
              />
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center rounded-md",
                  simulateMode === "dark" ? "bg-zinc-700" : "bg-muted"
                )}
                style={{
                  width: block.width,
                  height: block.height,
                  display: "inline-flex",
                }}
              >
                <ImageIcon
                  className={cn(
                    "h-12 w-12",
                    simulateMode === "dark"
                      ? "text-zinc-500"
                      : "text-muted-foreground"
                  )}
                />
              </div>
            )}
          </div>
        );

      case "button": {
        const buttonBg =
          resolvedStyles.backgroundColor ?? block.backgroundColor;
        const buttonText = resolvedStyles.textColor ?? block.textColor;
        const buttonRadius = resolvedStyles.borderRadius ?? block.borderRadius;
        return (
          <div style={{ textAlign: block.align }}>
            <a
              href={block.url}
              className="inline-block px-6 py-3 text-base font-medium"
              style={{
                backgroundColor: buttonBg,
                color: buttonText,
                borderRadius: buttonRadius,
                textDecoration: "none",
                fontFamily: resolvedStyles.fontFamily,
              }}
            >
              {block.text}
            </a>
          </div>
        );
      }

      case "header": {
        const headerTextColor = getDisplayColor(undefined, "#000000");
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {block.logoSrc ? (
                <img
                  src={block.logoSrc || "/placeholder.svg"}
                  alt={block.brandName}
                  className="h-10 w-10 rounded-md object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-md",
                    simulateMode === "dark" ? "bg-zinc-700" : "bg-muted"
                  )}
                />
              )}
              <span
                className="font-semibold"
                style={{ color: headerTextColor }}
              >
                {block.brandName}
              </span>
            </div>
            {block.showBadge && (
              <div className="h-4 w-4 rounded-full bg-cyan-500" />
            )}
          </div>
        );
      }

      case "columns":
        return (
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${block.columns}, 1fr)`,
              gap: block.gap,
            }}
          >
            {block.content.map((_, colIndex) => (
              <div
                key={colIndex}
                className={cn(
                  "min-h-24 rounded-md border-2 border-dashed p-4",
                  simulateMode === "dark"
                    ? "border-zinc-600 text-zinc-400"
                    : "border-border text-muted-foreground"
                )}
              >
                <p className="text-center text-xs">Column {colIndex + 1}</p>
              </div>
            ))}
          </div>
        );

      case "divider": {
        const dividerColor = resolvedStyles.color ?? block.color;
        const dividerThickness = resolvedStyles.thickness ?? block.thickness;
        const dividerStyle = resolvedStyles.style ?? block.style;
        return (
          <hr
            style={{
              borderColor: dividerColor,
              borderWidth: dividerThickness,
              borderStyle: dividerStyle,
            }}
          />
        );
      }

      case "spacer":
        return <div style={{ height: block.height }} />;

      case "social-links":
        return (
          <div
            className="flex gap-4"
            style={{
              justifyContent:
                block.align === "center"
                  ? "center"
                  : block.align === "right"
                    ? "flex-end"
                    : "flex-start",
            }}
          >
            {block.links.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                className={cn(
                  "flex items-center justify-center rounded-md transition-colors",
                  simulateMode === "dark"
                    ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                style={{
                  width: block.iconSize + 16,
                  height: block.iconSize + 16,
                }}
              >
                <SocialIcon platform={link.platform} size={block.iconSize} />
              </a>
            ))}
          </div>
        );

      case "footer": {
        const footerColor = getDisplayColor(resolvedStyles.color, block.color);
        if (isSelected && onUpdateBlock) {
          return (
            <TiptapEditor
              content={block.content}
              onUpdate={(content) => onUpdateBlock({ content })}
              className="text-sm"
              textColor={footerColor}
              simulateMode={simulateMode}
            />
          );
        }
        return (
          <div
            className="text-sm"
            style={{
              textAlign: block.align,
              color: footerColor,
              fontFamily: resolvedStyles.fontFamily,
              fontSize: resolvedStyles.fontSize,
            }}
            dangerouslySetInnerHTML={{
              __html: generateHTML(block.content, emailEditorExtensions),
            }}
          />
        );
      }

      case "list": {
        const listColor = getDisplayColor(resolvedStyles.color, block.color);
        if (isSelected && onUpdateBlock) {
          return (
            <TiptapEditor
              content={block.content}
              onUpdate={(content) => onUpdateBlock({ content })}
              textColor={listColor}
              simulateMode={simulateMode}
            />
          );
        }
        return (
          <div
            style={{
              color: listColor,
              fontFamily: resolvedStyles.fontFamily,
            }}
            dangerouslySetInnerHTML={{
              __html: generateHTML(block.content, emailEditorExtensions),
            }}
          />
        );
      }

      case "blockquote": {
        const quoteColor = getDisplayColor(resolvedStyles.color, block.color);
        if (isSelected && onUpdateBlock) {
          return (
            <TiptapEditor
              content={block.content}
              onUpdate={(content) => onUpdateBlock({ content })}
              textColor={quoteColor}
              simulateMode={simulateMode}
            />
          );
        }
        return (
          <blockquote
            style={{
              color: quoteColor,
              borderLeftColor: resolvedStyles.borderColor,
              borderLeftWidth: 3,
              borderLeftStyle: "solid",
              paddingLeft: 16,
              fontFamily: resolvedStyles.fontFamily,
              fontStyle: "italic",
            }}
            dangerouslySetInnerHTML={{
              __html: generateHTML(block.content, emailEditorExtensions),
            }}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "group relative mb-4 cursor-pointer rounded-md p-2 transition-all",
        isSelected
          ? "ring-2 ring-primary ring-offset-2"
          : "hover:ring-1 hover:ring-muted-foreground/20"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {renderBlock()}

      {isSelected && (
        <div className="absolute -right-2 -top-2 flex gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="h-6 w-6 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-6 w-6 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={!canMoveDown}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-6 w-6 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
