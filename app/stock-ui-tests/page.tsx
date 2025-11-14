"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from "lucide-react";

const concepts = [
  { id: 1, name: "Cartes Actuelles (Baseline)", description: "Design mobile existant en cartes", category: "Cartes" },
  { id: 2, name: "Liste Compacte", description: "Liste dense avec actions intégrées", category: "Liste" },
  { id: 3, name: "Liste Accordéon", description: "Éléments extensibles avec détails", category: "Liste" },
  { id: 4, name: "Actions en Feuille", description: "Appui pour ouvrir le panneau d'actions", category: "Panneau" },
  { id: 5, name: "Contrôle Intégré", description: "Boutons +/- directs dans la liste", category: "Liste" },
  { id: 6, name: "Tiroir d'Actions", description: "Interface glissante interactive", category: "Tiroir" },
  { id: 7, name: "Vue Grille", description: "Grille compacte de produits", category: "Grille" },
  { id: 8, name: "Groupé par Statut", description: "Organisé par niveau de stock", category: "Liste" },
  { id: 9, name: "Recherche Prioritaire", description: "Grande barre de recherche avec actions rapides", category: "Recherche" },
  { id: 10, name: "Dialogue d'Actions", description: "Dialogue plein écran pour actions", category: "Dialogue" },
  { id: 11, name: "Vue Divisée", description: "Disposition sur deux colonnes", category: "Liste" },
  { id: 12, name: "Cartes Minimalistes", description: "Design ultra-épuré et moderne", category: "Cartes" },
  { id: 13, name: "Sélection Multiple", description: "Multi-sélection avec actions groupées", category: "Lot" },
  { id: 14, name: "Palette de Commandes", description: "Interface pilotée au clavier", category: "Commande" },
  { id: 15, name: "Défilement Horizontal", description: "Cartes produits à faire glisser", category: "Cartes" },
  { id: 16, name: "Menu Contextuel", description: "Interactions par appui long", category: "Contexte" },
  { id: 17, name: "Barre d'Entrée Rapide", description: "Sélecteur de produit en haut", category: "Rapide" },
  { id: 18, name: "Contrôles Segmentés", description: "Basculer entre les vues", category: "Basculement" },
  { id: 19, name: "Ajout Rapide Flottant", description: "Bouton flottant avec sélecteur", category: "FAB" },
  { id: 20, name: "Priorité Intelligente", description: "Trié par IA selon l'importance", category: "IA" }
];

export default function StockUITestsIndex() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConcepts = concepts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Concepts UI/UX Stock
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              20 concepts d'interfaces professionnelles pour la gestion de stock
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="outline" className="text-xs">
                Responsive
              </Badge>
              <Badge variant="outline" className="text-xs">
                Mobile-First
              </Badge>
              <Badge variant="outline" className="text-xs">
                shadcn/ui
              </Badge>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-8 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un concept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11"
            />
          </div>

          {/* Concepts Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredConcepts.map((concept) => (
              <Link key={concept.id} href={`/stock-ui-tests/concept-${concept.id}`}>
                <Card className="hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 cursor-pointer h-full group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline" className="shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        #{concept.id}
                      </Badge>
                      <Badge variant="secondary" className="shrink-0">
                        {concept.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{concept.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{concept.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {filteredConcepts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun concept trouvé pour "{searchQuery}"</p>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-10 p-5 rounded-lg border bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">💡 Astuce :</strong> Tous les concepts utilisent les composants shadcn/ui et incluent un sélecteur de vue responsive (Mobile · Tablette · Bureau).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
