"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Settings,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import type { EmailBlock } from "@/types/email-builder";

interface PropertiesPanelProps {
  selectedBlock: EmailBlock | null;
  onUpdateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
}

export function PropertiesPanel({
  selectedBlock,
  onUpdateBlock,
}: PropertiesPanelProps) {
  if (!selectedBlock) {
    return (
      <aside className="w-72 border-l border-border bg-background">
        <Tabs defaultValue="block">
          <div className="border-b border-border p-3">
            <TabsList className="w-full">
              <TabsTrigger value="block" className="flex-1 gap-1.5 text-xs">
                <Settings className="h-3.5 w-3.5" />
                Block
              </TabsTrigger>
              <TabsTrigger value="style" className="flex-1 gap-1.5 text-xs">
                <Palette className="h-3.5 w-3.5" />
                Style
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex h-64 items-center justify-center p-4 text-center text-sm text-muted-foreground">
            Select a block to edit its properties
          </div>
        </Tabs>
      </aside>
    );
  }

  const handleUpdate = (updates: Partial<EmailBlock>) => {
    onUpdateBlock(selectedBlock.id, updates);
  };

  return (
    <aside className="w-72 border-l border-border bg-background">
      <Tabs defaultValue="block">
        <div className="border-b border-border p-3">
          <TabsList className="w-full">
            <TabsTrigger value="block" className="flex-1 gap-1.5 text-xs">
              <Settings className="h-3.5 w-3.5" />
              Block
            </TabsTrigger>
            <TabsTrigger value="style" className="flex-1 gap-1.5 text-xs">
              <Palette className="h-3.5 w-3.5" />
              Style
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <TabsContent value="block" className="mt-0 p-4">
            <BlockProperties block={selectedBlock} onUpdate={handleUpdate} />
          </TabsContent>

          <TabsContent value="style" className="mt-0 p-4">
            <StyleProperties block={selectedBlock} onUpdate={handleUpdate} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}

function BlockProperties({
  block,
  onUpdate,
}: {
  block: EmailBlock;
  onUpdate: (updates: Partial<EmailBlock>) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Content</Label>
            <p className="text-xs text-muted-foreground">
              Click on the block to edit content inline with rich text
              formatting.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Heading Level</Label>
            <Select
              value={String(block.level)}
              onValueChange={(v) => onUpdate({ level: Number(v) as 1 | 2 | 3 })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1 - Large</SelectItem>
                <SelectItem value="2">H2 - Medium</SelectItem>
                <SelectItem value="3">H3 - Small</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Content</Label>
            <p className="text-xs text-muted-foreground">
              Click on the block to edit content inline with rich text
              formatting.
            </p>
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Image URL</Label>
            <Input
              value={block.src}
              onChange={(e) => onUpdate({ src: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Alt Text</Label>
            <Input
              value={block.alt}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Width</Label>
              <Input
                type="number"
                value={block.width}
                onChange={(e) => onUpdate({ width: Number(e.target.value) })}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Height</Label>
              <Input
                type="number"
                value={block.height}
                onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      );

    case "button":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Button Text</Label>
            <Input
              value={block.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">URL</Label>
            <Input
              value={block.url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://example.com"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Border Radius</Label>
            <Slider
              value={[block.borderRadius]}
              onValueChange={([v]) => onUpdate({ borderRadius: v })}
              max={24}
              step={1}
              className="py-2"
            />
            <span className="text-xs text-muted-foreground">
              {block.borderRadius}px
            </span>
          </div>
        </div>
      );

    case "header":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Logo URL</Label>
            <Input
              value={block.logoSrc}
              onChange={(e) => onUpdate({ logoSrc: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Brand Name</Label>
            <Input
              value={block.brandName}
              onChange={(e) => onUpdate({ brandName: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Show Badge</Label>
            <Switch
              checked={block.showBadge}
              onCheckedChange={(v) => onUpdate({ showBadge: v })}
            />
          </div>
        </div>
      );

    case "columns":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Number of Columns</Label>
            <Select
              value={String(block.columns)}
              onValueChange={(v) => onUpdate({ columns: Number(v) as 2 | 3 })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Gap</Label>
            <Slider
              value={[block.gap]}
              onValueChange={([v]) => onUpdate({ gap: v })}
              max={48}
              step={4}
              className="py-2"
            />
            <span className="text-xs text-muted-foreground">{block.gap}px</span>
          </div>
        </div>
      );

    case "divider":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Style</Label>
            <Select
              value={block.style}
              onValueChange={(v) =>
                onUpdate({ style: v as "solid" | "dashed" | "dotted" })
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Thickness</Label>
            <Slider
              value={[block.thickness]}
              onValueChange={([v]) => onUpdate({ thickness: v })}
              min={1}
              max={4}
              step={1}
              className="py-2"
            />
            <span className="text-xs text-muted-foreground">
              {block.thickness}px
            </span>
          </div>
        </div>
      );

    case "spacer":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Height</Label>
            <Slider
              value={[block.height]}
              onValueChange={([v]) => onUpdate({ height: v })}
              min={8}
              max={120}
              step={8}
              className="py-2"
            />
            <span className="text-xs text-muted-foreground">
              {block.height}px
            </span>
          </div>
        </div>
      );

    case "social-links":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Icon Size</Label>
            <Slider
              value={[block.iconSize]}
              onValueChange={([v]) => onUpdate({ iconSize: v })}
              min={16}
              max={40}
              step={4}
              className="py-2"
            />
            <span className="text-xs text-muted-foreground">
              {block.iconSize}px
            </span>
          </div>
          <div className="space-y-3">
            <Label className="text-xs">Social Links</Label>
            {block.links.map((link, index) => (
              <div key={link.platform} className="space-y-1">
                <Label className="text-xs capitalize text-muted-foreground">
                  {link.platform}
                </Label>
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...block.links];
                    newLinks[index] = { ...link, url: e.target.value };
                    onUpdate({ links: newLinks });
                  }}
                  placeholder={`https://${link.platform}.com/...`}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "footer":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Content</Label>
            <p className="text-xs text-muted-foreground">
              Click on the block to edit content inline with rich text
              formatting.
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

function StyleProperties({
  block,
  onUpdate,
}: {
  block: EmailBlock;
  onUpdate: (updates: Partial<EmailBlock>) => void;
}) {
  const hasAlign = [
    "heading",
    "text",
    "image",
    "button",
    "social-links",
    "footer",
  ].includes(block.type);
  const hasColor = ["heading", "text", "divider", "footer"].includes(
    block.type
  );
  const hasButtonColors = block.type === "button";

  return (
    <div className="space-y-4">
      {hasAlign && "align" in block && (
        <div className="space-y-2">
          <Label className="text-xs">Alignment</Label>
          <ToggleGroup
            type="single"
            value={block.align}
            onValueChange={(v) =>
              v && onUpdate({ align: v as "left" | "center" | "right" })
            }
            className="justify-start"
          >
            <ToggleGroupItem value="left" className="h-8 w-8">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" className="h-8 w-8">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" className="h-8 w-8">
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      {hasColor && "color" in block && (
        <div className="space-y-2">
          <Label className="text-xs">Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={block.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="h-8 w-12 cursor-pointer p-1"
            />
            <Input
              value={block.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="h-8 flex-1 font-mono text-sm uppercase"
            />
          </div>
        </div>
      )}

      {hasButtonColors && block.type === "button" && (
        <>
          <div className="space-y-2">
            <Label className="text-xs">Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={block.backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="h-8 w-12 cursor-pointer p-1"
              />
              <Input
                value={block.backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="h-8 flex-1 font-mono text-sm uppercase"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={block.textColor}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="h-8 w-12 cursor-pointer p-1"
              />
              <Input
                value={block.textColor}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="h-8 flex-1 font-mono text-sm uppercase"
              />
            </div>
          </div>
        </>
      )}

      {!hasAlign && !hasColor && !hasButtonColors && (
        <p className="text-sm text-muted-foreground">
          No style options available for this block type.
        </p>
      )}
    </div>
  );
}
