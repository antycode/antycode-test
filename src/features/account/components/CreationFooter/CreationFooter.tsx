import cls from './CreationFooter.module.scss';
import { ReactComponent as ArrowRight } from '@/shared/assets/icons/arrow-right.svg';
import { ReactComponent as ArrowLeft } from '@/shared/assets/icons/arrow-left.svg';
import { ReactComponent as SuccessArrow } from '@/shared/assets/icons/success-arrow.svg';
import { Button } from '@/shared/components/Button';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Input } from '@/shared/components/Input';

interface ICreationFooter {
    // activeTab: number;
    // setIsActiveTab: (value: number) => void;
    // accCreation?: boolean;
};

export const CreationFooter = () => {

    // const [templateMode, setTemplateMode] = useState(false);
    // const [nameTemplate, setNameTemplate] = useState('');

    const { t } = useTranslation();

    // const handleBack = () => {
    //     if (activeTab > 0) {
    //         setIsActiveTab(activeTab - 1)
    //     }
    // };
    //
    // const handleForward = () => {
    //     if ((activeTab <= 3) && !accCreation) {
    //         setIsActiveTab(activeTab + 1)
    //     } else if ((activeTab <= 1) && accCreation) {
    //         setIsActiveTab(activeTab + 1)
    //     }
    // };
    //
    // const handleSend = () => {
    //
    // };
    //
    // const handleRegister = () => {
    //
    //
    // };
    //
    // const handleSaveTemplate = () => {
    //     setTemplateMode(true);
    // };
    //
    // const handleSaveNameTemplate = () => {
    //     setTemplateMode(false);
    // }
    //
    // const handleChangeNameTemplate = (event: any) => {
    //     setNameTemplate(event.target.value);
    // };

    return (
        <div className={cls.farmCreationFooter}>
            <button className={cls.btnCancel}>
                <p className={cls.btnText}>{t('Cancel')}</p>
            </button>
            <button className={cls.btnRun}>
                <p className={cls.btnText}>{t('Run')}</p>
            </button>

            {/*{!templateMode && <>*/}
            {/*    {(activeTab !== 0) && <div className={cls.wrapperArrow} onClick={handleBack}>*/}
            {/*        <ArrowLeft width={20} height={17} className={cls.arrowLeft} />*/}
            {/*    </div>}*/}
            {/*    {!(activeTab === 0) && <Button*/}
            {/*        onClick={handleSaveTemplate}*/}
            {/*        className={cls.btn}*/}
            {/*        variant="unstyled"*/}
            {/*        type="submit"*/}
            {/*        loaderProps={{*/}
            {/*            size: 24,*/}
            {/*            theme: 'light',*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {t('Save Template')}*/}
            {/*    </Button>}*/}
            {/*    {((accCreation && (activeTab !== 2)) || (!accCreation && (activeTab !== 4)))*/}
            {/*        && <Button*/}
            {/*            onClick={handleForward}*/}
            {/*            className={cls.btn}*/}
            {/*            variant="unstyled"*/}
            {/*            loaderProps={{*/}
            {/*                size: 24,*/}
            {/*                theme: 'light',*/}
            {/*            }}*/}
            {/*            iconRight={<ArrowRight width={20} height={17} />}*/}
            {/*        >*/}
            {/*            {t('Next')}*/}
            {/*        </Button>}*/}
            {/*    {!accCreation && (activeTab === 4) && <Button*/}
            {/*        onClick={handleSend}*/}
            {/*        className={cls.btn}*/}
            {/*        variant="unstyled"*/}
            {/*        loaderProps={{*/}
            {/*            size: 24,*/}
            {/*            theme: 'light',*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {t('Send')}*/}
            {/*    </Button>}*/}
            {/*    {accCreation && (activeTab === 2) && <Button*/}
            {/*        onClick={handleRegister}*/}
            {/*        className={cls.btn}*/}
            {/*        variant="unstyled"*/}
            {/*        loaderProps={{*/}
            {/*            size: 24,*/}
            {/*            theme: 'light',*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {t('Register')}*/}
            {/*    </Button>}*/}
            {/*</>}*/}
            {/*{templateMode && <div className={cls.wrapperNameTemplate}>*/}
            {/*    <Input*/}
            {/*        placeholder={t('Enter template name')}*/}
            {/*        value={nameTemplate || ''}*/}
            {/*        className={cls.input}*/}
            {/*        onChange={(event) => handleChangeNameTemplate(event)}*/}
            {/*    />*/}
            {/*    <Button*/}
            {/*        onClick={handleSaveNameTemplate}*/}
            {/*        className={cls.btnSave}*/}
            {/*        variant="unstyled"*/}
            {/*        loaderProps={{*/}
            {/*            size: 24,*/}
            {/*            theme: 'light',*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <SuccessArrow width={23} height={17} />*/}
            {/*    </Button>*/}
            {/*</div>}*/}
        </div>
    )
};
