import { Drawer } from '@/shared/components/Drawer/Drawer';
import cls from './ProxyDrawer.module.scss';

interface ProxyDrawerProps {
    opened: boolean;
    children?: React.ReactNode;
    headerComponent?: React.ReactNode;
    onClose(): void;
}

export const ProxyDrawer = (props: ProxyDrawerProps) => {
    const { children, opened, onClose, headerComponent } = props;

    return (
        <Drawer.Root opened={opened} onClose={onClose}>
            <Drawer.Header className={cls.proxyHeader}>
                <Drawer.CloseButton />
                {headerComponent}
            </Drawer.Header>
            <div className={cls.proxyMain}>
                <Drawer.Body>
                    {children}
                </Drawer.Body>
            </div>
        </Drawer.Root>
    );
};
