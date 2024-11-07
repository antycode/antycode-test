import React, {Dispatch, SetStateAction} from 'react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormProvider, useForm} from 'react-hook-form';
import cls from './ProfileImportExportCookiesForm.module.scss';
import {
    ProfileImportCookiesMainPart
} from './ProfileImportCookiesMainPart/ProfileImportCookiesMainPart';
import {fetchData} from "@/shared/config/fetch";

const validationSchema = z.object({
    cookies: z.string().max(2000000).or(z.null()),
});

export type TProfileImportCookiesForm = z.TypeOf<typeof validationSchema>;

interface ProfileImportCookiesFormProps {
    setIsDrawerOpened: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRows: Set<string>;
}

export const ProfileImportCookiesForm = (props: ProfileImportCookiesFormProps) => {
    const {setIsDrawerOpened, selectedRows} = props;

    const formMethods = useForm<TProfileImportCookiesForm>({
        resolver: zodResolver(validationSchema),
    });

    const {
        handleSubmit,
    } = formMethods;

    const onSubmit = async (data: TProfileImportCookiesForm) => {
        if (selectedRows.size == 0) {
            console.log('No profile is selected');
            return
        }
        const [firstSelectedExternalID] = selectedRows;
        const dataSubmit = {
          cookies:data.cookies
        }
        const teamId = localStorage.getItem('teamId');
        fetchData({
            url: `/profile/${firstSelectedExternalID}`,
            method: 'PATCH',
            data: {...dataSubmit},
            team: teamId
        }).catch((err: Error) => {
            console.log(err);
        })
        setIsDrawerOpened(false);
    };

    return (
        <FormProvider {...formMethods}>
            <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={cls.formPages}>
                    <ProfileImportCookiesMainPart/>
                </div>
            </form>
        </FormProvider>
    );
};
