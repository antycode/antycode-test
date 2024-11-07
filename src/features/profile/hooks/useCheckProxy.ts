// import {checkProxy} from '@/features/profile/components/ProfileList/profileHandlers';
import {fetchData} from '@/shared/config/fetch';
import {ipcRenderer} from 'electron';
import {setProxiesData, setProxiesSingleData} from "@/store/reducers/ProxiesDataReducer";
import {
    setProxiesChangeIpResult,
    setProxiesForCheck,
    setProxySingleForCheck
} from "@/store/reducers/ProxiesForCheckReducer";

//TODO Main processes

export const getStoredProxies = () => {
    return JSON.parse(JSON.parse(localStorage.getItem('persist:proxies') as string).proxies);
};

const fetchRecords = async (): Promise<any> => {
    const teamId = localStorage.getItem('teamId');
    try {
        const data = await fetchData({url: '/profile/proxy', method: 'GET', team: teamId});
        return data?.data || [];
    } catch (err) {
        console.error(err);
        return [];
    }
};

const removeDuplicateObjects = (arr: any[]) => {
    const uniqueIds = new Set();
    const result = [];

    for (let i = arr.length - 1; i >= 0; i--) {
        const obj = arr[i];

        if (!uniqueIds.has(obj.external_id)) {
            result.unshift(obj);
            uniqueIds.add(obj.external_id);
        }
    }

    return result;
}

export const rotateProxyLink = async (fullUrl: string) => {
    console.log('fullUrl', fullUrl);
    fetch(fullUrl, {
        method: 'GET',
        mode: 'no-cors',
        body: null,
        redirect: 'follow',
    }).catch(err => {
        console.log(`Error occurred when rotating a link for ${fullUrl}`);
    })
};

export const checkProxy = async (
    proxiesForCheck: any[],
    proxiesChangeIpResult: any[],
    checkedProxies: any[],
    checkedProxySingle: any[],
    dispatch: any,
    rotateLinkIsFirstCall: boolean | null = true,
    retryCount = 0
) => {
    try {
        proxiesForCheck = removeDuplicateObjects(proxiesForCheck);
        if (!proxiesForCheck[0].needCheckSpeed) {

            const proxyOptions = {...proxiesForCheck[0], needCheckSpeed: true};
            await ipcRenderer.removeAllListeners(`proxyCheckResult_${proxyOptions.external_id}`);

            let foundProxy: { [key: string]: any } | undefined;
            let foundProxyFrom: string = '';
            let newProxiesData: any[] = checkedProxies;
            let newProxySingleData: any[] = checkedProxySingle;

            if (checkedProxies.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id)) {
                foundProxy = checkedProxies.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id);
                foundProxyFrom = 'checkedProxies';
                newProxiesData = newProxiesData.filter((proxy: { [key: string]: any }) => proxy.external_id !== proxyOptions.external_id);
            } else if (checkedProxySingle.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id)) {
                foundProxy = checkedProxySingle.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id);
                foundProxyFrom = 'checkedProxySingle';
                newProxySingleData = newProxySingleData.filter((proxy: { [key: string]: any }) => proxy.external_id !== proxyOptions.external_id);
            }

            const updatedProxiesForCheck = proxiesForCheck.filter((item: any) => item.external_id !== proxyOptions.external_id);

            const updatedProxiesChangeIpResult = proxiesChangeIpResult.filter(proxy => proxy.external_id !== proxyOptions.external_id);
            await dispatch(setProxiesChangeIpResult(updatedProxiesChangeIpResult));

            if (proxyOptions.needRotateLink && foundProxy) {
                if (rotateLinkIsFirstCall) {
                    await rotateProxyLink(proxyOptions.link_rotate);
                }
                await new Promise(resolve => setTimeout(resolve, 3500));
            }
            console.log('proxyOptions for check: ', proxyOptions);

            return await new Promise(async (resolve, reject) => {
                await ipcRenderer.send('checkProxy', proxyOptions);
                await ipcRenderer.once(`proxyCheckResult_${proxyOptions.external_id}`, async (event, result) => {
                    if (result.result === 'requestError') {
                        console.error('Error of checkProxy:', result.result);
                        if (retryCount < 2) {
                            console.log(`Retrying checkProxy, attempt ${retryCount + 1}`);
                            setTimeout(async () => {
                                try {
                                    await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                                    const updatedData = await checkProxy(
                                        proxiesForCheck,
                                        proxiesChangeIpResult,
                                        checkedProxies,
                                        checkedProxySingle,
                                        dispatch,
                                        null,
                                        retryCount + 1
                                    );
                                    await resolve(updatedData);
                                } catch (err) {
                                    await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                                    await dispatch(setProxiesForCheck([...updatedProxiesForCheck]));
                                    await resolve(err);
                                }
                            }, 1000);
                        } else {
                            // Update the state with the accumulated proxy data
                            const proxiesFromApi = await fetchRecords();
                            if (proxiesFromApi.find((proxy: { [key: string]: any }) => proxy.external_id === result.proxyData.external_id)) {
                                await dispatch(setProxiesData([...newProxiesData]));
                                if (foundProxyFrom === 'checkedProxySingle') await dispatch(setProxiesSingleData([...newProxySingleData]));
                            } else {
                                console.log(`${result.proxyData.external_id} proxy not found!`);
                            }
                            await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                            await dispatch(setProxiesForCheck([...updatedProxiesForCheck]));
                            await resolve(true);
                        }
                    } else {
                        try {
                            console.log('Result of checkProxy:', {
                                result: JSON.parse(result.result),
                                speed: result.speed
                            });
                            const checkedProxyData = {
                                ...JSON.parse(result.result),
                                speed: result.speed
                            };

                            if (proxyOptions.needRotateLink) {
                                if (foundProxy && foundProxy.userIP === checkedProxyData.userIP) {
                                    if (retryCount < 2) {
                                        console.log(`Retrying checkProxy after rotate ip, attempt ${retryCount + 1}`);
                                        try {
                                            await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                                            const updatedData = await checkProxy(
                                                proxiesForCheck,
                                                proxiesChangeIpResult,
                                                checkedProxies,
                                                checkedProxySingle,
                                                dispatch,
                                                false,
                                                retryCount + 1
                                            );
                                            await resolve(updatedData);
                                        } catch (err) {
                                            await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                                            await resolve(err);
                                        }
                                    } else {
                                        // Update the state with the accumulated proxy data
                                        const proxiesFromApi = await fetchRecords();
                                        if (proxiesFromApi.find((proxy: { [key: string]: any }) => proxy.external_id === result.proxyData.external_id)) {
                                            await dispatch(setProxiesData([...newProxiesData, {external_id: result.proxyData.external_id, ...checkedProxyData}]));
                                            if (foundProxyFrom === 'checkedProxySingle') await dispatch(setProxiesSingleData([...newProxySingleData]));
                                            await dispatch(setProxiesForCheck([...updatedProxiesForCheck, {
                                                ...result.proxyData,
                                                needRotateLink: false
                                            }]));
                                            await dispatch(setProxiesChangeIpResult([...proxiesChangeIpResult, {external_id: result.proxyData.external_id, rotateIpResult: false}]));
                                        } else {
                                            await dispatch(setProxiesForCheck([...updatedProxiesForCheck]));
                                            console.log(`${result.proxyData.external_id} proxy not found!`);
                                        }
                                        await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                                        await resolve(true);
                                    }
                                } else {
                                    // Update the state with the accumulated proxy data
                                    const proxiesFromApi = await fetchRecords();
                                    if (proxiesFromApi.find((proxy: { [key: string]: any }) => proxy.external_id === result.proxyData.external_id)) {
                                        await dispatch(setProxiesData([...newProxiesData, {external_id: result.proxyData.external_id, ...checkedProxyData}]));
                                        if (foundProxyFrom === 'checkedProxySingle') await dispatch(setProxiesSingleData([...newProxySingleData]));
                                        await dispatch(setProxiesForCheck([...updatedProxiesForCheck, {
                                            ...result.proxyData,
                                            needRotateLink: false
                                        }]));
                                        await dispatch(setProxiesChangeIpResult([...proxiesChangeIpResult, {external_id: result.proxyData.external_id, rotateIpResult: true}]));
                                    } else {
                                        console.log(`${result.proxyData.external_id} proxy not found!`);
                                        await dispatch(setProxiesForCheck([...updatedProxiesForCheck]));
                                    }
                                    await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                                    await resolve(true);
                                }
                            } else {
                                // Update the state with the accumulated proxy data
                                const proxiesFromApi = await fetchRecords();
                                if (proxiesFromApi.find((proxy: { [key: string]: any }) => proxy.external_id === result.proxyData.external_id)) {
                                    await dispatch(setProxiesData([...newProxiesData, {external_id: result.proxyData.external_id, ...checkedProxyData}]));
                                    if (foundProxyFrom === 'checkedProxySingle') await dispatch(setProxiesSingleData([...newProxySingleData]));
                                    await dispatch(setProxiesForCheck([...updatedProxiesForCheck, {...result.proxyData}]));
                                } else {
                                    console.log(`${result.proxyData.external_id} proxy not found!`);
                                    await dispatch(setProxiesForCheck([...updatedProxiesForCheck]));
                                }
                                await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                                await resolve(true);
                            }
                        } catch (err) {
                            console.log('Error with in "try" block where JSON.parse(result.result): ', err);
                            if (retryCount < 3) {
                                console.log(`Retrying checkProxy, attempt ${retryCount + 1}`);
                                setTimeout(async () => {
                                    try {
                                        await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                                        const updatedData = await checkProxy(
                                            proxiesForCheck,
                                            proxiesChangeIpResult,
                                            checkedProxies,
                                            checkedProxySingle,
                                            dispatch,
                                            null,
                                            retryCount + 1
                                        );
                                        await resolve(updatedData);
                                    } catch (err) {
                                        await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                                        await resolve(err);
                                    }
                                }, 1000);
                            } else {
                                console.error('Max retry attempts reached. Could not recover from error.');
                                // Update the state with the accumulated proxy data
                                const proxiesFromApi = await fetchRecords();
                                if (proxiesFromApi.find((proxy: { [key: string]: any }) => proxy.external_id === result.proxyData.external_id)) {
                                    await dispatch(setProxiesData([...newProxiesData]));
                                    if (foundProxyFrom === 'checkedProxySingle') await dispatch(setProxiesSingleData([...newProxySingleData]));
                                } else {
                                    console.log(`${result.proxyData.external_id} proxy not found!`);
                                }
                                await ipcRenderer.removeAllListeners(`proxyCheckResult_${result.proxyData.external_id}`);
                                await dispatch(setProxiesForCheck([...updatedProxiesForCheck]));
                                await resolve(newProxiesData);
                            }
                        }
                    }
                });
            });
        } else {
            const proxyOptions = {...proxiesForCheck[0]};
            if (checkedProxies.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id)) {
                await checkProxySpeed(proxiesForCheck, proxiesChangeIpResult, checkedProxies, dispatch);
            } else if (checkedProxySingle.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id)) {
                await checkProxySpeed(proxiesForCheck, proxiesChangeIpResult, checkedProxySingle, dispatch);
            }
        }
    } catch (error) {
        console.error('Error in useCheckProxy: ', error);
        throw error;
    }
};

export const checkProxySpeed = async (
    proxiesForCheck: any[],
    proxiesChangeIpResult: any[],
    checkedProxies: any[],
    dispatch: any,
    retryCount = 0) => {
    return await new Promise(async (resolve, reject) => {
        const proxyOptions = {...proxiesForCheck[0], needCheckSpeed: false};
        console.log('proxyOptions for check proxy speed: ', proxyOptions);
        const updatedProxiesForCheck = proxiesForCheck.filter((item: any) => item.external_id !== proxyOptions.external_id);
        const storedProxies = checkedProxies;

        if (storedProxies.find((storedProxy: { [key: string]: any }) => storedProxy.external_id === proxyOptions.external_id)) {
            try {
                await ipcRenderer.send('checkProxySpeed', proxyOptions);
                await ipcRenderer.once(`proxyCheckSpeedResult_${proxyOptions.external_id}`, async (event, result) => {
                    console.log('Result of checking proxy speed', result.speed);
                    const newProxiesData = storedProxies.filter((proxy: { [key: string]: any }) => proxy.external_id !== result.proxyData.external_id);
                    const foundProxy = storedProxies.find((proxy: { [key: string]: any }) => proxy.external_id === result.proxyData.external_id);
                    if (result.speed && !isNaN(result.speed)) {
                        const proxiesFromApi = await fetchRecords();
                        if (proxiesFromApi.find((proxy: { [key: string]: any }) => proxy.external_id === result.proxyData.external_id)) {
                            await dispatch(setProxiesData([...newProxiesData, {...foundProxy, speed: result.speed}]));
                        } else {
                            console.log(`${result.proxyData.external_id} proxy not found!`);
                            await dispatch(setProxiesData([...newProxiesData]));
                        }
                        await dispatch(setProxiesForCheck([...updatedProxiesForCheck]));
                        await ipcRenderer.removeAllListeners(`proxyCheckSpeedResult_${result.proxyData.external_id}`);
                        await resolve(true);
                    } else {
                        if (retryCount < 2) {
                            console.log(`Retrying checkProxySpeed, attempt ${retryCount + 1}`);
                            setTimeout(async () => {
                                try {
                                    await ipcRenderer.removeAllListeners(`proxyCheckSpeedResult_${result.proxyData.external_id}`);
                                    const updatedData = await checkProxySpeed(
                                        proxiesForCheck,
                                        proxiesChangeIpResult,
                                        checkedProxies,
                                        dispatch,
                                        retryCount + 1
                                    );
                                    await resolve(updatedData);
                                } catch (err) {
                                    await dispatch(setProxiesForCheck([...updatedProxiesForCheck]));
                                    await ipcRenderer.removeAllListeners(`proxyCheckSpeedResult_${result.proxyData.external_id}`);
                                    await resolve(err);
                                }
                            }, 1000);
                        } else {
                            const proxiesFromApi = await fetchRecords();
                            if (!proxiesFromApi.find((proxy: { [key: string]: any }) => proxy.external_id === result.proxyData.external_id)) {
                                console.log(`${result.proxyData.external_id} proxy not found!`);
                                await dispatch(setProxiesData([...newProxiesData]));
                            }
                            await dispatch(setProxiesForCheck([...updatedProxiesForCheck]));
                            await ipcRenderer.removeAllListeners(`proxyCheckSpeedResult_${result.proxyData.external_id}`);
                            await resolve(false);
                        }
                    }
                });
            } catch (error) {
                await ipcRenderer.removeAllListeners(`proxyCheckSpeedResult_${proxyOptions.external_id}`);
                await resolve(error);
                console.error('Error in useCheckProxy: ', error);
            }
        } else {
            await resolve(false);
        }
    });
};

export const checkProxySingle = async (
    proxiesForCheck: any[],
    proxiesChangeIpResult: any[],
    checkedProxies: any[],
    checkedProxySingle: any[],
    dispatch: any,
    rotateLinkIsFirstCall: boolean | null = true,
    retryCount = 0
) => {
    try {
        proxiesForCheck = removeDuplicateObjects(proxiesForCheck);
        if (!proxiesForCheck[0].needCheckSpeed) {

            const proxyOptions = {...proxiesForCheck[0], needCheckSpeed: true};
            await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${proxyOptions.external_id}`);

            let foundProxy: { [key: string]: any } | undefined;
            let foundProxyFrom: string = '';
            let newProxiesData: any[] = checkedProxies;
            let newProxySingleData: any[] = checkedProxySingle;

            let proxySpeed: any;

            if (checkedProxies.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id)) {
                foundProxy = checkedProxies.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id);
                foundProxyFrom = 'checkedProxies';
                if (foundProxy?.speed) {
                    proxySpeed = foundProxy.speed;
                }
                newProxiesData = newProxiesData.filter((proxy: { [key: string]: any }) => proxy.external_id !== proxyOptions.external_id);
            } else if (checkedProxySingle.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id)) {
                foundProxy = checkedProxySingle.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id);
                foundProxyFrom = 'checkedProxySingle';
                if (foundProxy?.speed) {
                    proxySpeed = foundProxy.speed;
                }
                newProxySingleData = newProxySingleData.filter((proxy: { [key: string]: any }) => proxy.external_id !== proxyOptions.external_id);
            }

            const updatedProxiesForCheck = proxiesForCheck.filter((item: any) => item.external_id !== proxyOptions.external_id);

            const updatedProxiesChangeIpResult = proxiesChangeIpResult.filter(proxy => proxy.external_id !== proxyOptions.external_id);
            await dispatch(setProxiesChangeIpResult(updatedProxiesChangeIpResult));

            if (proxyOptions.needRotateLink) {
                if (rotateLinkIsFirstCall) {
                    await rotateProxyLink(proxyOptions.link_rotate);
                }
                await new Promise(resolve => setTimeout(resolve, 3500));
            }
            console.log('proxyOptions for check: ', proxyOptions);

            return await new Promise(async (resolve, reject) => {
                await ipcRenderer.send('checkSingleProxy', proxyOptions);
                await ipcRenderer.once(`checkSingleProxyResult_${proxyOptions.external_id}`, async (event, result) => {
                    if (result.result === 'requestError') {
                        console.error('Error of checkProxy:', result.result);
                        if (retryCount < 2) {
                            console.log(`Retrying checkProxy, attempt ${retryCount + 1}`);
                            setTimeout(async () => {
                                try {
                                    await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                                    const updatedData = await checkProxySingle(
                                        proxiesForCheck,
                                        proxiesChangeIpResult,
                                        checkedProxies,
                                        checkedProxySingle,
                                        dispatch,
                                        null,
                                        retryCount + 1
                                    );
                                    await resolve(updatedData);
                                } catch (err) {
                                    await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                                    await dispatch(setProxySingleForCheck([...updatedProxiesForCheck]));
                                    await resolve(err);
                                }
                            }, 1000);
                        } else {
                            // Update the state with the accumulated proxy data
                            if (foundProxyFrom === 'checkedProxies') await dispatch(setProxiesData([...newProxiesData]));
                            await dispatch(setProxiesSingleData([...newProxySingleData]));
                            await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                            await dispatch(setProxySingleForCheck([...updatedProxiesForCheck]));
                            await resolve(true);
                        }
                    } else {
                        try {
                            console.log('Result of checkProxy:', {
                                result: JSON.parse(result.result),
                                speed: result.speed
                            });
                            const checkedProxyData = {
                                ...JSON.parse(result.result),
                                speed: result.speed
                            };

                            if (proxyOptions.needRotateLink) {
                                if (foundProxy && foundProxy.userIP === checkedProxyData.userIP) {
                                    if (retryCount < 2) {
                                        console.log(`Retrying checkProxy after rotate ip, attempt ${retryCount + 1}`);
                                        try {
                                            await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                                            const updatedData = await checkProxySingle(
                                                proxiesForCheck,
                                                proxiesChangeIpResult,
                                                checkedProxies,
                                                checkedProxySingle,
                                                dispatch,
                                                false,
                                                retryCount + 1
                                            );
                                            await resolve(updatedData);
                                        } catch (err) {
                                            await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                                            await resolve(err);
                                        }
                                    } else {
                                        // Update the state with the accumulated proxy data
                                        if (foundProxyFrom === 'checkedProxies') await dispatch(setProxiesData([...newProxiesData]));
                                        await dispatch(setProxiesSingleData([...newProxySingleData, {external_id: result.proxyData.external_id, ...checkedProxyData, speed: proxySpeed}]));
                                        await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                                        await dispatch(setProxiesChangeIpResult([...proxiesChangeIpResult, {external_id: result.proxyData.external_id, rotateIpResult: false}]));
                                        if ({...result.proxyData}.checkFromProfilesPage) {
                                            await dispatch(setProxySingleForCheck([...updatedProxiesForCheck]));
                                        } else {
                                            await dispatch(setProxySingleForCheck([...updatedProxiesForCheck, {
                                                ...result.proxyData,
                                                needRotateLink: false
                                            }]));
                                        }
                                        await resolve(true);
                                    }
                                } else {
                                    // Update the state with the accumulated proxy data
                                    if (foundProxyFrom === 'checkedProxies') await dispatch(setProxiesData([...newProxiesData]));
                                    await dispatch(setProxiesSingleData([...newProxySingleData, {external_id: result.proxyData.external_id, ...checkedProxyData, speed: proxySpeed}]));
                                    await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                                    await dispatch(setProxiesChangeIpResult([...proxiesChangeIpResult, {external_id: result.proxyData.external_id, rotateIpResult: true}]));
                                    if ({...result.proxyData}.checkFromProfilesPage) {
                                        await dispatch(setProxySingleForCheck([...updatedProxiesForCheck]));
                                    } else {
                                        await dispatch(setProxySingleForCheck([...updatedProxiesForCheck, {
                                            ...result.proxyData,
                                            needRotateLink: false
                                        }]));
                                    }
                                    await resolve(true);
                                }
                            } else {
                                // Update the state with the accumulated proxy data
                                if (foundProxyFrom === 'checkedProxies') await dispatch(setProxiesData([...newProxiesData]));
                                console.log('proxySpeed', proxySpeed)
                                await dispatch(setProxiesSingleData([...newProxySingleData, {external_id: result.proxyData.external_id, ...checkedProxyData, speed: proxySpeed}]));
                                await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                                if ({...result.proxyData}.checkFromProfilesPage) {
                                    await dispatch(setProxySingleForCheck([...updatedProxiesForCheck]));
                                } else {
                                    await dispatch(setProxySingleForCheck([...updatedProxiesForCheck, {...result.proxyData}]));
                                }
                                await resolve(true);
                            }
                        } catch (err) {
                            console.log('Error with in "try" block where JSON.parse(result.result): ', err);
                            if (retryCount < 3) {
                                console.log(`Retrying checkProxy, attempt ${retryCount + 1}`);
                                setTimeout(async () => {
                                    try {
                                        await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                                        const updatedData = await checkProxySingle(
                                            proxiesForCheck,
                                            proxiesChangeIpResult,
                                            checkedProxies,
                                            checkedProxySingle,
                                            dispatch,
                                            null,
                                            retryCount + 1
                                        );
                                        await resolve(updatedData);
                                    } catch (err) {
                                        await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                                        await resolve(err);
                                    }
                                }, 1000);
                            } else {
                                console.error('Max retry attempts reached. Could not recover from error.');
                                // Update the state with the accumulated proxy data
                                if (foundProxyFrom === 'checkedProxies') await dispatch(setProxiesData([...newProxiesData]));
                                await dispatch(setProxiesSingleData([...newProxySingleData]));
                                await ipcRenderer.removeAllListeners(`checkSingleProxyResult_${result.proxyData.external_id}`);
                                await dispatch(setProxySingleForCheck([...updatedProxiesForCheck]));
                                await resolve(newProxiesData);
                            }
                        }
                    }
                });
            });
        } else {
            const proxyOptions = {...proxiesForCheck[0]};
            if (checkedProxies.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id)) {
                await checkProxySpeedSingle(proxiesForCheck, proxiesChangeIpResult, checkedProxies, dispatch);
            } else if (checkedProxySingle.find((proxy: { [key: string]: any }) => proxy.external_id === proxyOptions.external_id)) {
                await checkProxySpeedSingle(proxiesForCheck, proxiesChangeIpResult, checkedProxySingle, dispatch);
            }
        }
    } catch (error) {
        console.error('Error in useCheckProxy: ', error);
        throw error;
    }
};

export const checkProxySpeedSingle = async (
    proxiesForCheck: any[],
    proxiesChangeIpResult: any[],
    checkedProxies: any[],
    dispatch: any,
    retryCount = 0) => {
    return await new Promise(async (resolve, reject) => {
        const proxyOptions = {...proxiesForCheck[0], needCheckSpeed: false};
        console.log('proxyOptions for allProxiesForCheckcheck proxy speed: ', proxyOptions);
        const updatedProxiesForCheck = proxiesForCheck.filter((item: any) => item.external_id !== proxyOptions.external_id);
        const storedProxies = checkedProxies;

        if (storedProxies.find((storedProxy: { [key: string]: any }) => storedProxy.external_id === proxyOptions.external_id)) {
            try {
                await ipcRenderer.send('checkSingleProxySpeed', proxyOptions);
                await ipcRenderer.once(`checkSingleProxySpeedResult_${proxyOptions.external_id}`, async (event, result) => {
                    console.log('Result of checking proxy speed', result.speed);
                    const newProxiesData = storedProxies.filter((proxy: { [key: string]: any }) => proxy.external_id !== result.proxyData.external_id);
                    const foundProxy = storedProxies.find((proxy: { [key: string]: any }) => proxy.external_id === result.proxyData.external_id);
                    if (result.speed) {
                        await dispatch(setProxiesSingleData([...newProxiesData, {...foundProxy, speed: result.speed}]));
                        await dispatch(setProxySingleForCheck([...updatedProxiesForCheck]));
                        await ipcRenderer.removeAllListeners(`checkSingleProxySpeedResult_${result.proxyData.external_id}`);
                        await resolve(true);
                    } else {
                        if (retryCount < 2) {
                            console.log(`Retrying checkProxySpeed, attempt ${retryCount + 1}`);
                            setTimeout(async () => {
                                try {
                                    await ipcRenderer.removeAllListeners(`checkSingleProxySpeedResult_${result.proxyData.external_id}`);
                                    const updatedData = await checkProxySpeedSingle(
                                        proxiesForCheck,
                                        proxiesChangeIpResult,
                                        checkedProxies,
                                        dispatch,
                                        retryCount + 1
                                    );
                                    await resolve(updatedData);
                                } catch (err) {
                                    await dispatch(setProxySingleForCheck([...updatedProxiesForCheck]));
                                    await ipcRenderer.removeAllListeners(`checkSingleProxySpeedResult_${result.proxyData.external_id}`);
                                    await resolve(err);
                                }
                            }, 1000);
                        } else {
                            await dispatch(setProxySingleForCheck([...updatedProxiesForCheck]));
                            await ipcRenderer.removeAllListeners(`checkSingleProxySpeedResult_${result.proxyData.external_id}`);
                            await resolve(false);
                        }
                    }
                });
            } catch (error) {
                await ipcRenderer.removeAllListeners(`checkSingleProxySpeedResult_${proxyOptions.external_id}`);
                await resolve(error);
                console.error('Error in useCheckProxy: ', error);
            }
        } else {
            await resolve(false);
        }
    });
};

// Kill tunnel process
// export const killProcesses = async (processPids: any[]) => {
//     return Promise.all(processPids.map(pid => {
//         return new Promise((resolve, reject) => {
//             try {
//                 ipcRenderer.send('killProcess', pid);
//                 console.log('Process was killed: ', pid);
//                 resolve(void 0);
//             } catch (err) {
//                 console.error(`Error killing process with PID ${pid}:`, err);
//                 reject(err);
//             }
//         });
//     }));
// };

//TODO Need to delete

interface IProxyParams {
    type: string,
    host: string,
    port?: any,
    login: string,
    password: string
};

export const useCheckProxy = (proxyParams: IProxyParams) => {

    const argsParams = () => {
        const paramsObj = {type: '', host: '', port: 0};
        paramsObj.type = proxyParams?.type;
        paramsObj.host = proxyParams?.host;
        paramsObj.port = proxyParams?.port;
        return paramsObj;
    };

    // checkProxy(argsParams());
};
