import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { BagItem, BagContextType } from '../types/bag';

const BagContext = createContext<BagContextType | undefined>(undefined);

const STORAGE_KEY = 'azure-preview-bag';
const MAX_BAG_ITEMS = 20;

export const BagProvider: React.FC<{ children: React.ReactNode; storageKey?: string }> = ({
  children,
  storageKey = STORAGE_KEY,
}) => {
  const [items, setItems] = useState<BagItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(
              (item): item is BagItem =>
                Boolean(item) &&
                typeof item === 'object' &&
                typeof item.id === 'string' &&
                typeof item.model === 'string' &&
                typeof item.name === 'string' &&
                typeof item.finish === 'string' &&
                typeof item.price === 'number' &&
                Number.isFinite(item.price) &&
                item.price >= 0 &&
                typeof item.image === 'string' &&
                (typeof item.storage === 'string' || item.storage === undefined),
            )
            .slice(0, MAX_BAG_ITEMS);
        }
      }
    } catch (e) {
      console.warn('Failed to load bag from localStorage', e);
    }
    return [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save bag to localStorage', e);
    }
  }, [items, storageKey]);

  const addItem = useCallback((itemData: Omit<BagItem, 'id'>) => {
    setItems((prev) => {
      if (prev.length >= MAX_BAG_ITEMS) return prev;
      const safePrice =
        typeof itemData.price === 'number' && Number.isFinite(itemData.price) && itemData.price >= 0
          ? Math.round(itemData.price)
          : 0;
      const newItem: BagItem = {
        ...itemData,
        price: safePrice,
        id: `${itemData.model}-${itemData.finish}-${itemData.storage || 'std'}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };
      return [newItem, ...prev];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => Boolean(item) && item.id !== id));
  }, []);

  const clearBag = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.length;

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      const price =
        typeof item?.price === 'number' && Number.isFinite(item.price) && item.price >= 0
          ? item.price
          : 0;
      return sum + price;
    }, 0);
  }, [items, storageKey]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearBag,
      totalPrice,
      itemCount,
      isDrawerOpen,
      setIsDrawerOpen,
    }),
    [items, addItem, removeItem, clearBag, totalPrice, itemCount, isDrawerOpen],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
};

export const useBag = (): BagContextType => {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
};
