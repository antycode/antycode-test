import { useCallback, useState } from 'react';

export function useRowSelection() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(() => new Set());

  const selectRow = useCallback((id: string, isSelected: boolean) => {
    setSelectedRows((prevSelected) => {
      const newSet = new Set(prevSelected);
      isSelected ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  }, []);

  return {
    selectedRows,
    selectRow,
    setSelectedRows,
  };
}
