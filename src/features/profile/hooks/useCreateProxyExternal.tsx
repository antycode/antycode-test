
export const useCreateProxyExternal = (options: any) => {

    const proxyOptions = {
        host: '',
        link_rotate: '',
        login: '',
        password: '',
        port: 0,
        title: '',
        type: ''
    };
    if (options) {
        proxyOptions.host = options?.host;
        proxyOptions.link_rotate = options?.link_rotate;
        proxyOptions.login = options?.login;
        proxyOptions.password = options?.password;
        proxyOptions.port = options?.port;
        proxyOptions.title = options?.title;
        proxyOptions.type = options?.type;
    }
    return proxyOptions;
};
