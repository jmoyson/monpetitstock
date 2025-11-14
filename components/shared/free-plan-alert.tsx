"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "./upgrade-modal";

type FreePlanAlertProps = {
  /**
   * Main title of the alert
   */
  title: string;

  /**
   * Description message
   */
  description: string;

  /**
   * Optional limit value to display (e.g., "10 products", "30 days")
   */
  limitDisplay?: string;

  /**
   * Whether the user has a Pro plan (hides the alert if true)
   */
  isPro?: boolean;
};

export function FreePlanAlert({
  title,
  description,
  limitDisplay,
  isPro = false,
}: FreePlanAlertProps) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Don't show the alert if user has Pro plan
  if (isPro) {
    return null;
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-status-warning-border bg-status-warning px-4 py-3">
        <Sparkles className="h-4 w-4 shrink-0 text-status-warning-foreground" />
        <div className="flex-1 text-sm">
          <span className="font-medium text-status-warning-foreground">
            {title}
            {limitDisplay && (
              <span className="ml-2 opacity-80">
                · {limitDisplay}
              </span>
            )}
          </span>
          <div className="mt-0.5 opacity-80">
            {description}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8 shrink-0 border-status-warning-foreground/30 hover:bg-status-warning-foreground/10"
          onClick={() => setUpgradeModalOpen(true)}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Premium - 9,99€/an
        </Button>
      </div>

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      />
    </>
  );
}
