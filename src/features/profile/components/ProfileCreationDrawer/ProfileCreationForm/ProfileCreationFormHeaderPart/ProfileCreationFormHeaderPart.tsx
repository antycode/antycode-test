import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Select } from '@/shared/components/Select/Select';
import { Input } from '@/shared/components/Input/Input';
import clsx from 'clsx';
import { TProfileCreationForm } from '../ProfileCreationForm';
import cls from '../ProfileCreationForm.module.scss';
import { useProfileInitData } from '@/features/profile/hooks/useProfileInitData';
import { SegmentedControl } from '@/shared/components/SegmentedControl/SegmentedControl';
import { InputCustom } from '@/shared/components/Input/InputCustom';
import { ReactComponent as ArrowsIcon } from '@/shared/assets/icons/arrows.svg';
import { ReactComponent as ReloadIcon } from '@/shared/assets/icons/reload.svg';
import React, { useEffect, useRef, useState } from 'react';
import { CookiesArea } from './CookiesArea';
import { ReactComponent as WindowsIcon } from '@/shared/assets/icons/windows.svg';
import { ReactComponent as MacosIcon } from '@/shared/assets/icons/macos.svg';
import { ReactComponent as LinuxIcon } from '@/shared/assets/icons/linux.svg';
import { ReactComponent as ArrowFilledDownIcon } from '@/shared/assets/icons/arrow-filled-down.svg';
import { ReactComponent as Cross1Icon } from '@/shared/assets/icons/cross1.svg';
import { ReactComponent as Cross3Icon } from '@/shared/assets/icons/cross3.svg';
import { ReactComponent as SearchIcon } from '@/shared/assets/icons/search.svg';
import { ReactComponent as CheckboxIcon } from '@/shared/assets/icons/checkbox.svg';
import { ReactComponent as CheckboxSelectedIcon } from '@/shared/assets/icons/checkbox-selected.svg';
import { useProfilesStore } from '@/features/profile/store';
import LoaderDotsWhite from '@/shared/assets/loaders/loadersDotsWhite/LoaderDotsWhite';
import { useSelector } from 'react-redux';
import { FolderIcon } from '@/shared/components/Folder/FolderIcon';

interface ProfileCreationFormHeaderPartProps {
  userAgent: string;
  setUserAgent: any;
  proxyHost: string;
  setProxyHost: React.Dispatch<React.SetStateAction<string>>;
  setProxyCreationFirstField: React.Dispatch<React.SetStateAction<boolean>>;
  profileDataReview: any;
  setProfileDataReview: React.Dispatch<React.SetStateAction<any>>;
  platformValue: string;
  setPlatformValue: React.Dispatch<React.SetStateAction<string>>;
  setPlatformLabel: React.Dispatch<React.SetStateAction<string>>;
  setProxyType: React.Dispatch<React.SetStateAction<string>>;
  proxyType: string;
  proxyError: string;
  setProxyError: React.Dispatch<React.SetStateAction<string>>;
  handleCheckProxyExternal: () => void;
  checkProxySuccess: boolean;
  isCheckingProxy: boolean;
  setAddProxyOption: React.Dispatch<React.SetStateAction<number | string>>;
  addProxyOption: number | string;
  allTags: string[];
  handleOpenAdvancedSettings: () => void;
  isOpenAdvancedSettings: boolean;
}

export const ProfileCreationFormHeaderPart = (props: ProfileCreationFormHeaderPartProps) => {
  const {
    userAgent,
    setUserAgent,
    proxyHost,
    setProxyHost,
    setProxyCreationFirstField,
    profileDataReview,
    setProfileDataReview,
    platformValue,
    setPlatformValue,
    setPlatformLabel,
    proxyError,
    setProxyError,
    setProxyType,
    proxyType,
    handleCheckProxyExternal,
    checkProxySuccess,
    isCheckingProxy,
    setAddProxyOption,
    addProxyOption,
    allTags,
    handleOpenAdvancedSettings,
    isOpenAdvancedSettings,
  } = props;

  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
    // getValues,
    // setValue
  } = useFormContext<TProfileCreationForm>();

  const { options, defaultValues } = useProfileInitData();
  const { configData, folders, selectedFolder } = useProfilesStore();

  const platform = useSelector((state: any) => state.platformReducer.platform);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTag, setSearchTag] = useState('');

  const [isDropdownFoldersOpen, setIsDropdownFoldersOpen] = useState<boolean>(false);
  const [selectedFolders, setSelectedFolders] = useState<any[]>([]);
  const [searchFolder, setSearchFolder] = useState('');

  let selectedProxy: any;

  const platformNameFind = () => {
    const platform = options.profilePlatformExternalOpt.find(
      (item: any) => item.value === platformValue,
    );
    return platform?.label;
  };

  const handleUserAgentWindows = (e: any) => {
    e.preventDefault();
    const userAgentsWindows = options.user_agent_windows;
    const randomIndex = Math.floor(Math.random() * userAgentsWindows.length);

    setUserAgent(userAgentsWindows[randomIndex]);
    setProfileDataReview({
      ...profileDataReview,
      profileUseragent: userAgentsWindows[randomIndex],
    });
  };
  const handleUserAgentMacos = (e: any) => {
    e.preventDefault();
    const userAgentsMacos = options.user_agent_macos;
    const randomIndex = Math.floor(Math.random() * userAgentsMacos.length);

    setUserAgent(userAgentsMacos[randomIndex]);
    setProfileDataReview({ ...profileDataReview, profileUseragent: userAgentsMacos[randomIndex] });
  };
  const handleUserAgentLinux = (e: any) => {
    e.preventDefault();
    const userAgentsLinux = options.user_agent_linux;
    const randomIndex = Math.floor(Math.random() * userAgentsLinux.length);

    setUserAgent(userAgentsLinux[randomIndex]);
    setProfileDataReview({ ...profileDataReview, profileUseragent: userAgentsLinux[randomIndex] });
  };

  const [proxyTypeAddProxyOption2, setProxyTypeAddProxyOption2] = useState<string>('');

  const handleDeleteAllTags = (event: any) => {
    event.stopPropagation();
    setProfileDataReview({ ...profileDataReview, profileTags: [] });
    setSelectedTags([]);
  };

  const handleDeleteAllFolders = (event: any) => {
    event.stopPropagation();
    setProfileDataReview({ ...profileDataReview, profileFolders: [] });
    setSelectedFolders([]);
  };

  const handleTagRemove = (e: any, item: string) => {
    e.stopPropagation();
    setProfileDataReview({
      ...profileDataReview,
      profileTags: profileDataReview.profileTags.filter((tag: string) => tag !== item),
    });
    setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== item));
  };

  const handleFolderRemove = (e: any, item: any) => {
    e.stopPropagation();
    setProfileDataReview({
      ...profileDataReview,
      profileFolders: profileDataReview.profileFolders.filter(
        (folder: any) => folder.external_id !== item.external_id,
      ),
    });
    setSelectedFolders(
      selectedFolders.filter((selectedFolder) => selectedFolder.external_id !== item.external_id),
    );
  };

  const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTagInputBlur(event);
    }
  };

  const handleTagInputBlur = (event: any) => {
    const inputTagValue = event.target.value.trim();
    if (inputTagValue !== '') {
      if (profileDataReview.profileTags.length < 10) {
        if (!profileDataReview.profileTags.includes(inputTagValue)) {
          setProfileDataReview({
            ...profileDataReview,
            profileTags: [...profileDataReview.profileTags, inputTagValue],
          });
          if (allTags.includes(inputTagValue)) {
            setSelectedTags([...selectedTags, inputTagValue]);
          }
        } else {
          console.log('The tag already exists!');
        }
      } else {
        console.log('Maximum tag limit reached!');
      }
      event.target.value = '';
    }
  };

  const handleAddTagCheckbox = (e: any, tag: string) => {
    e.stopPropagation();
    const tagValue = tag.trim();
    if (profileDataReview.profileTags.length < 10) {
      if (!profileDataReview.profileTags.includes(tagValue)) {
        setProfileDataReview({
          ...profileDataReview,
          profileTags: [...profileDataReview.profileTags, tagValue],
        });
      } else {
        console.log('The tag already exists!');
      }
    } else {
      console.log('Maximum tag limit reached!');
    }
  };

  const handleAddFolderCheckbox = (e: any, folder: any) => {
    e.stopPropagation();
    const folderValue = folder;
    if (!profileDataReview.profileFolders.includes(folderValue)) {
      setProfileDataReview({
        ...profileDataReview,
        profileFolders: [...profileDataReview.profileFolders, folderValue],
      });
    } else {
      console.log('The folder already exists!');
    }
  };

  const toggleDropdown = (e: any) => {
    e.stopPropagation();
    if (allTags.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const toggleDropdownFolders = (e: any) => {
    e.stopPropagation();
    if (folders.length > 0) {
      setIsDropdownFoldersOpen(!isDropdownFoldersOpen);
    }
  };

  const handleTagCheckboxChange = (e: any, tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
      handleTagRemove(e, tag);
    } else if (profileDataReview.profileTags.length < 10) {
      setSelectedTags([...selectedTags, tag]);
      handleAddTagCheckbox(e, tag);
    }
  };

  const handleFolderCheckboxChange = (e: any, folder: any) => {
    console.log('selectedFolders', selectedFolders);
    if (selectedFolders.includes(folder)) {
      setSelectedFolders(
        selectedFolders.filter(
          (selectedFolder) => selectedFolder.external_id !== folder.external_id,
        ),
      );
      handleFolderRemove(e, folder);
    } else {
      setSelectedFolders([...selectedFolders, folder]);
      handleAddFolderCheckbox(e, folder);
    }
  };

  const getFilteredTags = () => {
    return allTags.filter((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()));
  };

  const getFilteredFolders = () => {
    return folders.filter((folder) =>
      folder.title.toLowerCase().includes(searchFolder.toLowerCase()),
    );
  };

  const dropdownFoldersRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutsideFolders = (event: MouseEvent) => {
      if (
        dropdownFoldersRef.current &&
        !dropdownFoldersRef.current.contains(event.target as HTMLElement)
      ) {
        setIsDropdownFoldersOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutsideFolders);

    return () => {
      document.removeEventListener('click', handleClickOutsideFolders);
    };
  }, []);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as HTMLElement)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (addProxyOption == 2) {
      setProfileDataReview({ ...profileDataReview, profileProxyType: proxyTypeAddProxyOption2 });
    } else if (addProxyOption == 0) {
      setProfileDataReview({ ...profileDataReview, profileProxyType: 'No proxy' });
    } else if (addProxyOption == 1) {
      setProfileDataReview({ ...profileDataReview, profileProxyType: proxyType });
    }
  }, [addProxyOption]);

  useEffect(() => {
    if (selectedFolder !== 'all') {
      const fol = folders.find((i: any) => i.external_id === selectedFolder);
      setSelectedFolders([fol, ...selectedFolders]);
    }
  }, []);

  let option;
  return (
    <div className={cls.formPage}>
      <div className={cls.row1}>
        <div className={clsx(cls.field, cls.inputProfileNameWidth)}>
          <div className={clsx(cls.controlsHeaderCustom, cls.width100Percent)}>
            <div className={cls.width100Percent}>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(e) => {
                      setProfileDataReview({
                        ...profileDataReview,
                        profileName: (e.target as HTMLInputElement).value,
                      });
                      field.onChange((e.target as HTMLInputElement).value);
                    }}
                    className={cls.profileInput}
                    placeholder={t('creationProfile.Name')}
                    error={errors.title?.message && t(`${errors.title?.message}`)}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className={clsx(cls.field, cls.selectStatusWidth)}>
          <div className={clsx(cls.controlsHeaderCustom, cls.width100Percent)}>
            <div className={cls.width100Percent}>
              <Controller
                control={control}
                name="status_external_id"
                render={({ field }) => (
                  <Select
                    ref={field.ref}
                    name={field.name}
                    placeholder={t('Status')}
                    getOptionLabel={(o) => t(o.label)}
                    options={options.profileStatusExternalOpt}
                    value={options.profileStatusExternalOpt?.find(
                      (c: any) => c.value === field.value,
                    )}
                    onChange={(option) => {
                      setProfileDataReview({ ...profileDataReview, profileStatus: option?.label });
                      field.onChange(option?.value);
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className={clsx(cls.field, cls.selectPlatformWidth)}>
          <div className={clsx(cls.controlsHeaderCustom, cls.width100Percent)}>
            <div className={cls.width100Percent}>
              <Controller
                control={control}
                name="profile_type"
                render={({ field }) => (
                  <Select
                    className={cls.selectPlatform}
                    placeholder={t('Platform')}
                    ref={field.ref}
                    name={field.name}
                    getOptionLabel={(o: any) => {
                      return (
                        <div className={cls.appLabel}>
                          <span>{o.icon}</span>
                          <p className={cls.appLabelText}>{o.label}</p>
                        </div>
                      ) as unknown as string;
                    }}
                    options={options.appExternalOpt}
                    value={options.appExternalOpt.find((c: any) => c.value === field.value)}
                    onChange={(option) => {
                      setProfileDataReview({ ...profileDataReview, profileSite: option?.label });
                      field.onChange(option?.value);
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={cls.tagsFolders}>
        <div className={clsx(cls.field, cls.selectTagsWidth)} ref={dropdownRef}>
          <div className={clsx(cls.controlsHeaderCustom, cls.width100Percent)}>
            <div className={cls.width100Percent}>
              <div className={cls.customTagsContainer}>
                <div className={cls.customTagsLeftSide}>
                  <div className={cls.tagItemsWrapper}>
                    {profileDataReview.profileTags.map((item: string, index: number) => (
                      <div key={index} className={cls.tagItemWrapper}>
                        <p>{item}</p>
                        <Cross3Icon
                          width={11}
                          height={11}
                          className={cls.tagItemRemove}
                          onClick={(e) => handleTagRemove(e, item)}
                        />
                      </div>
                    ))}
                  </div>
                  <input
                    className={cls.inputTags}
                    type="text"
                    placeholder={t('Tags')}
                    onBlur={handleTagInputBlur}
                    onKeyDown={handleTagInputKeyDown}
                  />
                </div>
                <div className={cls.customTagsRightSide}>
                  {profileDataReview.profileTags.length > 0 && (
                    <Cross1Icon
                      width={10}
                      height={10}
                      className={cls.tagItemsRemove}
                      onClick={(event) => handleDeleteAllTags(event)}
                    />
                  )}
                  <ArrowFilledDownIcon
                    width={14}
                    height={10}
                    className={cls.openDropDown}
                    onClick={(e) => toggleDropdown(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          {isDropdownOpen && (
            <div className={cls.dropdown}>
              <div className={cls.searchTagsWrapper}>
                <input
                  className={cls.inputSearchTags}
                  type="text"
                  placeholder={t('Find tags')}
                  onChange={(event) => setSearchTag(event.target.value)}
                />
                <SearchIcon />
              </div>
              <div className={cls.dropdownContent}>
                {getFilteredTags().map((tag, index) => (
                  <div
                    key={index}
                    className={cls.dropdownItem}
                    onClick={(e) => handleTagCheckboxChange(e, tag)}>
                    <label htmlFor={`tag-${index}`} className={cls.labelTag}>
                      {tag}
                    </label>
                    <div className={cls.customCheckbox}>
                      {selectedTags.includes(tag) ? (
                        <CheckboxSelectedIcon className={cls.checkboxSelected} />
                      ) : (
                        <CheckboxIcon />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={cls.foldersContainer}>
          <div className={clsx(cls.field, cls.selectTagsWidth)} ref={dropdownFoldersRef}>
            <div className={clsx(cls.controlsHeaderCustom, cls.width100Percent)}>
              <div className={cls.width100Percent}>
                <div className={cls.customTagsContainer}>
                  <div className={cls.customTagsLeftSide}>
                    <div className={cls.tagItemsWrapper}>
                      {profileDataReview.profileFolders.map((item: any, index: number) => (
                        <div key={index} className={cls.tagItemWrapper}>
                          <p>{item.title}</p>
                          <Cross3Icon
                            width={11}
                            height={11}
                            className={cls.tagItemRemove}
                            onClick={(e) => handleFolderRemove(e, item)}
                          />
                        </div>
                      ))}
                    </div>
                    <input
                      className={cls.inputTags}
                      type="text"
                      disabled
                      placeholder={t('Folders')}
                    />
                  </div>
                  <div className={cls.customTagsRightSide}>
                    {profileDataReview.profileFolders.length > 0 && (
                      <Cross1Icon
                        width={10}
                        height={10}
                        className={cls.tagItemsRemove}
                        onClick={(event) => handleDeleteAllFolders(event)}
                      />
                    )}
                    <ArrowFilledDownIcon
                      width={14}
                      height={10}
                      className={cls.openDropDown}
                      onClick={(e) => toggleDropdownFolders(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {isDropdownFoldersOpen && (
              <div className={cls.dropdown}>
                <div className={cls.searchTagsWrapper}>
                  <input
                    className={cls.inputSearchTags}
                    type="text"
                    placeholder={t('Find folders')}
                    onChange={(event) => setSearchFolder(event.target.value)}
                  />
                  <SearchIcon />
                </div>
                <div className={cls.dropdownContent}>
                  {getFilteredFolders().map((folder, index) => (
                    <div
                      key={index}
                      className={cls.dropdownItem}
                      onClick={(e) => handleFolderCheckboxChange(e, folder)}>
                      <div className={cls.folderItemWrapper}>
                        <FolderIcon color={folder.color} />
                        <label htmlFor={`folder-${index}`} className={cls.labelFolder}>
                          {folder.title}
                        </label>
                      </div>
                      <div className={cls.customCheckbox}>
                        {selectedFolders.includes(folder) ? (
                          <CheckboxSelectedIcon className={cls.checkboxSelected} />
                        ) : (
                          <CheckboxIcon />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={cls.mainTitle}>{t('System')}</div>
      <div className={cls.userAgentWrapper}>
        <div className={cls.field}>
          <div className={cls.controlsHeaderCustom}>
            <div className={cls.profileUseragentOsWrapper}>
              <Controller
                control={control}
                name="platform_external_id"
                render={({ field }) => (
                  <SegmentedControl
                    name={field.name}
                    value={platformValue}
                    onChange={(newValue) => {
                      console.log('newValue', newValue);
                      setPlatformValue(newValue);
                      field.onChange(newValue);
                      const optionPlatform = options.profilePlatformExternalOpt.find(
                        (platform: any) => {
                          return platform.value === newValue;
                        },
                      );
                      setPlatformLabel(optionPlatform.label);
                      if (optionPlatform) {
                        if (optionPlatform.label === 'Windows') {
                          setUserAgent(defaultValues.user_agent_windows);
                          setProfileDataReview({
                            ...profileDataReview,
                            profileUseragent: defaultValues.user_agent_windows,
                          });
                        } else if (optionPlatform.label === 'Macos') {
                          setUserAgent(defaultValues.user_agent_macos);
                          setProfileDataReview({
                            ...profileDataReview,
                            profileUseragent: defaultValues.user_agent_macos,
                          });
                        } else if (optionPlatform.label === 'Linux') {
                          setUserAgent(defaultValues.user_agent_linux);
                          setProfileDataReview({
                            ...profileDataReview,
                            profileUseragent: defaultValues.user_agent_linux,
                          });
                        }
                      }
                    }}
                    options={options.profilePlatformExternalOpt}
                    getOptionLabel={(o: any) => {
                      return (
                        <div className={cls.labelWrapper}>
                          {o.label === 'Windows' ? <WindowsIcon /> : false}
                          {o.label === 'Macos' ? <MacosIcon /> : false}
                          {o.label === 'Linux' ? <LinuxIcon /> : false}
                          <p
                            className={clsx(
                              cls.labelText,
                              platform === 'Windows' ? cls.labelTextWin : '',
                            )}>
                            {t(o.label)}
                          </p>
                        </div>
                      ) as unknown as string;
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className={cls.controlsHeaderCustom}>
          <Controller
            control={control}
            name="platform_external_id"
            render={({ field }) => (
              <>
                {platformNameFind() === 'Windows' && (
                  <Controller
                    control={control}
                    name="user_agent_windows"
                    render={({ field }) => (
                      <div className={cls.userAgentWrapper}>
                        <div className={cls.profileInputWrapper}>
                          <button
                            className={cls.reloadButton}
                            onClick={(e) => handleUserAgentWindows(e)}>
                            <ReloadIcon />
                          </button>
                          <Input
                            {...field}
                            value={userAgent}
                            onChange={(e) => {
                              setProfileDataReview({
                                ...profileDataReview,
                                profileUseragent: (e.target as HTMLInputElement).value,
                              });
                              setUserAgent((e.target as HTMLInputElement).value);
                            }}
                            className={clsx(cls.profileInput, cls.profileInputUserAgent)}
                            placeholder={t('User agent')}
                            error={errors.user_agent_windows?.message}
                          />
                        </div>
                      </div>
                    )}
                  />
                )}
                {platformNameFind() === 'Macos' && (
                  <Controller
                    control={control}
                    name="user_agent_macos"
                    render={({ field }) => (
                      <div className={cls.userAgentWrapper}>
                        <div className={cls.profileInputWrapper}>
                          <button
                            className={cls.reloadButton}
                            onClick={(e) => handleUserAgentMacos(e)}>
                            <ReloadIcon />
                          </button>
                          <Input
                            {...field}
                            value={userAgent}
                            onChange={(e) => {
                              setProfileDataReview({
                                ...profileDataReview,
                                profileUseragent: (e.target as HTMLInputElement).value,
                              });
                              setUserAgent((e.target as HTMLInputElement).value);
                            }}
                            className={clsx(cls.profileInput, cls.profileInputUserAgent)}
                            placeholder={t('User agent')}
                            error={errors.user_agent_macos?.message}
                          />
                        </div>
                      </div>
                    )}
                  />
                )}
                {platformNameFind() === 'Linux' && (
                  <Controller
                    control={control}
                    name="user_agent_linux"
                    render={({ field }) => (
                      <div className={cls.userAgentWrapper}>
                        <div className={cls.profileInputWrapper}>
                          <button
                            className={cls.reloadButton}
                            onClick={(e) => handleUserAgentLinux(e)}>
                            <ReloadIcon />
                          </button>
                          <Input
                            {...field}
                            value={userAgent}
                            onChange={(e) => {
                              setProfileDataReview({
                                ...profileDataReview,
                                profileUseragent: (e.target as HTMLInputElement).value,
                              });
                              setUserAgent((e.target as HTMLInputElement).value);
                            }}
                            className={clsx(cls.profileInput, cls.profileInputUserAgent)}
                            placeholder={t('User agent')}
                            error={errors.user_agent_linux?.message}
                          />
                        </div>
                      </div>
                    )}
                  />
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className={cls.mainTitle}>{t('Proxy')}</div>
      <div className={cls.proxyWrapper}>
        <div className={clsx(cls.field, cls.fieldBottom)}>
          <div className={cls.controlsProxyCustom}>
            <Controller
              control={control}
              name="proxy_external_value"
              render={({ field }) => (
                <div className={cls.wrapperProxyOptions}>
                  <SegmentedControl
                    name={field.name}
                    value={field.value}
                    className={cls.segmentedControlCustom}
                    onChange={(newValue: any) => {
                      setAddProxyOption(newValue);
                      newValue == 1
                        ? setProxyCreationFirstField(true)
                        : setProxyCreationFirstField(false);
                      field.onChange(newValue);
                    }}
                    options={options.profileProxyOpt}
                    getOptionLabel={(o) => t(o.label)}
                  />
                  {addProxyOption == 1 && (
                    <div className={clsx(cls.optionsForm, cls.optionsFormProxyCustom)}>
                      <Controller
                        control={control}
                        name="proxy_external_options"
                        render={({ field }) => (
                          <div className={cls.wrapperProxyForm}>
                            <InputCustom
                              title="Protocol"
                              renderComponent={
                                <div className={cls.wrapperProtocols}>
                                  <div
                                    className={clsx(cls.wrapperRound, {
                                      [cls.roundActive]: field.value.type === 'http',
                                    })}
                                    onClick={() => {
                                      field.onChange({
                                        ...field.value,
                                        type: 'http',
                                      });
                                      setProfileDataReview({
                                        ...profileDataReview,
                                        profileProxyType: 'http',
                                      });
                                      setProxyType('http');
                                    }}>
                                    <div className={cls.roundText}>HTTP(S)</div>
                                  </div>
                                  <div
                                    className={clsx(cls.wrapperRound, {
                                      [cls.roundActive]: field.value.type === 'socks5',
                                    })}
                                    onClick={() => {
                                      field.onChange({
                                        ...field.value,
                                        type: 'socks5',
                                      });
                                      setProfileDataReview({
                                        ...profileDataReview,
                                        profileProxyType: 'socks5',
                                      });
                                      setProxyType('socks5');
                                    }}>
                                    <div className={cls.roundText}>SOCKS5</div>
                                  </div>
                                  <div
                                    className={clsx(cls.wrapperRound, {
                                      [cls.roundActive]: field.value.type === 'socks4',
                                    })}
                                    onClick={() => {
                                      field.onChange({
                                        ...field.value,
                                        type: 'socks4',
                                      });
                                      setProfileDataReview({
                                        ...profileDataReview,
                                        profileProxyType: 'socks4',
                                      });
                                      setProxyType('socks4');
                                    }}>
                                    <div className={cls.roundText}>SOCKS4</div>
                                  </div>
                                  <div
                                    className={clsx(cls.wrapperRound, {
                                      [cls.roundActive]: field.value.type === 'ssh',
                                    })}
                                    onClick={() => {
                                      field.onChange({
                                        ...field.value,
                                        type: 'ssh',
                                      });
                                      setProfileDataReview({
                                        ...profileDataReview,
                                        profileProxyType: 'ssh',
                                      });
                                      setProxyType('ssh');
                                    }}>
                                    <div className={cls.roundText}>SSH</div>
                                  </div>
                                </div>
                              }
                            />
                            <div className={cls.inputProxyFormatCustomWrapper}>
                              <div className={cls.inputProxyFormatCustom}>
                                <InputCustom
                                  {...field}
                                  className={cls.inputUniq}
                                  title="Proxy"
                                  inputType
                                  inputValue={proxyHost}
                                  placeholder={'Host:Port:Login:Password'}
                                  handleInput={(e) => {
                                    const proxyValue = e.target.value;
                                    setProxyHost(() => e.target.value);
                                    const [host, port, login, password] = proxyValue.split(':');
                                    const proxy = {
                                      host,
                                      port: parseInt(port, 10),
                                      login,
                                      password,
                                    };
                                    field.onChange({
                                      ...field.value,
                                      host: proxy.host,
                                      port: proxy.port,
                                      login: proxy.login,
                                      password: proxy.password,
                                    });
                                    proxyValue.length === 0 ? setProxyError('') : false;
                                  }}
                                />
                                <button
                                  className={cls.formatButton}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCheckProxyExternal();
                                  }}>
                                  {isCheckingProxy ? (
                                    <LoaderDotsWhite />
                                  ) : (
                                    <div className={cls.checkProxyBtn}>
                                      <ArrowsIcon
                                        className={cls.formatButtonIcon}
                                        width={23}
                                        height={15}
                                      />
                                      <p>{t('Check')}</p>
                                    </div>
                                  )}
                                </button>
                              </div>
                              <div
                                className={cls.wrapperProxyBottom}
                                data-check-proxy-success={checkProxySuccess}
                                data-proxy-error={proxyError !== ''}>
                                {proxyError === 'error' && (
                                  <div className={cls.errorButton}>
                                    <div className={cls.errorText}>{t('accStatuses.Error')}</div>
                                  </div>
                                )}
                                {proxyError === 'success' && (
                                  <div className={cls.successButton}>
                                    <div className={cls.successText}>{t('Success')}</div>
                                  </div>
                                )}
                                {proxyError === 'used' && (
                                  <div className={cls.successButton}>
                                    <div className={cls.successText}>
                                      {t('Proxy already in use')}
                                    </div>
                                  </div>
                                )}
                                {proxyError === 'incorrect' && (
                                  <div className={cls.errorButton}>
                                    <div className={cls.errorText}>
                                      {t('Input params are incorrect')}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <InputCustom
                              {...field}
                              className={clsx(cls.inputGreenBorder, cls.inputProxyCustom)}
                              title="Link to change IP"
                              inputType
                              inputValue={field.value.link_rotate}
                              placeholder={t('Link to change IP')}
                              handleInput={(e) =>
                                field.onChange({
                                  ...field.value,
                                  link_rotate: e.target.value,
                                })
                              }
                            />
                            <InputCustom
                              {...field}
                              className={clsx(cls.inputGreenBorder, cls.inputProxyCustom)}
                              title={t('Proxy name')}
                              inputType
                              inputValue={field.value.title}
                              placeholder={t('Proxy name')}
                              handleInput={(e) =>
                                field.onChange({ ...field.value, title: e.target.value })
                              }
                            />
                          </div>
                        )}
                      />
                    </div>
                  )}
                  {addProxyOption == 2 && (
                    <div className={cls.optionsForm}>
                      <Controller
                        control={control}
                        name="proxy_external_id"
                        render={({ field }) => (
                          <div className={cls.chooseProxySelect}>
                            <InputCustom
                              title={t('Proxy name')}
                              renderComponent={
                                <Select
                                  className={cls.select}
                                  placeholder={t('Choose Proxy')}
                                  ref={field.ref}
                                  name={field.name}
                                  getOptionLabel={(o) => t(o.label)}
                                  options={options.profileProxyExternalOpt}
                                  value={options.profileProxyExternalOpt.find(
                                    (c: any) => c.value === field.value,
                                  )}
                                  onChange={(option) => {
                                    selectedProxy = configData.proxies?.find(
                                      (proxy: any) => proxy.external_id === option?.value,
                                    );
                                    setProxyTypeAddProxyOption2(selectedProxy.type);
                                    setProfileDataReview({
                                      ...profileDataReview,
                                      profileProxyType: selectedProxy.type,
                                    });
                                    field.onChange(option?.value);
                                  }}
                                />
                              }
                            />
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>
      <div className={cls.mainTitle}>{t('Cookie')}</div>
      <div className={cls.wrapperCookieAndNote}>
        <div className={cls.wrapperCookie}>
          <Controller
            control={control}
            name="cookies"
            render={({ field }) => <CookiesArea {...field} />}
          />

          {/*<div className={cls.loginOptions}>*/}
          {/*    <Controller*/}
          {/*        control={control}*/}
          {/*        name="login"*/}
          {/*        render={({field}) => (*/}
          {/*            <InputCustom*/}
          {/*                title='Login'*/}
          {/*                inputType*/}
          {/*                inputValue={field.value}*/}
          {/*                handleInput={field.onChange}*/}
          {/*            />*/}
          {/*        )}/>*/}
          {/*    <Controller*/}
          {/*        control={control}*/}
          {/*        name="password"*/}
          {/*        render={({field}) => (*/}
          {/*            <InputCustom*/}
          {/*                title='Password'*/}
          {/*                inputType*/}
          {/*                inputValue={field.value}*/}
          {/*                handleInput={field.onChange}*/}
          {/*            />*/}
          {/*        )}/>*/}
          {/*    <Controller*/}
          {/*        control={control}*/}
          {/*        name="token"*/}
          {/*        render={({field}) => (*/}
          {/*            <InputCustom*/}
          {/*                title='Token'*/}
          {/*                inputType*/}
          {/*                inputValue={field.value}*/}
          {/*                handleInput={field.onChange}*/}
          {/*            />*/}
          {/*        )}/>*/}
          {/*</div>*/}
        </div>
        <div className={cls.noteWrapper}>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <Input
                {...field}
                className={cls.inputGreenBorder}
                placeholder={t('Notes')}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <div
        onClick={handleOpenAdvancedSettings}
        className={clsx(cls.mainTitle, cls.mainTitleWithIcon, {
          [cls.mainTitleOpen]: isOpenAdvancedSettings,
        })}>
        {t('Advanced settings')}
        <ArrowFilledDownIcon width={14} height={14} />
      </div>
    </div>
  );
};
