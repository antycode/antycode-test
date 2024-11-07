import {useTranslation} from 'react-i18next';
import cls from './CookiesAreaPopup.module.scss';
import {ReactComponent as DownloadIcon} from '@/shared/assets/icons/download-simple.svg';
import {ReactComponent as CloseIcon} from '@/shared/assets/icons/close.svg';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {Button} from "@/shared/components/Button";

interface CookiesAreaPopupProps {
    textFile: any,
    setTextFile: React.Dispatch<React.SetStateAction<any>>
}

export const CookiesAreaPopup = (props: CookiesAreaPopupProps) => {
    const {textFile, setTextFile} = props;
    const fileInputRef: MutableRefObject<null> | any = useRef(null);

    const {t} = useTranslation();

    const [textFileBoolean, setTextFileBoolean] = useState<boolean>(false);
    const [fileName, setFileName] = useState<any>('');
    const [importFileSuccess, setImportFileSuccess] = useState<boolean>(false);
    const [cookieError, setCookieError] = useState<boolean>(false);
    const [countCookie, setCountCookie] = useState<number>(0);
    const cookieRef = useRef<HTMLDivElement | null>(null);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        setTextFile(reader.result);
        setImportFileSuccess(true);
    }, false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                cookieRef.current &&
                !cookieRef.current.contains(event.target as HTMLElement) &&
                textFile.trim().length === 0
            ) {
                // Click occurred outside the protocol block and textFile is empty
                setFileName('');
                setTextFile('');
                setImportFileSuccess(false);
            }
        };

        // Add a click event listener when the component mounts
        document.addEventListener('click', handleClickOutside);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [textFile]);

    useEffect(() => {
        if (importFileSuccess) {
            try {
                const jsonArr = JSON.parse(textFile);
                console.log('jsonArr', jsonArr)

                if (!Array.isArray(jsonArr)) {
                    console.error('Invalid JSON format: Not an array.');
                    setCookieError(true);
                    // Error handling if JSON is not an array
                    return;
                }

                if (jsonArr.length === 0) {
                    console.warn('JSON array is empty.');
                    setCookieError(true);
                    // Error handling if JSON array is empty
                    return;
                }

                // All objects inside the array
                for (const jsonObj of jsonArr) {
                    if (typeof jsonObj !== 'object' || jsonObj === null) {
                        console.error('Invalid JSON format: Objects inside the array must be valid JSON objects.');
                        setCookieError(true);
                        // Error handling if the array is not a JSON object
                        return;
                    }
                }

                console.log('Valid JSON format.');

                // jsonArr.length contains the number of objects inside the JSON array
                console.log('Number of objects in the JSON array:', jsonArr.length);
                setCookieError(false);
                setCountCookie(jsonArr.length);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                setCookieError(true);
                // Handling errors when parsing JSON
            }
        }
    }, [textFile]);

    const handleClick = (ev: any) => {
        ev.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const onDropHandler = (ev: any) => {
        ev.preventDefault();
        let fileReader: any;
        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            fileReader =
                [...ev.dataTransfer.items]
                    .find((item: any) => item.kind === "file")
                    .getAsFile();
        } else {
            // Use DataTransfer interface to access the file(s)
            fileReader = ev.dataTransfer.files[0];
        }
        reader.readAsText(fileReader);
        if (ev.dataTransfer.files) {
            setFileName(ev.dataTransfer.files[0].name);
        }
    };

    const resetFile = (ev: any) => {
        ev.preventDefault();
        setFileName('');
        setTextFile('');
        setImportFileSuccess(false);
    };
    const onDragOver = (ev: any) => ev.preventDefault();

    const handleClickInsideFieldCookie = (event: any) => {
        event.stopPropagation();
        const target = event.target as HTMLElement;
        const isButtonOrChild = target.closest('.dropFileBtn');
        if (!isButtonOrChild && fileName.trim().length === 0) {
            setImportFileSuccess(true);
        } else {
            setImportFileSuccess(false);
        }
    };

    useEffect(() => {
        if (textFile.length > 0) {
            setTextFileBoolean(true);
        } else {
            setTextFileBoolean(false);
        }
    }, [textFile]);

    const textareaRef = useRef<any>(null);
    useEffect(() => {
        if (textareaRef.current && importFileSuccess) {
            textareaRef.current.focus();
        }
    }, [importFileSuccess]);

    return (
        <div className={cls.cookiesContainer}>
            {importFileSuccess ? (
                <div className={cls.cookieWrapper}>
                    <div className={cls.fieldCookieTextarea} ref={cookieRef}>
                    <textarea
                        ref={textareaRef}
                        className={cls.textareaTextFile}
                        value={textFile}
                        onChange={(e) => {
                            setTextFile(e.target.value);
                        }}
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
                <div className={cls.fieldCookie} onClick={handleClickInsideFieldCookie} id="drop_zone"
                     onDrop={onDropHandler} onDragOver={onDragOver}>
                    <div className={cls.cookieImportFileContent}>
                        {fileName ? (
                            <div className={cls.cookieFileName}>
                                {fileName}
                            </div>
                        ) : (
                            <DownloadIcon className={cls.imgCookie}/>
                        )}

                        <div className={cls.textCookie}>
                            {fileName == '' ? t('Insert cookies or drag and drop file') : t("Press 'Import' button to complete")}
                        </div>
                        <Button
                            onClick={fileName == '' ? handleClick : resetFile}
                            color="orange"
                            variant="outline"
                            className='dropFileBtn'
                        >
                            {fileName == '' ? t('Cookies from a file') : t('Delete')}
                        </Button>
                    </div>

                    <input
                        ref={fileInputRef}
                        id="file_picker"
                        type="file"
                        accept=".txt, .json"
                        onChange={(ev: any) => {
                            reader.readAsText(ev.target.files[0]);
                            setFileName(ev.target.files[0].name);
                        }}
                        style={{display: "none"}}
                    />
                </div>
            )}
            <div className={cls.cookiesInfo} data-cookie-error={cookieError} data-text-file-boolean={textFileBoolean}>
                {cookieError
                    ? <span>{t('Cookies data you’ve specified is empty or invalid')}.</span>
                    : <span>{t('JSON format. Cookies found')}: {countCookie}</span>
                }
            </div>

        </div>
    )
};