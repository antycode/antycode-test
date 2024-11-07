import React from 'react';
import cls from './EditProfileReview.module.scss';
import clsx from "clsx";
import {ReactComponent as WindowsIcon} from "@/shared/assets/icons/windows.svg";
import {ReactComponent as LinuxIcon} from "@/shared/assets/icons/linux.svg";
import {ReactComponent as MacosIcon} from "@/shared/assets/icons/macos.svg";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

interface EditProfileReviewProps {
    profileDataReview: any,
    platformLabel: string
}

const EditProfileReview = (props: EditProfileReviewProps) => {
    const {profileDataReview, platformLabel} = props;

    const {t} = useTranslation();

    const platform = useSelector((state: any) => state.platformReducer.platform);

    return (
        <div className={cls.review}>
            <div className={cls.title}>
                <p>{t('Review')}</p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Name')}:</p>
                <p className={cls.reviewItemData}>{profileDataReview.profileName}</p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Status')}:</p>
                <p className={cls.reviewItemData}>{t(profileDataReview.profileStatus)}</p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Tags')}:</p>
                <p className={clsx(cls.reviewItemData, cls.reviewItemDataTagsUniq)}>
                    {profileDataReview.profileTags.map((item: string, index: number) => (
                        <div key={index} className={cls.tagItemWrapper}>
                            <p>{item}</p>
                        </div>
                    ))}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Folders')}:</p>
                <p className={clsx(cls.reviewItemData, cls.reviewItemDataTagsUniq)}>
                    {profileDataReview.profileFolders.map((item: any, index: number) => (
                        <div key={index} className={cls.tagItemWrapper}>
                            <p>{item.title}</p>
                        </div>
                    ))}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Site')}:</p>
                <p className={cls.reviewItemData}>{profileDataReview.profileSite}</p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Platform')}:</p>
                <div className={cls.reviewItemOsWrapper}>
                    {platformLabel === 'Windows' && (
                        <WindowsIcon />
                    )}
                    {platformLabel === 'Linux' && (
                        <LinuxIcon />
                    )}
                    {platformLabel === 'Macos' && (
                        <MacosIcon />
                    )}
                    <p className={clsx(cls.reviewItemData, cls.reviewItemDataOs, platform === 'Windows' ? cls.reviewItemDataOsWin : '')}>{platformLabel}</p>
                </div>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('User agent')}:</p>
                <p className={cls.reviewItemData}>{profileDataReview.profileUseragent}</p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Proxy')}:</p>
                <p className={cls.reviewItemData}>
                    {t(profileDataReview.profileProxyType).toUpperCase()}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('WebRTC')}:</p>
                <p className={cls.reviewItemData}>
                    {t(profileDataReview.profileWebRtc)}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Canvas')}:</p>
                <p className={cls.reviewItemData}>
                    {t(profileDataReview.profileCanvas)}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('WebGL')}:</p>
                <p className={cls.reviewItemData}>
                    {t(profileDataReview.profileWebGL)}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('WebGL info')}:</p>
                <p className={clsx(cls.reviewItemData, cls.reviewItemDataWebglInfo)}>
                    {t(profileDataReview.profileWebGLInfo)}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Clients Rects')}:</p>
                <p className={cls.reviewItemData}>
                    {t(profileDataReview.profileClientsRects)}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Timezone')}:</p>
                <p className={clsx(cls.reviewItemData, cls.reviewItemDataTimezone)}>
                    {profileDataReview.profileTimezone === 'Auto'
                        ? t(profileDataReview.profileTimezone)
                        : <>
                            <p>[{t(profileDataReview.profileTimezone.utc)}]</p>
                            <p>{t(profileDataReview.profileTimezone.label)}</p>
                        </>
                    }
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Language')}:</p>
                <p className={cls.reviewItemData}>
                    {t(profileDataReview.profileLanguage)}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Geolocation')}:</p>
                <p className={cls.reviewItemData}>
                    {profileDataReview.profileGeo === 'Auto'
                        ? t(profileDataReview.profileGeo)
                        : <>{profileDataReview.profileGeo.longitude}, {profileDataReview.profileGeo.latitude}</>
                    }
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Processor')}:</p>
                <p className={cls.reviewItemData}>
                    {profileDataReview.profileProcessor == '2' || profileDataReview.profileProcessor == '4' ?
                        (<>{t(profileDataReview.profileProcessor)} {t('cores-2-4.Cores')}</>) : false
                    }
                    {profileDataReview.profileProcessor == '6' || profileDataReview.profileProcessor == '8' || profileDataReview.profileProcessor == '12' || profileDataReview.profileProcessor == '16' ?
                        (<>{t(profileDataReview.profileProcessor)} {t('cores-another.Cores')}</>) : false
                    }
                    {profileDataReview.profileProcessor === 'Real' || profileDataReview.profileProcessor === 'Random' ? (
                        <>{t(profileDataReview.profileProcessor)}</>) : false
                    }
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Memory')}:</p>
                <p className={cls.reviewItemData}>
                    {profileDataReview.profileRam === 'Real' || profileDataReview.profileRam === 'Random'
                        ? (<>{t(profileDataReview.profileRam)}</>)
                        : (<>{t(profileDataReview.profileRam)} {t('GB')}</>)
                    }
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Screen')}:</p>
                <p className={cls.reviewItemData}>
                    {t(profileDataReview.profileScreen)}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Audio')}:</p>
                <p className={cls.reviewItemData}>
                    {t(profileDataReview.profileAudio)}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Media')}:</p>
                <p className={cls.reviewItemData}>
                    {profileDataReview.profileMedia === 'Real' || profileDataReview.profileMedia === 'Random'
                        ? t(profileDataReview.profileMedia)
                        : (<>{profileDataReview.profileMedia.microphone}/{profileDataReview.profileMedia.speaker}/{profileDataReview.profileMedia.camera} </>)
                    }
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Ports')}:</p>
                <p className={cls.reviewItemData}>
                    {t(profileDataReview.profilePorts)}
                </p>
            </div>
            <div className={cls.reviewItem}>
                <p className={cls.reviewItemTitle}>{t('Do not track')}:</p>
                <p className={cls.reviewItemData}>
                    {t(profileDataReview.profileIsDoNotTrack)}.
                </p>
            </div>
        </div>
    );
};

export default EditProfileReview;