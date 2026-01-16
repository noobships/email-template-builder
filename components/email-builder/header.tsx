"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Undo2,
  Redo2,
  Eye,
  Download,
  ChevronDown,
  Code,
  Copy,
  FileJson,
  History,
  Plus,
  MoreHorizontal,
  Mail,
  PenLine,
  Laptop,
} from "lucide-react";
import type { EmailDocument } from "@/types/email-builder";
import {
  renderEmailToHtml,
  generateEmailTemplateCode,
} from "@/lib/email-renderer";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface EmailBuilderHeaderProps {
  documentName: string;
  onNameChange: (name: string) => void;
  viewMode: "desktop" | "mobile";
  onViewModeChange: (mode: "desktop" | "mobile") => void;
  simulateMode: "light" | "dark";
  onSimulateModeChange: (mode: "light" | "dark") => void;
  editorMode: "editing" | "viewing";
  onEditorModeChange: (mode: "editing" | "viewing") => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  document: EmailDocument;
  onNewTemplate: () => void;
  onOpenHistory: () => void;
}

// Hoisted static icons to avoid recreation on every render (rendering-hoist-jsx)
const ICONS = {
  undo: <Undo2 className="h-4 w-4" />,
  redo: <Redo2 className="h-4 w-4" />,
  monitor: <Monitor className="h-4 w-4" />,
  smartphone: <Smartphone className="h-4 w-4" />,
  moon: <Moon className="h-4 w-4" />,
  sun: <Sun className="h-4 w-4" />,
  laptop: <Laptop className="h-4 w-4" />,
  moreHorizontal: <MoreHorizontal className="h-4 w-4" />,
  history: <History className="h-4 w-4" />,
  eye: <Eye className="h-4 w-4" />,
  download: <Download className="h-4 w-4" />,
  chevronDown: <ChevronDown className="h-3 w-3" />,
  code: <Code className="h-4 w-4" />,
  copy: <Copy className="h-4 w-4" />,
  fileJson: <FileJson className="h-4 w-4" />,
  plus: <Plus className="h-4 w-4" />,
  mail: <Mail className="h-4 w-4" />,
  penLine: <PenLine className="h-4 w-4" />,
} as const;

export function EmailBuilderHeader({
  documentName,
  onNameChange,
  viewMode,
  onViewModeChange,
  editorMode,
  onEditorModeChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  document,
  onNewTemplate,
  onOpenHistory,
}: EmailBuilderHeaderProps) {
  const { theme, setTheme } = useTheme();

  const handleExportHtml = async () => {
    const html = await renderEmailToHtml(document);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${documentName.replace(/\s+/g, "-").toLowerCase()}.html`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportTemplate = () => {
    const code = generateEmailTemplateCode(document);
    const blob = new Blob([code], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${documentName.replace(/\s+/g, "-").toLowerCase()}.tsx`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = async () => {
    const html = await renderEmailToHtml(document);
    await navigator.clipboard.writeText(html);
  };

  const handleExportJson = () => {
    const json = JSON.stringify(document, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${documentName.replace(/\s+/g, "-").toLowerCase()}.json`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex items-center border-b border-border bg-background px-2 sm:px-4 py-2">
      {/* ═══════════════════════════════════════════════════════════════════
          ZONE 1: DOCUMENT ZONE (Left)
          Document identity and editing tools
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        {/* Sidebar toggle */}
        <SidebarTrigger className="shrink-0" />

        {/* Logo */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
          {ICONS.mail}
        </div>

        {/* Document name */}
        <Input
          value={documentName}
          onChange={(e) => onNameChange(e.target.value)}
          className="h-8 w-20 sm:w-32 lg:w-40 border-none bg-transparent px-2 text-sm font-medium focus-visible:ring-1 min-w-0"
        />

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
          >
            {ICONS.undo}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
          >
            {ICONS.redo}
          </Button>
        </div>
      </div>

      {/* Zone separator */}
      <div className="hidden md:block mx-3 h-6 w-px bg-border" />

      {/* ═══════════════════════════════════════════════════════════════════
          ZONE 2: CANVAS ZONE (Center)
          Preview and canvas controls
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 flex-1 justify-center">
        {/* Device toggle - Desktop/Mobile */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => {
            if (v) onViewModeChange(v as "desktop" | "mobile");
          }}
          variant="outline"
          size="sm"
          className="hidden md:flex"
        >
          <ToggleGroupItem value="desktop" aria-label="Desktop view">
            {ICONS.monitor}
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" aria-label="Mobile view">
            {ICONS.smartphone}
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Editor mode toggle - Edit/View */}
        <ToggleGroup
          type="single"
          value={editorMode}
          onValueChange={(value) => {
            if (value) onEditorModeChange(value as "editing" | "viewing");
          }}
          variant="outline"
          size="sm"
          className="hidden sm:flex"
        >
          <ToggleGroupItem value="editing" aria-label="Editing mode">
            {ICONS.penLine}
          </ToggleGroupItem>
          <ToggleGroupItem value="viewing" aria-label="Viewing mode">
            {ICONS.eye}
          </ToggleGroupItem>
        </ToggleGroup>

        {/* App theme toggle - sun/system/moon */}
        <ToggleGroup
          type="single"
          value={theme ?? "system"}
          onValueChange={(value) => {
            if (value) setTheme(value);
          }}
          variant="outline"
          size="sm"
          className="hidden sm:flex"
        >
          <ToggleGroupItem value="light" aria-label="Light mode">
            {ICONS.sun}
          </ToggleGroupItem>
          <ToggleGroupItem value="system" aria-label="System theme">
            {ICONS.laptop}
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" aria-label="Dark mode">
            {ICONS.moon}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Zone separator */}
      <div className="hidden md:block mx-3 h-6 w-px bg-border" />

      {/* ═══════════════════════════════════════════════════════════════════
          ZONE 3: ACTION ZONE (Right)
          Primary actions - what users came to do
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Mobile overflow menu - consolidates all canvas controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
              {ICONS.moreHorizontal}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onViewModeChange("desktop")}>
              {ICONS.monitor}
              <span className="ml-2">Desktop View</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewModeChange("mobile")}>
              {ICONS.smartphone}
              <span className="ml-2">Mobile View</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                onEditorModeChange(
                  editorMode === "editing" ? "viewing" : "editing"
                )
              }
            >
              {editorMode === "editing" ? ICONS.eye : ICONS.penLine}
              <span className="ml-2">
                {editorMode === "editing" ? "View Mode" : "Edit Mode"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? ICONS.moon : ICONS.sun}
              <span className="ml-2">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenHistory}>
              {ICONS.history}
              <span className="ml-2">History</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* History button - desktop */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 h-8 hidden sm:flex"
          onClick={onOpenHistory}
          title="Template History"
        >
          {ICONS.history}
          <span className="hidden lg:inline">History</span>
        </Button>

        {/* Export dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 h-8">
              {ICONS.download}
              <span className="hidden sm:inline">Export</span>
              <span className="hidden sm:inline">{ICONS.chevronDown}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleExportHtml}>
              {ICONS.download}
              <span className="ml-2">HTML</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportTemplate}>
              {ICONS.code}
              <span className="ml-2">React Template (.tsx)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCopyHtml}>
              {ICONS.copy}
              <span className="ml-2">Copy HTML to Clipboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJson}>
              {ICONS.fileJson}
              <span className="ml-2">JSON (re-import)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Template button - Primary CTA */}
        <Button size="sm" className="gap-1.5 h-8" onClick={onNewTemplate}>
          {ICONS.plus}
          <span className="hidden sm:inline">New Template</span>
        </Button>
      </div>
    </header>
  );
}
