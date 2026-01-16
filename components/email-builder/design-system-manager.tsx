"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, Copy, Pencil, Check, X, Lock } from "lucide-react";
import { useDesignSystem } from "@/lib/design-system-context";
import { PRESET_DESIGN_SYSTEMS } from "@/lib/design-system-presets";
import type {
  DesignSystem,
  DesignSystemTokens,
  EmailFontFamily,
  FontWeight,
  PartialDesignSystemTokens,
} from "@/types/design-system";
import { cn } from "@/lib/utils";

/** Available email-safe fonts */
const FONT_OPTIONS: { value: EmailFontFamily; label: string }[] = [
  { value: "Arial, Helvetica, sans-serif", label: "Arial" },
  { value: "Georgia, Times New Roman, serif", label: "Georgia" },
  { value: "Verdana, Geneva, sans-serif", label: "Verdana" },
  { value: "Trebuchet MS, sans-serif", label: "Trebuchet MS" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "Tahoma, sans-serif", label: "Tahoma" },
];

/** Available font weights */
const WEIGHT_OPTIONS: { value: FontWeight; label: string }[] = [
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semibold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

interface DesignSystemManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Sheet panel for managing design systems (create, edit, delete).
 */
export function DesignSystemManager({
  open,
  onOpenChange,
}: DesignSystemManagerProps) {
  const {
    designSystems,
    createUserDesignSystem,
    updateDesignSystem,
    deleteDesignSystem,
    duplicateDesignSystem,
  } = useDesignSystem();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "edit">("list");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Find selected design system
  const selectedDS = selectedId
    ? (designSystems.find((ds) => ds.id === selectedId) ?? null)
    : null;

  // Check if selected is a preset (read-only)
  const isPreset = selectedId
    ? PRESET_DESIGN_SYSTEMS.some((p) => p.id === selectedId)
    : false;

  const presetIds = new Set(PRESET_DESIGN_SYSTEMS.map((p) => p.id));
  const userSystems = designSystems.filter((ds) => !presetIds.has(ds.id));

  const handleCreate = () => {
    if (!newName.trim()) return;
    const ds = createUserDesignSystem(newName.trim());
    setSelectedId(ds.id);
    setNewName("");
    setIsCreating(false);
  };

  const handleStartEditName = (ds: DesignSystem) => {
    setEditingName(ds.id);
    setEditName(ds.name);
  };

  const handleSaveEditName = () => {
    if (editingName && editName.trim()) {
      updateDesignSystem(editingName, { name: editName.trim() });
    }
    setEditingName(null);
    setEditName("");
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateDesignSystem(id);
    if (dup) {
      setSelectedId(dup.id);
    }
  };

  const handleDelete = (id: string) => {
    deleteDesignSystem(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleTokenUpdate = (updates: PartialDesignSystemTokens) => {
    if (selectedId && !isPreset) {
      updateDesignSystem(selectedId, { tokens: updates });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b shrink-0">
          <SheetTitle>Design Systems</SheetTitle>
          <SheetDescription>
            Create and manage reusable brand kits for your email templates.
          </SheetDescription>
        </SheetHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "list" | "edit")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="mx-4 mt-2 shrink-0">
            <TabsTrigger value="list">All Systems</TabsTrigger>
            <TabsTrigger value="edit" disabled={!selectedDS}>
              {selectedDS ? "Edit Tokens" : "Select to Edit"}
            </TabsTrigger>
          </TabsList>

          {/* List Tab */}
          <TabsContent value="list" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {/* Create new */}
                {isCreating ? (
                  <div className="flex gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Design system name..."
                      className="flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreate();
                        if (e.key === "Escape") setIsCreating(false);
                      }}
                    />
                    <Button size="icon" variant="ghost" onClick={handleCreate}>
                      <Check className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsCreating(false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setIsCreating(true)}
                  >
                    <Plus className="size-4" />
                    Create New Design System
                  </Button>
                )}

                {/* Presets section */}
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Presets
                  </h4>
                  {PRESET_DESIGN_SYSTEMS.map((ds) => (
                    <DesignSystemListItem
                      key={ds.id}
                      ds={ds}
                      isSelected={selectedId === ds.id}
                      isPreset
                      isEditingName={editingName === ds.id}
                      editName={editName}
                      onSelect={() => {
                        setSelectedId(ds.id);
                        setActiveTab("edit");
                      }}
                      onEditName={setEditName}
                      onStartEditName={() => handleStartEditName(ds)}
                      onSaveEditName={handleSaveEditName}
                      onCancelEditName={() => setEditingName(null)}
                      onDuplicate={() => handleDuplicate(ds.id)}
                      onDelete={() => handleDelete(ds.id)}
                    />
                  ))}
                </div>

                {/* User systems section */}
                {userSystems.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Your Systems
                    </h4>
                    {userSystems.map((ds) => (
                      <DesignSystemListItem
                        key={ds.id}
                        ds={ds}
                        isSelected={selectedId === ds.id}
                        isPreset={false}
                        isEditingName={editingName === ds.id}
                        editName={editName}
                        onSelect={() => {
                          setSelectedId(ds.id);
                          setActiveTab("edit");
                        }}
                        onEditName={setEditName}
                        onStartEditName={() => handleStartEditName(ds)}
                        onSaveEditName={handleSaveEditName}
                        onCancelEditName={() => setEditingName(null)}
                        onDuplicate={() => handleDuplicate(ds.id)}
                        onDelete={() => handleDelete(ds.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="flex-1 overflow-hidden m-0">
            {selectedDS && (
              <ScrollArea className="h-full">
                <div className="p-4">
                  {isPreset && (
                    <div className="mb-4 p-3 bg-muted rounded-lg flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="size-4" />
                      Presets are read-only. Duplicate to customize.
                    </div>
                  )}
                  <TokenEditor
                    tokens={selectedDS.tokens}
                    onChange={handleTokenUpdate}
                    disabled={isPreset}
                  />
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

/** List item for a design system */
function DesignSystemListItem({
  ds,
  isSelected,
  isPreset,
  isEditingName,
  editName,
  onSelect,
  onEditName,
  onStartEditName,
  onSaveEditName,
  onCancelEditName,
  onDuplicate,
  onDelete,
}: {
  ds: DesignSystem;
  isSelected: boolean;
  isPreset: boolean;
  isEditingName: boolean;
  editName: string;
  onSelect: () => void;
  onEditName: (name: string) => void;
  onStartEditName: () => void;
  onSaveEditName: () => void;
  onCancelEditName: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
        isSelected ? "bg-accent" : "hover:bg-muted"
      )}
      onClick={onSelect}
    >
      {/* Color preview */}
      <div className="flex gap-0.5 shrink-0">
        <div
          className="size-4 rounded-sm border border-black/10"
          style={{ backgroundColor: ds.tokens.heading.color }}
        />
        <div
          className="size-4 rounded-sm border border-black/10"
          style={{ backgroundColor: ds.tokens.button.backgroundColor }}
        />
        <div
          className="size-4 rounded-sm border border-black/10"
          style={{ backgroundColor: ds.tokens.global.backgroundColor }}
        />
      </div>

      {/* Name */}
      {isEditingName ? (
        <div className="flex-1 flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Input
            value={editName}
            onChange={(e) => onEditName(e.target.value)}
            className="h-7 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") onSaveEditName();
              if (e.key === "Escape") onCancelEditName();
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={onSaveEditName}
          >
            <Check className="size-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={onCancelEditName}
          >
            <X className="size-3" />
          </Button>
        </div>
      ) : (
        <span className="flex-1 text-sm font-medium truncate">
          {ds.name}
          {isPreset && (
            <Lock className="inline-block ml-1 size-3 text-muted-foreground" />
          )}
        </span>
      )}

      {/* Actions */}
      <div
        className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        {!isPreset && !isEditingName && (
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={onStartEditName}
          >
            <Pencil className="size-3" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="size-7"
          onClick={onDuplicate}
        >
          <Copy className="size-3" />
        </Button>
        {!isPreset && (
          <Button
            size="icon"
            variant="ghost"
            className="size-7 text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

/** Token editor with accordion sections for each block type */
function TokenEditor({
  tokens,
  onChange,
  disabled,
}: {
  tokens: DesignSystemTokens;
  onChange: (updates: PartialDesignSystemTokens) => void;
  disabled: boolean;
}) {
  return (
    <Accordion
      type="multiple"
      defaultValue={["heading", "button", "global"]}
      className="space-y-2"
    >
      {/* Global */}
      <AccordionItem value="global" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">
          Global Settings
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <ColorInput
            label="Background Color"
            value={tokens.global.backgroundColor}
            onChange={(v) => onChange({ global: { backgroundColor: v } })}
            disabled={disabled}
          />
          <NumberInput
            label="Content Width (px)"
            value={tokens.global.contentWidth}
            onChange={(v) => onChange({ global: { contentWidth: v } })}
            min={400}
            max={800}
            disabled={disabled}
          />
          <FontSelect
            label="Default Font"
            value={tokens.global.fontFamily}
            onChange={(v) => onChange({ global: { fontFamily: v } })}
            disabled={disabled}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Heading */}
      <AccordionItem value="heading" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">
          Headings
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <ColorInput
            label="Color"
            value={tokens.heading.color}
            onChange={(v) => onChange({ heading: { color: v } })}
            disabled={disabled}
          />
          <FontSelect
            label="Font Family"
            value={tokens.heading.fontFamily}
            onChange={(v) => onChange({ heading: { fontFamily: v } })}
            disabled={disabled}
          />
          <WeightSelect
            label="Font Weight"
            value={tokens.heading.fontWeight}
            onChange={(v) => onChange({ heading: { fontWeight: v } })}
            disabled={disabled}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Text */}
      <AccordionItem value="text" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">
          Body Text
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <ColorInput
            label="Color"
            value={tokens.text.color}
            onChange={(v) => onChange({ text: { color: v } })}
            disabled={disabled}
          />
          <FontSelect
            label="Font Family"
            value={tokens.text.fontFamily}
            onChange={(v) => onChange({ text: { fontFamily: v } })}
            disabled={disabled}
          />
          <NumberInput
            label="Font Size (px)"
            value={tokens.text.fontSize}
            onChange={(v) => onChange({ text: { fontSize: v } })}
            min={12}
            max={24}
            disabled={disabled}
          />
          <SliderInput
            label="Line Height"
            value={tokens.text.lineHeight}
            onChange={(v) => onChange({ text: { lineHeight: v } })}
            min={1}
            max={2.5}
            step={0.1}
            disabled={disabled}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Button */}
      <AccordionItem value="button" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">
          Buttons
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <ColorInput
            label="Background Color"
            value={tokens.button.backgroundColor}
            onChange={(v) => onChange({ button: { backgroundColor: v } })}
            disabled={disabled}
          />
          <ColorInput
            label="Text Color"
            value={tokens.button.textColor}
            onChange={(v) => onChange({ button: { textColor: v } })}
            disabled={disabled}
          />
          <NumberInput
            label="Border Radius (px)"
            value={tokens.button.borderRadius}
            onChange={(v) => onChange({ button: { borderRadius: v } })}
            min={0}
            max={50}
            disabled={disabled}
          />
          <FontSelect
            label="Font Family"
            value={tokens.button.fontFamily}
            onChange={(v) => onChange({ button: { fontFamily: v } })}
            disabled={disabled}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Divider */}
      <AccordionItem value="divider" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">
          Dividers
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <ColorInput
            label="Color"
            value={tokens.divider.color}
            onChange={(v) => onChange({ divider: { color: v } })}
            disabled={disabled}
          />
          <NumberInput
            label="Thickness (px)"
            value={tokens.divider.thickness}
            onChange={(v) => onChange({ divider: { thickness: v } })}
            min={1}
            max={10}
            disabled={disabled}
          />
          <div className="space-y-2">
            <Label className="text-sm">Style</Label>
            <Select
              value={tokens.divider.style}
              onValueChange={(v) =>
                onChange({
                  divider: { style: v as "solid" | "dashed" | "dotted" },
                })
              }
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Footer */}
      <AccordionItem value="footer" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">
          Footer
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <ColorInput
            label="Color"
            value={tokens.footer.color}
            onChange={(v) => onChange({ footer: { color: v } })}
            disabled={disabled}
          />
          <FontSelect
            label="Font Family"
            value={tokens.footer.fontFamily}
            onChange={(v) => onChange({ footer: { fontFamily: v } })}
            disabled={disabled}
          />
          <NumberInput
            label="Font Size (px)"
            value={tokens.footer.fontSize}
            onChange={(v) => onChange({ footer: { fontSize: v } })}
            min={10}
            max={18}
            disabled={disabled}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Blockquote */}
      <AccordionItem value="blockquote" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">
          Blockquotes
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <ColorInput
            label="Text Color"
            value={tokens.blockquote.color}
            onChange={(v) => onChange({ blockquote: { color: v } })}
            disabled={disabled}
          />
          <ColorInput
            label="Border Color"
            value={tokens.blockquote.borderColor}
            onChange={(v) => onChange({ blockquote: { borderColor: v } })}
            disabled={disabled}
          />
          <FontSelect
            label="Font Family"
            value={tokens.blockquote.fontFamily}
            onChange={(v) => onChange({ blockquote: { fontFamily: v } })}
            disabled={disabled}
          />
        </AccordionContent>
      </AccordionItem>

      {/* List */}
      <AccordionItem value="list" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">
          Lists
        </AccordionTrigger>
        <AccordionContent className="pb-4 space-y-4">
          <ColorInput
            label="Text Color"
            value={tokens.list.color}
            onChange={(v) => onChange({ list: { color: v } })}
            disabled={disabled}
          />
          <FontSelect
            label="Font Family"
            value={tokens.list.fontFamily}
            onChange={(v) => onChange({ list: { fontFamily: v } })}
            disabled={disabled}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/** Color input with native color picker */
function ColorInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-12 h-9 p-1 cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1 font-mono text-sm"
        />
      </div>
    </div>
  );
}

/** Number input */
function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        disabled={disabled}
      />
    </div>
  );
}

/** Slider input for decimal values */
function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="text-sm text-muted-foreground">
          {value.toFixed(1)}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
    </div>
  );
}

/** Font family select */
function FontSelect({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: EmailFontFamily;
  onChange: (value: EmailFontFamily) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FONT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <span style={{ fontFamily: opt.value }}>{opt.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Font weight select */
function WeightSelect({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: FontWeight;
  onChange: (value: FontWeight) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {WEIGHT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
