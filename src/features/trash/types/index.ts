
export interface Profile {
    external_id: string,
    created_at: string,
    title: string,
    profile_type: string,
    cookies: string,
    tags: string[],
    user_agent: string,
    login: string,
    password: string,
    token: string,
    custom_flags: string,
    note: string,
    json: JSON | null,
    is_do_not_track: boolean,
    ports: number[],
    profile_media: null | ProfileMedia,
    profile_geolocation: null | ProfileGeolocationExternalId,
    platform_external_id: string,
    profile_proxy_external_id: null | string,
    profile_webrtc_external_id: null | string | number,
    profile_canvas_external_id: string,
    profile_webgl_external_id: string,
    profile_webgl_info_external_id: null | string,
    profile_clientrects_external_id: string,
    profile_audio_external_id: string,
    profile_timezone_external_id: null | string,
    profile_language_external_id: null | string,
    profile_processor_external_id: null | string,
    profile_ram_external_id: null | string,
    profile_screen_external_id: null | string,
    profile_status_external_id: null | string,
    folders: string[]
}

export interface User {
    external_id: string,
    date_finish: string,
    is_active: boolean,
    language_code: string,
    title: string,
    token: string
}

export interface ProfileMedia {
    microphone: 0 | 1 | 2 | 3,
    speaker: 0 | 1 | 2 | 3,
    camera: 0 | 1 | 2 | 3
}

export interface ProfileGeolocationExternalId {
    longitude: string,
    latitude: string,
    precision: string
}

export enum ProfStatus {
    InProgress = 'in-progress',
    NotActive = 'not-active',
    ActivationPending = 'on-confirmation',
    Active = 'success',
    Error = 'error',
}

export interface IProfileProxySettings {
    value?: string,
    label?: string,
    external_id?: string,
    title: string,
    host: string,
    port: any,
    link_rotate: string,
    login: string,
    password: string,
    type: 'socks5' | 'http' | 'socks4' | 'ssh'
}
