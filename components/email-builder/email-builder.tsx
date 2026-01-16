"use client";

import { useState, useCallback, useEffect } from "react";
import { EmailBuilderHeader } from "./header";
import { BlockPickerToolbar } from "./block-picker-toolbar";
import { EmailCanvas } from "./email-canvas";
import { PropertiesPopover } from "./properties-popover";
import { TemplateHistory } from "./template-history";
import type {
  EmailBlock,
  EmailDocument,
  BlockType,
} from "@/types/email-builder";
import { createBlock } from "@/lib/email-builder-utils";
import { DesignSystemProvider } from "@/lib/design-system-context";
import {
  TemplateStorageProvider,
  useTemplateStorage,
} from "@/lib/template-storage-context";
import { DesignSystemManager } from "./design-system-manager";

const initialDocument: EmailDocument = {
  name: "Untitled Email",
  blocks: [],
  settings: {
    backgroundColor: "#f3f4f6",
    contentWidth: 600,
  },
};

/**
 * Inner component that uses template storage context.
 */
function EmailBuilderInner() {
  const [document, setDocument] = useState<EmailDocument>(initialDocument);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [simulateMode, setSimulateMode] = useState<"light" | "dark">("light");
  const [editorMode, setEditorMode] = useState<"editing" | "viewing">(
    "editing"
  );
  const [history, setHistory] = useState<EmailDocument[]>([initialDocument]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);
  const [designSystemManagerOpen, setDesignSystemManagerOpen] = useState(false);

  const { saveTemplate, createNewTemplate, templates } = useTemplateStorage();

  // Auto-load most recent template on mount
  useEffect(() => {
    if (templates.length > 0) {
      const mostRecent = templates.reduce((a, b) =>
        a.updatedAt > b.updatedAt ? a : b
      );
      setDocument(mostRecent.document);
    }
  }, []); // Only run on mount

  // Auto-save document (debounced)
  useEffect(() => {
    if (document.blocks.length === 0 && document.name === "Untitled Email") {
      return; // Don't save empty initial documents
    }
    const timeoutId = setTimeout(() => {
      saveTemplate(document);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [document, saveTemplate]);

  const selectedBlock =
    document.blocks.find((b) => b.id === selectedBlockId) || null;

  const pushHistory = useCallback(
    (newDoc: EmailDocument) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, newDoc];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleAddBlock = useCallback(
    (type: BlockType) => {
      const newBlock = createBlock(type);
      const newDoc = {
        ...document,
        blocks: [...document.blocks, newBlock],
      };
      setDocument(newDoc);
      pushHistory(newDoc);
      setSelectedBlockId(newBlock.id);
    },
    [document, pushHistory]
  );

  const handleUpdateBlock = useCallback(
    (blockId: string, updates: Partial<EmailBlock>) => {
      const newDoc = {
        ...document,
        blocks: document.blocks.map((block) =>
          block.id === blockId ? { ...block, ...updates } : block
        ) as EmailBlock[],
      };
      setDocument(newDoc);
      // Don't push history on every keystroke for performance
    },
    [document]
  );

  const handleUpdateBlockWithHistory = useCallback(
    (blockId: string, updates: Partial<EmailBlock>) => {
      const newDoc = {
        ...document,
        blocks: document.blocks.map((block) =>
          block.id === blockId ? { ...block, ...updates } : block
        ) as EmailBlock[],
      };
      setDocument(newDoc);
      pushHistory(newDoc);
    },
    [document, pushHistory]
  );

  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      const newDoc = {
        ...document,
        blocks: document.blocks.filter((b) => b.id !== blockId),
      };
      setDocument(newDoc);
      pushHistory(newDoc);
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }
    },
    [document, pushHistory, selectedBlockId]
  );

  const handleMoveBlock = useCallback(
    (blockId: string, direction: "up" | "down") => {
      const index = document.blocks.findIndex((b) => b.id === blockId);
      if (index === -1) return;
      if (direction === "up" && index === 0) return;
      if (direction === "down" && index === document.blocks.length - 1) return;

      const newBlocks = [...document.blocks];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newBlocks[index], newBlocks[targetIndex]] = [
        newBlocks[targetIndex],
        newBlocks[index],
      ];

      const newDoc = { ...document, blocks: newBlocks };
      setDocument(newDoc);
      pushHistory(newDoc);
    },
    [document, pushHistory]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDocument(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDocument(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const handleNameChange = useCallback(
    (name: string) => {
      const newDoc = { ...document, name };
      setDocument(newDoc);
    },
    [document]
  );

  const handleCloseProperties = useCallback(() => {
    setSelectedBlockId(null);
  }, []);

  const handleNewTemplate = useCallback(() => {
    createNewTemplate();
    setDocument(initialDocument);
    setHistory([initialDocument]);
    setHistoryIndex(0);
    setSelectedBlockId(null);
  }, [createNewTemplate]);

  const handleLoadTemplate = useCallback((doc: EmailDocument) => {
    setDocument(doc);
    setHistory([doc]);
    setHistoryIndex(0);
    setSelectedBlockId(null);
  }, []);

  return (
    <DesignSystemProvider>
      <div className="flex h-screen flex-col bg-background">
        {/* Header with document name, view controls, export */}
        <EmailBuilderHeader
          documentName={document.name}
          onNameChange={handleNameChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          simulateMode={simulateMode}
          onSimulateModeChange={setSimulateMode}
          editorMode={editorMode}
          onEditorModeChange={setEditorMode}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          document={document}
          onNewTemplate={handleNewTemplate}
          onOpenHistory={() => setHistoryPanelOpen(true)}
        />

        {/* Block picker toolbar - only in editing mode */}
        {editorMode === "editing" && (
          <BlockPickerToolbar
            onAddBlock={handleAddBlock}
            onManageDesignSystemClick={() => setDesignSystemManagerOpen(true)}
          />
        )}

        {/* Main canvas area */}
        <div className="flex flex-1 overflow-hidden">
          <EmailCanvas
            document={document}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onDeleteBlock={handleDeleteBlock}
            onMoveBlock={handleMoveBlock}
            onUpdateBlock={handleUpdateBlock}
            viewMode={viewMode}
            simulateMode={simulateMode}
          />

          {/* Floating properties popover - only in editing mode */}
          {editorMode === "editing" && (
            <PropertiesPopover
              selectedBlock={selectedBlock}
              onUpdateBlock={handleUpdateBlockWithHistory}
              onClose={handleCloseProperties}
              onDelete={
                selectedBlockId
                  ? () => handleDeleteBlock(selectedBlockId)
                  : undefined
              }
            />
          )}
        </div>

        {/* Template History Sheet */}
        <TemplateHistory
          open={historyPanelOpen}
          onOpenChange={setHistoryPanelOpen}
          onLoadTemplate={handleLoadTemplate}
        />

        {/* Design System Manager Sheet */}
        <DesignSystemManager
          open={designSystemManagerOpen}
          onOpenChange={setDesignSystemManagerOpen}
        />
      </div>
    </DesignSystemProvider>
  );
}

/**
 * Email Builder with providers.
 */
export function EmailBuilder() {
  return (
    <TemplateStorageProvider>
      <EmailBuilderInner />
    </TemplateStorageProvider>
  );
}
