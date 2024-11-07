import {Proxy} from "@/features/proxy/types";

const record = {
    "external_id": "11988f0a-8178-4a40-800d-bc2697b39e8a",
    "title": "Socks 2",
    "host": "connect-ua.z-proxy.com",
    "port": 7448,
    "link_rotate": "https:\/\/z-proxy.com\/r\/\/?h=9abagu",
    "login": "z_q4bh4vpn",
    "type": "socks5",
    "password": "l1ts_lvczw",
    "speed": 18,
    "date_updated_speed": "2023-08-11 15:35:02",
    "ip": "46.211.163.231",
    "country_code": "ua"
}
let numbersRange = Array.from(Array(310).keys());
export const initialProxies: Proxy[] = numbersRange.map(number => {
    return {
        ...record,
        title: `Proxy ${number + 1}`,
        country_code: number % 2 ? 'ua' : 'pl',
        speed: number,
        external_id: `external_id_${number}`
    }
})
