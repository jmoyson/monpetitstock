"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type UpgradeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const handleUpgrade = () => {
    alert("La fonctionnalité de mise à niveau sera bientôt disponible !");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Passez à la version Premium
          </DialogTitle>
          <DialogDescription>
            Débloquez des fonctionnalités illimitées pour votre inventaire
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-4">Plan Premium</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-sm">
                  Produits illimités (actuellement limité à 10)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm">
                  Historique complet des activités
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm">
                  Alertes par email personnalisées
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm">Export des données en CSV</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm">
                  Analyses et statistiques avancées
                </span>
              </li>
            </ul>
            <div className="text-center">
              <p className="text-3xl font-bold mb-2">
                9,99€
                <span className="text-lg font-normal text-muted-foreground">
                  /an
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Soit moins de 1€ par mois
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Plus tard
          </Button>
          <Button onClick={handleUpgrade}>
            <Sparkles className="h-4 w-4 mr-2" />
            Passer à Premium
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
