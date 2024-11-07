export function useBuyProxyData(selectedGeo: { [p: number]: string }) {
    return [
        {
            id: 1,
            titles: {
                'Ukraine': '3 days - $10',
                'Poland': '3 days - $15',
            },
            list: [
                'Unlimited traffic',
                'Private channel',
                'Speed: up to 30Mb/sec',
                'Changing IP via link or telegram bot',
                'SOCKS5/HTTP',
                'Connecting to a proxy without VPN'
            ],
            geo: ['Ukraine', 'Poland']
        },
        {
            id: 2,
            titles: {
                'Ukraine': '35 days - $45',
                'Poland': '35 days - $60',
            },
            list: [
                'Unlimited traffic',
                'Private channel',
                'Speed: up to 30Mb/sec',
                'Changing IP via link or telegram bot',
                'SOCKS5/HTTP',
                'Connecting to a proxy without VPN'
            ],
            geo: ['Ukraine', 'Poland']
        },
        {
            id: 3,
            titles: {
                'Ukraine': '7 days - $20',
                'Poland': '7 days - $25',
            },
            list: [
                'Unlimited traffic',
                'Private channel',
                'Speed: up to 30Mb/sec',
                'Changing IP via link or telegram bot',
                'SOCKS5/HTTP',
                'Connecting to a proxy without VPN'
            ],
            geo: ['Ukraine', 'Poland']
        }
    ].map(option => ({
        ...option,
        title: option.titles[selectedGeo[option.id] as keyof typeof option.titles || 'Ukraine']
    }));
}