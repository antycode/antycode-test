// Import dotenv for environment variables
import dotenv from "dotenv";

dotenv.config()

// Interface for fetch config
interface IFetchConfig {
    baseURL: string | undefined;
    autoregURL: string | undefined;
    antiToken: string | undefined;
    antiType: string | undefined;
    antiCustomerToken: string | undefined;
};

// const antiCustomerToken: any = localStorage.getItem('token');
const persistTokenString: any = localStorage.getItem('persist:token');
const antiCustomerToken: any = persistTokenString ? JSON.parse(persistTokenString).token.slice(1, -1) : '';

const fetchConfig: IFetchConfig = {
    baseURL: import.meta.env.VITE_BASE_URL || 'https://api.stage.anty-code.com/api/v10',
    autoregURL: import.meta.env.VITE_AUTOREG_URL || 'https://api-reg.affproxy.com',
    antiToken: import.meta.env.VITE_ANTI_TOKEN || '830f502c3f02763ad1e8a918c85179357c0ed8b28266dac19150aa3ab593da45',
    antiType: import.meta.env.VITE_ANTI_TYPE || 'test',
    antiCustomerToken: antiCustomerToken
};
const updateFetchConfig = (payload: Partial<IFetchConfig>) => {
    console.log('process.env.BASE_URL', import.meta.env.VITE_BASE_URL)
    Object.assign(fetchConfig, payload);
};

export {updateFetchConfig, fetchConfig}
