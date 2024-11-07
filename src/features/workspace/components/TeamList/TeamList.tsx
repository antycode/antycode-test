import {useTranslation} from 'react-i18next';
import {Table} from '@/shared/components/Table/Table';
import {Pagination} from '@/shared/components/Pagination/Pagination';
import {PageCounter} from '@/shared/components/PageCounter/PageCounter';
import {ReactComponent as ArrowIcon} from '@/shared/assets/icons/arrow.svg';
import {TeamListItem} from './TeamListItem';
import {ReactComponent as SearchIcon} from '@/shared/assets/icons/search.svg';
import cls from './TeamList.module.scss';
import tableCls from '@/shared/components/Table/Table.module.scss';
import {useFilterUsers} from '@/shared/hooks';
import {ReactComponent as ArrowUpIcon} from '@/shared/assets/icons/arrow-up.svg';
import {ReactComponent as ArrowDownIcon} from '@/shared/assets/icons/arrow-down.svg';
import {ReactComponent as GreedRedCircle} from '@/shared/assets/icons/green-red-circle.svg';
import {ReactComponent as GreedCircle} from '@/shared/assets/icons/green_circle.svg';
import {ReactComponent as RedCircle} from '@/shared/assets/icons/red_circle.svg';
import clsx from "clsx";
import {User} from "@/features/profile/types";
import {useWorkspacesStore} from "@/features/workspace/store";
import {fetchData} from "@/shared/config/fetch";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {setToken} from "@/store/reducers/AuthReducer";
import {useDispatch} from "react-redux";


const itemsPerPageOptions = [{value: 30}, {value: 60}];

interface TeamListProp {
    activePages: [number, ...number[]],
    setActivePages: React.Dispatch<React.SetStateAction<[number, ...number[]]>>,
    selectedRows: Set<string>,
    selectRow: (id: string, isSelected: boolean) => void,
    setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>,
    filteredUsers: any[],
    setFilteredUsers: Dispatch<SetStateAction<any[]>>
    page: number,
    setPage: Dispatch<SetStateAction<number>>
}

export const TeamList = (props: TeamListProp) => {
    const {
        activePages,
        setActivePages,
        selectedRows,
        selectRow,
        setSelectedRows,
        filteredUsers,
        setFilteredUsers,
        page,
        setPage
    } = props;
    const {t} = useTranslation();
    const {
        isLoading,
        perPageCountTeam,
        setCurrentPageTeam,
        setPerPageCountTeam,
        teamCustomers,
        currentPageTeam,
        allFilteredCustomers,
        setTeamCustomers,
        myTeams,
        setCustomerData,
        setMyTeams
    } = useWorkspacesStore();

    const dispatch = useDispatch();

    const [useSort, setUseSort] = useState<boolean>(false);

    const itemsPerPage = 30;

    // useEffect(() => {
    //     const startIndex = (page - 1) * itemsPerPage;
    //     const newUsers = filteredUsers.slice(0, startIndex + itemsPerPage);
    //     setVisibleUsers(newUsers);
    // }, [page, filteredUsers]);

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handleChangeSort = () => {
        setUseSort(prev => !prev);
        if (filteredUsers?.length > 0) {
            setFilteredUsers(filteredUsers.reverse());
        } else {
            setFilteredUsers(filteredUsers.reverse());
        }
    };

    const fetchCustomerData = () => {
        const teamId = localStorage.getItem('teamId');
        fetchData({url: `/customer`, method: 'GET', team: teamId}).then((data: any) => {
            console.log('customer data', data)
            if (data.is_success) {
                if (data.data) {
                    setCustomerData(data?.data);
                }
            }
        }).catch((err: Error) => {
            console.log('/customer get error: ', err);
        })
    };

    const fetchTeamCustomers = () => {
        const teamId = localStorage.getItem('teamId');
        fetchData({url: '/team/customers', method: 'GET', team: teamId}).then((data: any) => {
            console.log('customers', data);
            if (data.is_success) {
                setTeamCustomers(data?.data);
                setFilteredUsers(data?.data);
            }
        }).catch((err) => {
            console.log('Tariff', err);
        });
    };

    const fetchMyTeams = async () => {
        try {
            const response = await fetchData({url: '/team/my-teams', method: 'GET'});
            if (response.errorCode === 7 && response.errorMessage && response.errorMessage.includes('not found')) {
                return dispatch(setToken(''));
            }
            if (response.is_success) {
                setMyTeams(response.data);
                const localTeamId = localStorage.getItem('teamId');
                const teamFromList = response.data.find((i: any) => i.external_id === localTeamId);
                if (teamFromList) {
                    return teamFromList.external_id;
                }
                localStorage.setItem('teamId', response.data[0].external_id);
                return response.data;
            } else {
                return { is_success: false };
            }
        } catch (error) {
            console.error('Error fetching my teams:', error);
            return { is_success: false };
        }
    };

    const handleRefetch = () => {
        fetchMyTeams().then(() => {
            fetchCustomerData();
            fetchTeamCustomers();
        });
    };

    useEffect(() => {
        handleRefetch();
    }, []);

    return (
        <>
            <Table>
                <Table.Header>
                    <Table.Col className={clsx(cls.colCheck, cls.colHeader)}>
                        <Table.IndeterminateCheckbox
                            pageItems={filteredUsers}
                            selectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
                        />
                    </Table.Col>
                    <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colUsers, cls.colHeader)}>
                        {t('Nickname')}
                    </Table.Col>
                    <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colRole, cls.colHeader)}>
                        {t('Role')}
                    </Table.Col>
                    <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colProfiles, cls.colHeader)}>
                        {t('Profiles')}
                    </Table.Col>
                    <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colProxies, cls.colHeader)}>
                        {t('Proxies')}
                    </Table.Col>
                    <Table.Col className={clsx(cls.colDate, cls.colHeader)}>
                        <div className={cls.searchWrapper}>
                            {getDateTitle(filteredUsers)}
                            {!useSort && <ArrowDownIcon className={cls.filterSortIcon} onClick={handleChangeSort} />}
                            {useSort && <ArrowUpIcon className={cls.filterSortIcon} onClick={handleChangeSort} />}
                        </div>
                    </Table.Col>
                </Table.Header>

                <Table.Main isLoading={isLoading}>
                    <div className={cls.tableMainWrapper}>
                        {filteredUsers.map((item) => (
                            <TeamListItem
                                key={item.external_id}
                                item={item}
                                isSelected={selectedRows.has(item.external_id)}
                                selectRow={selectRow}
                            />
                        ))}

                        {!isLoading && !filteredUsers.length && (
                            <Table.NoItemsText>{t('No users')}</Table.NoItemsText>
                        )}
                    </div>
                </Table.Main>

                {isLoading && <Table.Loader/>}
            </Table>

            {/*<div className={cls.footer}>*/}
            {/*    {!isLoading && teamCustomers.length < filteredUsers.length && (*/}
            {/*        <Table.Button className={cls.loadMoreBtn} onClick={handleLoadMore}>*/}
            {/*            {t('Show more')} {itemsPerPage}*/}
            {/*            <ArrowIcon className={cls.loadMoreBtnIcon}/>*/}
            {/*        </Table.Button>*/}
            {/*    )}*/}
            {/*</div>*/}
        </>
    );
};

function getDateTitle(users?: User[] | null | undefined): JSX.Element | string {
    const {t} = useTranslation();

    // const dateFrom = cookies[0].created_at.toDate();
    // const dateTo = cookies[cookies.length - 1].created_at.toDate();
    const dateFrom = new Date();
    const dateTo = new Date();

    // Get day, month, and last two digits of the year for both dates
    const dayFrom = dateFrom.getDate();
    const monthFrom = dateFrom.getMonth() + 1; // Months are 0-indexed
    const yearFrom = dateFrom.getFullYear() % 100;

    const dayTo = dateTo.getDate();
    const monthTo = dateTo.getMonth() + 1; // Months are 0-indexed
    const yearTo = dateTo.getFullYear() % 100;

    // Format the month with a leading "0" if necessary
    const formattedMonthFrom = monthFrom < 10 ? `0${monthFrom}` : `${monthFrom}`;
    const formattedMonthTo = monthTo < 10 ? `0${monthTo}` : `${monthTo}`;

    // Create formatted date strings
    const formattedDateFrom = `${dayFrom}.${formattedMonthFrom}.${yearFrom}`;
    const formattedDateTo = `${dayTo}.${formattedMonthTo}.${yearTo}`;

    return (
        <>
            {/*{formattedDateTo}*/}
            {/*<span className={cls.colDateDivider}>&nbsp;—&nbsp;</span>*/}
            {/*{formattedDateFrom}*/}
            {t('Date added')}
        </>
    );
}

