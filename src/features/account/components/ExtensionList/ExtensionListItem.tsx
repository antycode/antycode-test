import { memo, useEffect, useState } from 'react';
import { Table } from '@/shared/components/Table/Table';
import cls from './ExtensionList.module.scss';
import { Checkbox } from '@/shared/components/Checkbox/Checkbox';
import { ReactComponent as DefaultIcon } from '@/shared/assets/icons/puzzle-cross.svg';
import { ReactComponent as ExtensionFileIcon } from '@/shared/assets/icons/puzzle.svg';

interface ExtensionListItemProps {
  item: any;
  isSelected: boolean;
  selectRow: (id: string, isSelected: boolean) => void;
}

export const ExtensionListItem = memo(({ item, isSelected, selectRow }: ExtensionListItemProps) => {
  const { external_id, title, logo, is_public } = item;

  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      setImgSrc(logo);
      setImgError(false);
    };

    img.onerror = () => {
      setImgSrc(undefined);
      setImgError(true);
    };
    return () => {
      setImgSrc(undefined);
      setImgError(false);
    };
  }, [logo]);

  return (
    <Table.Row isSelected={isSelected}>
      <Table.Col className={cls.colCheck}>
        <Checkbox
          checked={isSelected}
          onChange={(e) => selectRow(external_id, e.currentTarget.checked)}
        />
      </Table.Col>
      <Table.Col className={cls.colName}>
        {is_public === true ? (
          <div
            className={cls.logo}
            style={{ backgroundImage: imgSrc ? `url(${imgSrc})` : undefined }}>
            {imgError && <DefaultIcon />}
          </div>
        ) : (
          <div className={cls.logo}>
            <ExtensionFileIcon />
          </div>
        )}
        <p>{title}</p>
      </Table.Col>
    </Table.Row>
  );
});
