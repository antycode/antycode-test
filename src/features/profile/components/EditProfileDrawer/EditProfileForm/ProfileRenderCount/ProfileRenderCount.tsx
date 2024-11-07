import cls from '../EditProfileForm.module.scss';
import clsx from 'clsx';

export const RenderCountComponent = ({ field, label, id }: {
    field: any, label: string,
    id: string
}) => {
    return (
        <div className={cls.wrapperRound}
            onClick={() => field.onChange(field.value = id)}>
            <div className={clsx(cls.round,
                { [cls.roundActive]: field.value === id })} />
            <div className={clsx(cls.roundText,
                { [cls.roundTextActive]: field.value === id })}>{label}</div>
        </div>
    )
};