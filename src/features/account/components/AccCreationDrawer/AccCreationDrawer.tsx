import {Dispatch, SetStateAction, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Drawer} from '@/shared/components/Drawer/Drawer';
import {AccCreationForm} from './AccCreationForm/AccCreationForm';
import cls from './AccCreationDrawer.module.scss';
import {fetchData} from '@/shared/config/fetch';

interface AccCreationDrawerProps {
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>;
}

export const AccCreationDrawer = (props: AccCreationDrawerProps) => {
    const {opened, setOpened} = props;

    const {t} = useTranslation();


    const getAutoreg = async () => {
        const teamId = localStorage.getItem('teamId');

        try {
            fetchData({
                url: '/autoreg/api/form',
                customBaseURL: 'https://autoreg-api.anty-code.com',
                method: 'GET',
                team: teamId,
            })
                .then((data: any) => {
                    if (data.is_success) {
                        console.log(data)

                    } else {
                        console.error('Fetch failed:', data.errors);
                    }
                })
        } catch (error) {
            console.error('Error:', error);
        }

    };

    // const [activeTab, setActiveTab] = useState(AccCreationDrawerTabs.RegistrationMethods);

    const onClose = useCallback(() => setOpened(false), []);

    useEffect(() => {
        getAutoreg()
    }, [])

    return (
        <Drawer.Root opened={opened} onClose={onClose}>
            <Drawer.Header className={cls.autoregHeader}>
                <div className={cls.autoregHeaderTitle}>
                    <p className={cls.autoregHeaderTitleText}>
                        {t('Account details')}
                    </p>
                </div>
                <Drawer.CloseButton/>
            </Drawer.Header>

            <div className={cls.accCreationContent}>
                <div className={cls.farmMain}>
                    <Drawer.Body>
                        <AccCreationForm setIsDrawerOpened={setOpened}/>
                    </Drawer.Body>
                </div>
            </div>
        </Drawer.Root>
    );
};
