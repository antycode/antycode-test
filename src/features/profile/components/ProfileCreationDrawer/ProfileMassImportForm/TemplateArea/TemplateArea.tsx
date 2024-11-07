import {useTranslation} from 'react-i18next';
import cls from './TamplateArea.module.scss';
import {ReactComponent as DownloadIcon} from '@/shared/assets/icons/download-simple.svg';
import {ReactComponent as CloseIcon} from '@/shared/assets/icons/close.svg';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {Button} from "@/shared/components/Button";
import * as XLSX from 'xlsx';

interface TemplateAreaProps {
    setDataFromTemplate: React.Dispatch<React.SetStateAction<any[]>>,
    dataFromTemplate: any[],
    textFile: string,
    setTextFile: React.Dispatch<React.SetStateAction<string>>,
    setFileType: React.Dispatch<React.SetStateAction<string>>
}

export const TemplateArea = (props: TemplateAreaProps) => {
    const {setDataFromTemplate, dataFromTemplate, textFile, setTextFile, setFileType} = props;

    const fileInputRef: MutableRefObject<null> | any = useRef(null);
    const textareaRef = useRef(null);
    const txtAreaRef = useRef<HTMLDivElement | null>(null);

    const {t} = useTranslation();

    const [fileName, setFileName] = useState<any>('');
    const [inputKey, setInputKey] = useState<number>(0);
    const [showTextarea, setShowTextarea] = useState<boolean>(false);

    const handleClick = (ev: any) => {
        ev.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const parseCookiesAndUserAgent = (text: string): any[] => {
        const data: any[] = [];

        const cookieRegex = /\[.*?\]/gs;
        const userAgentRegex = /Mozilla.*?(Safari\/[\d.]+)|OPR.*?(Safari\/[\d.]+)|Model.*?(?=\s)/g;
        let cookiesArray = text.match(cookieRegex) || [];
        let userAgentsArray = (text.match(userAgentRegex) || []).map(userAgent => userAgent.trim()) as string[] | RegExpMatchArray;

        let lastUsedUserAgentIndex = -1;

        cookiesArray.forEach((cookies, index) => {
            let userAgent = '';

            if (lastUsedUserAgentIndex + 1 < userAgentsArray.length) {
                const nextUserAgentIndex = userAgentsArray.findIndex((_, i) => i > lastUsedUserAgentIndex);
                if (nextUserAgentIndex !== -1 && nextUserAgentIndex <= userAgentsArray.length) {
                    userAgent = userAgentsArray[nextUserAgentIndex];
                    lastUsedUserAgentIndex = nextUserAgentIndex;
                }
            }

            data.push({ userAgent, cookies, title: `Account ID_${index + 1}` });
        });

        return data;
    };

    const handleTextFile = (text: string) => {
        const parsedData = parseCookiesAndUserAgent(text);
        setDataFromTemplate(parsedData);
    };

    const handleFile = (file: File) => {
        if (file) {
            if (file.name.endsWith('.xlsx')) {
                setFileType('xlsx');
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result;
                    if (result && result instanceof ArrayBuffer) {
                        const data = new Uint8Array(result);
                        const workbook = XLSX.read(data, {type: 'array'});
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(sheet, {header: 1});

                        let transformedData = jsonData.map((item: any, index: number) => {
                            if (
                                (item[0] === 'Profile name' && item[1] === 'Cookie' && item[2] === 'Proxy type' && item[3] === 'Proxy' && item[4] === 'User Agent' && item[5] === 'Notes') ||
                                (item[0] === 'Example. Available formats' && item[2] === 'http/https/socks5/ssh' && item[5] === 'Note if you need it')
                            ) {
                                return;
                            } else if (item[0]) {
                                let obj: any = {
                                    title: `${item[0]}` || `Account ID_${index + 1}`,
                                    cookies: item[1] || '',
                                    proxy: {},
                                    userAgent: item[4] || '',
                                    note: item[5] || ''
                                };

                                if (item[2] && item[3]) {
                                    obj.proxy.type = item[2];
                                    const credentials = item[3];
                                    if (credentials.includes('@')) {
                                        const [loginPassword, hostPort] = credentials.split('@');
                                        const [login, password] = loginPassword.split(':');
                                        const [host, port] = hostPort.split(':');
                                        obj.proxy.host = host;
                                        obj.proxy.port = port;
                                        obj.proxy.login = login;
                                        obj.proxy.password = password;
                                    } else {
                                        const [host, port, login, password] = credentials.split(':');
                                        obj.proxy.host = host;
                                        obj.proxy.port = port;
                                        obj.proxy.login = login;
                                        obj.proxy.password = password;
                                    }
                                } else if (!item[2] && item[3]) {
                                    const credentials = item[3];
                                    if (credentials.includes('@')) {
                                        const [loginPassword, hostPort] = credentials.split('@');
                                        const [login, password] = loginPassword.split(':');
                                        const [host, port] = hostPort.split(':');
                                        obj.proxy.host = host;
                                        obj.proxy.port = port;
                                        obj.proxy.login = login;
                                        obj.proxy.password = password;
                                    } else {
                                        const [host, port, login, password] = credentials.split(':');
                                        obj.proxy.host = host;
                                        obj.proxy.port = port;
                                        obj.proxy.login = login;
                                        obj.proxy.password = password;
                                    }
                                } else if (item[2] && !item[3]) {
                                    obj.proxy.type = item[2];
                                } else {
                                    obj.proxy = null;
                                }
                                return obj;
                            }
                        });

                        transformedData = transformedData.filter((item: any) => item && item.title);
                        console.log('transformedData', transformedData)
                        setDataFromTemplate(transformedData);
                    }
                };
                setFileName(file.name);
                reader.readAsArrayBuffer(file);
            } else if (file.name.endsWith('.txt')) {
                setFileType('txt');
                const reader = new FileReader();
                reader.onload = (event) => {
                    const target = event.target as FileReader | null;
                    if (target && typeof target.result === 'string') {
                        setTextFile(target.result);
                        setShowTextarea(true);
                        handleTextFile(target.result);
                    }
                };
                reader.readAsText(file);
                setFileName(file.name);
            }
        }
    };

    const onDropHandler = (ev: any) => {
        ev.preventDefault();
        const file = ev.dataTransfer.files[0];
        handleFile(file);
    };

    const resetFile = (ev: any) => {
        ev.preventDefault();
        setTextFile('');
        setShowTextarea(false);
        setDataFromTemplate([]);
        setFileType('');
        setFileName('');
        setInputKey(prevKey => prevKey + 1);
    };

    const onDragOver = (ev: any) => ev.preventDefault();

    const handleClickInsideField = (event: any) => {
        event.stopPropagation();
        const target = event.target as HTMLElement;
        const isButtonOrChild = target.closest('.dropFileBtn');
        if (!isButtonOrChild && fileName.trim().length === 0) {
            setShowTextarea(true);
        } else {
            setShowTextarea(false);
        }
    };

    const handleChangeTextareaVal = (e: any) => {
        setFileType('txt');
        setTextFile(e.target.value);
        handleTextFile(e.target.value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                txtAreaRef.current &&
                !txtAreaRef.current.contains(event.target as HTMLElement) &&
                textFile.trim().length === 0
            ) {
                setFileType('');
                setFileName('');
                setTextFile('');
                setShowTextarea(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [textFile]);

    return (
        <>
            {showTextarea ? (
                <div className={cls.templateWrapper}>
                    <div className={cls.fieldTextarea} ref={txtAreaRef}>
                    <textarea
                        ref={textareaRef}
                        className={cls.textareaTextFile}
                        value={textFile}
                        onChange={(e) => handleChangeTextareaVal(e)}
                        spellCheck={false}
                    />
                        <CloseIcon
                            className={cls.textareaCloseIcon}
                            width={15}
                            height={18}
                            onClick={resetFile}
                        />
                    </div>
                </div>
            ) : (
                <div className={cls.field} onClick={handleClickInsideField} id="drop_zone" onDrop={onDropHandler}
                     onDragOver={onDragOver}>
                    {fileName ? (
                        <div className={cls.xlsxFileName}>{fileName}</div>
                    ) : (
                        <DownloadIcon className={cls.imgXlsx}/>
                    )}
                    <div className={cls.textXlsx}>
                        {fileName === ''
                            ? t('Insert template or drag and drop file')
                            : t("Press 'Import' button to complete")}
                    </div>
                    <Button onClick={fileName === '' ? handleClick : resetFile} color="orange" variant="outline"
                            className='dropFileBtn'>
                        {fileName === '' ? t('From a file') : t('Delete')}
                    </Button>
                    <input
                        key={inputKey}
                        ref={fileInputRef}
                        id="file_picker"
                        type="file"
                        accept=".xlsx, .txt"
                        onChange={(ev) => {
                            if (ev.target.files && ev.target.files.length > 0) {
                                handleFile(ev.target.files[0]);
                            }
                        }}
                        style={{display: 'none'}}
                    />
                </div>
            )}
        </>
    );
};
