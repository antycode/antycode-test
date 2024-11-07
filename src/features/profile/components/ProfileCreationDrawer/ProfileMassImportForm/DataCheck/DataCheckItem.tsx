import React from 'react';
import {Table} from "@/shared/components/Table/Table";
import cls from "./DataCheck.module.scss";
import {ReactComponent as SuccessArrowIcon} from "@/shared/assets/icons/success-arrow.svg";
import clsx from "clsx";

interface DataCheckItemProps {
    item: {[key: string]: any}
}

export const DataCheckItem = (props: DataCheckItemProps) => {
    const {item} = props;
    return (
        <Table.Row>
            <Table.Col className={item.title ? cls.colName : cls.colNameChild}>
                <div className={cls.nameContainer}>
                    {item.title
                        ? <p className={cls.nameContainerText}>{item.title}</p>
                        : <Table.EmptyCol/>
                    }
                </div>
            </Table.Col>
            <Table.Col className={cls.colCookieChild}>
                <div className={cls.nameContainer}>
                    {item.cookies
                        ? <SuccessArrowIcon width={13} height={13} />
                        : <Table.EmptyCol/>
                    }
                </div>
            </Table.Col>
            <Table.Col className={item.proxy && item.proxy.type ? cls.colProxyType : cls.colProxyTypeChild}>
                <div className={cls.nameContainer}>
                    {item.proxy && item.proxy.type
                        ? <p className={cls.nameContainerText}>{item.proxy.type}</p>
                        : <Table.EmptyCol/>
                    }
                </div>
            </Table.Col>
            <Table.Col className={item.proxy && item.proxy.host && item.proxy.port && item.proxy.login && item.proxy.password ? cls.colProxy : cls.colProxyChild}>
                <div className={cls.nameContainer}>
                    {item.proxy && item.proxy.host && item.proxy.port && item.proxy.login && item.proxy.password
                        ? <p className={cls.nameContainerText}>{item.proxy.login}:{item.proxy.password}@{item.proxy.host}:{item.proxy.port}</p>
                        : <Table.EmptyCol/>
                    }
                </div>
            </Table.Col>
            <Table.Col className={item.userAgent ? cls.colUseragent : cls.colUseragentChild}>
                <div className={cls.nameContainer}>
                    {item.userAgent
                        ? <p className={cls.nameContainerText}>{item.userAgent}</p>
                        : <Table.EmptyCol/>
                    }
                </div>
            </Table.Col>
            <Table.Col className={cls.colNote}>
                <div className={cls.nameContainer}>
                    {item.note
                        ? <SuccessArrowIcon width={13} height={13} />
                        : <Table.EmptyCol/>
                    }
                </div>
            </Table.Col>
        </Table.Row>
    );
};