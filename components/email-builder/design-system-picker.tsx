"use client";

import { Paintbrush, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDesignSystem } from "@/lib/design-system-context";
import { PRESET_DESIGN_SYSTEMS } from "@/lib/design-system-presets";
import { cn } from "@/lib/utils";

/**
 * Small color swatch preview for a design system's key colors.
 */
function DesignSystemPreview({
  tokens,
}: {
  tokens: { heading: { color: string }; button: { backgroundColor: string } };
}) {
  return (
    <div className="flex gap-0.5">
      <div
        className="size-3 rounded-sm border border-black/10"
        style={{ backgroundColor: tokens.heading.color }}
      />
      <div
        className="size-3 rounded-sm border border-black/10"
        style={{ backgroundColor: tokens.button.backgroundColor }}
      />
    </div>
  );
}

interface DesignSystemPickerProps {
  /** Callback when "Manage" is clicked to open the manager sheet */
  onManageClick?: () => void;
}

/**
 * Dropdown menu for selecting the active design system.
 * Displays presets and user-created systems with color previews.
 */
export function DesignSystemPicker({ onManageClick }: DesignSystemPickerProps) {
  const {
    designSystems,
    activeDesignSystem,
    activeDesignSystemId,
    setActiveDesignSystemId,
  } = useDesignSystem();

  // Separate presets from user systems
  const presetIds = new Set(PRESET_DESIGN_SYSTEMS.map((p) => p.id));
  const userSystems = designSystems.filter((ds) => !presetIds.has(ds.id));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <Paintbrush className="size-4" />
          <span className="hidden sm:inline">
            {activeDesignSystem?.name ?? "No Design System"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Design Systems</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* None option */}
        <DropdownMenuItem
          onClick={() => setActiveDesignSystemId(null)}
          className="gap-2"
        >
          <div className="size-4 flex items-center justify-center">
            {activeDesignSystemId === null && <Check className="size-3" />}
          </div>
          <span className="text-muted-foreground italic">None (Manual)</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Presets */}
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Presets
        </DropdownMenuLabel>
        {PRESET_DESIGN_SYSTEMS.map((ds) => (
          <DropdownMenuItem
            key={ds.id}
            onClick={() => setActiveDesignSystemId(ds.id)}
            className="gap-2"
          >
            <div className="size-4 flex items-center justify-center">
              {activeDesignSystemId === ds.id && <Check className="size-3" />}
            </div>
            <DesignSystemPreview tokens={ds.tokens} />
            <span className="flex-1">{ds.name}</span>
          </DropdownMenuItem>
        ))}

        {/* User systems */}
        {userSystems.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Your Systems
            </DropdownMenuLabel>
            {userSystems.map((ds) => (
              <DropdownMenuItem
                key={ds.id}
                onClick={() => setActiveDesignSystemId(ds.id)}
                className="gap-2"
              >
                <div className="size-4 flex items-center justify-center">
                  {activeDesignSystemId === ds.id && (
                    <Check className="size-3" />
                  )}
                </div>
                <DesignSystemPreview tokens={ds.tokens} />
                <span className="flex-1">{ds.name}</span>
              </DropdownMenuItem>
            ))}
          </>
        )}

        {/* Manage button */}
        {onManageClick && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onManageClick}
              className={cn("font-medium")}
            >
              Manage Design Systems...
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
