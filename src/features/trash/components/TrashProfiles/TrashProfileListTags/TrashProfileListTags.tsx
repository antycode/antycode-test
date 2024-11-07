import cls from './TrashProfileListTags.module.scss';

interface TrashProfileListTagsProps {
  tags: string[];
}

export const TrashProfileListTags = (props: TrashProfileListTagsProps) => {
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
