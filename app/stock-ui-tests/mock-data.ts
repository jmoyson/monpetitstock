export type MockProduct = {
  id: string;
  name: string;
  category: string;
  current_stock: number;
  alert_threshold: number;
  unit?: string;
};

export const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Classic Lashes 0.15mm",
    category: "Lashes,Extensions",
    current_stock: 3,
    alert_threshold: 5,
    unit: "trays"
  },
  {
    id: "2",
    name: "Volume Lashes 0.07mm",
    category: "Lashes,Extensions",
    current_stock: 45,
    alert_threshold: 10,
    unit: "trays"
  },
  {
    id: "3",
    name: "Premium Glue",
    category: "Adhesives",
    current_stock: 2,
    alert_threshold: 3,
    unit: "bottles"
  },
  {
    id: "4",
    name: "Curved Tweezers",
    category: "Tools",
    current_stock: 12,
    alert_threshold: 5,
    unit: "pieces"
  },
  {
    id: "5",
    name: "Gel Eye Patches",
    category: "Consumables",
    current_stock: 156,
    alert_threshold: 20,
    unit: "pairs"
  },
  {
    id: "6",
    name: "Lash Primer",
    category: "Preparation",
    current_stock: 7,
    alert_threshold: 5,
    unit: "bottles"
  },
  {
    id: "7",
    name: "Glue Remover",
    category: "Removal",
    current_stock: 0,
    alert_threshold: 3,
    unit: "bottles"
  },
  {
    id: "8",
    name: "Micro Brushes",
    category: "Tools,Consumables",
    current_stock: 234,
    alert_threshold: 50,
    unit: "pieces"
  },
  {
    id: "9",
    name: "Lash Tape",
    category: "Consumables",
    current_stock: 15,
    alert_threshold: 10,
    unit: "rolls"
  },
  {
    id: "10",
    name: "Nano Mister",
    category: "Tools",
    current_stock: 4,
    alert_threshold: 2,
    unit: "pieces"
  }
];
