import cls from './ProfileListTags.module.scss';

interface ProfileListTagsProps {
  tags: string[];
}

export const ProfileListTags = (props: ProfileListTagsProps) => {
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
