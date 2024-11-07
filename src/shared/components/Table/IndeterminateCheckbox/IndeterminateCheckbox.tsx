import { useMemo } from 'react';
import { Checkbox } from '@/shared/components/Checkbox/Checkbox';

interface IndeterminateCheckboxProps {
  pageItems: any[];
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const IndeterminateCheckbox = (props: IndeterminateCheckboxProps) => {
  const { pageItems, selectedRows, setSelectedRows } = props;

  const isChecked = useMemo(
    () => pageItems.length > 0 && pageItems.every((item) => selectedRows.has(item?.external_id || item?.id)),
    [selectedRows, pageItems]
  );

  const isIndeterminate = useMemo(
    () => pageItems.some((item) => selectedRows.has(item?.external_id || item?.id)),
    [selectedRows, pageItems]
  );

  const handleChange = () => {
    const newSelected = new Set(selectedRows);

    isChecked
      ? pageItems.forEach((item) => newSelected.delete(item?.external_id || item?.id))
      : pageItems.forEach((item) => newSelected.add(item?.external_id || item?.id));

    setSelectedRows(newSelected);
  };

  return (
    <Checkbox
      checked={isChecked}
      indeterminate={isIndeterminate}
      onChange={handleChange}
    />
  );
};
