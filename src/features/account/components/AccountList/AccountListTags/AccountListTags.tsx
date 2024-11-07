import cls from './AccountListTags.module.scss';

interface AccountListTagsProps {
  tags: string[];
}

export const AccountListTags = (props: AccountListTagsProps) => {
  const { tags } = props;

  return (
    <div className={cls.tags}>
      {tags.map((tag, idx) => (
        <div key={idx} className={cls.tag}>
          {tag}
        </div>
      ))}
    </div>
  );
};
