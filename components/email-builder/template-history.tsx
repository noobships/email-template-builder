"use client";

import { formatDistanceToNow } from "date-fns";
import { Trash2, FileText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useTemplateStorage,
  type SavedTemplate,
} from "@/lib/template-storage-context";
import type { EmailDocument } from "@/types/email-builder";
import { cn } from "@/lib/utils";

// Hoisted static icons (rendering-hoist-jsx from vercel-react-best-practices)
const ICONS = {
  fileText: <FileText className="h-5 w-5 text-muted-foreground" />,
  trash: <Trash2 className="h-4 w-4" />,
} as const;

interface TemplateHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadTemplate: (doc: EmailDocument) => void;
}

/**
 * Sheet panel displaying saved templates history.
 * Allows loading and deleting templates.
 */
export function TemplateHistory({
  open,
  onOpenChange,
  onLoadTemplate,
}: TemplateHistoryProps) {
  const { templates, loadTemplate, deleteTemplate, currentTemplateId } =
    useTemplateStorage();

  // Sort by most recently updated
  const sortedTemplates = [...templates].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  const handleLoad = (id: string) => {
    const doc = loadTemplate(id);
    if (doc) {
      onLoadTemplate(doc);
      onOpenChange(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteTemplate(id);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b shrink-0">
          <SheetTitle>Template History</SheetTitle>
          <SheetDescription>
            Your saved email templates. Click to load.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {sortedTemplates.length === 0 ? (
              <EmptyState />
            ) : (
              sortedTemplates.map((template) => (
                <TemplateListItem
                  key={template.id}
                  template={template}
                  isActive={template.id === currentTemplateId}
                  onLoad={() => handleLoad(template.id)}
                  onDelete={(e) => handleDelete(e, template.id)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Empty state for when no templates are saved.
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {ICONS.fileText}
      <h3 className="mt-4 text-sm font-medium">No templates yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Your email templates will appear here once saved.
      </p>
    </div>
  );
}

/**
 * Single template list item with load and delete actions.
 */
function TemplateListItem({
  template,
  isActive,
  onLoad,
  onDelete,
}: {
  template: SavedTemplate;
  isActive: boolean;
  onLoad: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const blockCount = template.document.blocks.length;
  const timeAgo = formatDistanceToNow(new Date(template.updatedAt), {
    addSuffix: true,
  });

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group",
        isActive ? "bg-accent" : "hover:bg-muted"
      )}
      onClick={onLoad}
    >
      {/* Preview swatch */}
      <div className="flex gap-0.5 shrink-0">
        <div className="size-4 rounded-sm bg-primary/20" />
        <div className="size-4 rounded-sm bg-primary/40" />
        <div className="size-4 rounded-sm bg-primary/60" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{template.name}</p>
        <p className="text-xs text-muted-foreground">
          {blockCount} block{blockCount !== 1 ? "s" : ""} · {timeAgo}
        </p>
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
        onClick={onDelete}
      >
        {ICONS.trash}
      </Button>
    </div>
  );
}
