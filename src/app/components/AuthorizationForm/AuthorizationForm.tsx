import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ModalDialog} from '@/shared/components/ModalDialog';
import {LoginForm} from '@/app/components/LoginForm';
import {updateFetchConfig} from '@/shared/config/fetch/config';
import cls from './AuthorizationForm.module.scss';
import { ReactComponent as AntyCodeIcon } from '@/shared/assets/icons/anty-code.svg';
import {RegisterForm} from "@/app/components/RegisterForm/RegisterForm";
import {ForgotPasswordForm} from "@/app/components/ForgotPasswordForm/ForgotPasswordForm";
import {useSelector} from "react-redux";

export enum FormNames {
    login_form = 'LoginForm',
    register_form = 'RegisterForm',
    forgot_password_form = 'ForgotPasswordForm',
    not_displayed = 'not_displayed',
}
export type HandleDialogParamsProps = {newUserToken?:string, formToDisplay:FormNames}

type AuthorizationFormProps = {
    handleRefetch: () => void;
};

export const AuthorizationForm: React.FC<AuthorizationFormProps> = ({
       handleRefetch
    }) => {
    const {t} = useTranslation();
    const token = useSelector((state: any) => state.authReducer.token);
    const initialForm = token ? FormNames.not_displayed : FormNames.login_form;

    // const [initialForm, setInitialForm] = useState<string>(localStorage.getItem('token') ? FormNames.not_displayed : FormNames.login_form);

    const [currentFormName, setCurrentFormName] = useState<string>(initialForm);
    const confirm = currentFormName !== null;

    const handleOpenModal  = () => {
        !confirm && setCurrentFormName(FormNames.not_displayed);
    };

    const handleDialog  = (data?:HandleDialogParamsProps) => {
        if(data && data.formToDisplay) {
            setCurrentFormName(data.formToDisplay);
        }
        if(data && data.newUserToken){
            updateFetchConfig({antiCustomerToken:data.newUserToken})
            handleRefetch()
        }
    };

    // Define a mapping between form names and components
    const formComponents: { [key: string]: JSX.Element } = {
        [FormNames.login_form]: <LoginForm handleDialog={handleDialog} setCurrentFormName={setCurrentFormName} currentFormName={currentFormName}/>,
        [FormNames.register_form]: <RegisterForm handleDialog={handleDialog} setCurrentFormName={setCurrentFormName} currentFormName={currentFormName }/>,
        [FormNames.forgot_password_form]: <ForgotPasswordForm handleDialog={handleDialog} setCurrentFormName={setCurrentFormName} currentFormName={currentFormName} />
    };

    // const getFormComponent =():React.ReactNode | null =>{
    //     switch (currentFormName) {
    //         case FormNames.login_form:
    //             return <LoginForm handleDialog={handleDialog}/>;
    //             break;
    //         default:
    //             return  null
    //             break;
    //     }
    // }

    // let componentToRender = getFormComponent()

    const componentToRender = formComponents[currentFormName];
    if(!componentToRender){
        return null;
    }

    return (
        <div>
            <ModalDialog
                className={cls.customAuthorizationWrapper}
                isOpen={confirm}
                onRequestClose={handleOpenModal}>
                <div className={cls.modalDialogChildrenWrapper}>
                    <div className={cls.logo}>
                        <AntyCodeIcon />
                        <p className={cls.logoTitle}>Anty-code V1.0.8</p>
                    </div>
                    {componentToRender as JSX.Element}
                </div>
            </ModalDialog>
        </div>
    );
};
