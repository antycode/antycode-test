export interface Team {
    nickname: string
    external_id: string,
    date_added: string,
    position_external_id: string,
    is_can_transfer_proxy: boolean,
    is_can_transfer_profile: boolean,
    is_confirmed: boolean,
    is_active_tariff: boolean,
    limits: Limits,
    used: Used,
    self_used: SelfUsed
}

export interface Limits {
    total_profile: number,
    total_proxy: number,
    total_auto_reg_account: number,
    total_profile_template: number,
    total_auto_reg_account_template: number,
    total_farm_account_template: number
}

export interface Used {
    total_profile: number,
    total_proxy: number,
    total_auto_reg_account: number,
    total_profile_template: number,
    total_auto_reg_account_template: number,
    total_farm_account_template: number
}

export interface SelfUsed {
    total_profile: number,
    total_proxy: number,
    total_auto_reg_account: number,
    total_profile_template: number,
    total_auto_reg_account_template: number,
    total_farm_account_template: number
}
