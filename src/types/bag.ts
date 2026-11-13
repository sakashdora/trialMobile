export interface BagItem {
  id: string;
  model: string;
  name: string;
  finish: string;
  storage?: string;
  price: number;
  image: string;
}

export interface BagContextType {
  items: BagItem[];
  addItem: (item: Omit<BagItem, 'id'>) => void;
  removeItem: (id: string) => void;
  clearBag: () => void;
  totalPrice: number;
  itemCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}
