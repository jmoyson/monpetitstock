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
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50/50 px-4 py-3 dark:border-orange-900/50 dark:bg-orange-950/20">
        <Sparkles className="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />
        <div className="flex-1 text-sm">
          <span className="font-medium text-orange-900 dark:text-orange-300">
            {title}
            {limitDisplay && (
              <span className="ml-2 text-orange-700/80 dark:text-orange-400/70">
                · {limitDisplay}
              </span>
            )}
          </span>
          <div className="mt-0.5 text-orange-700/80 dark:text-orange-400/70">
            {description}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8 shrink-0 border-orange-300 hover:bg-orange-100 dark:border-orange-800 dark:hover:bg-orange-900/30"
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
