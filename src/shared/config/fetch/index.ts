import { env } from "process";
import { fetchConfig } from "./config";

interface IFetchData {
	method: string;
	url: string;
	data?: any;
	team?: any;
  customBaseURL?:string;
};
interface IFetchDataResponse {
	is_success:boolean,
	errors?:{message:string,code:number}[],
	errorMessage?:string,
	errorCode?:number,
	data?: any;
	external_id?: any;
  settings?: any;
  headers?: Record<string, string>;
};
const colors = [['#0054fc','#548dff'],['#208900', '#34d300'] ];

export async function fetchData({ method, url, data = {}, team, customBaseURL }: IFetchData):never | Promise<IFetchDataResponse> {
  const fullUrl = customBaseURL ? `${customBaseURL}${url}` : `${fetchConfig.baseURL}${url}`;

	let headers: { [key: string]: string } = {
			'Content-Type': 'application/json',
			'Anty-Token': fetchConfig.antiToken || '',
			'Anty-Type': fetchConfig.antiType || '',
		}
		if(!['/customer/login'].includes(url) && !['/customer/create'].includes(url) && !['/customer/forget-password'].includes(url) && !['/customer/is-free-nickname'].includes(url)){
			  headers['Anty-Customer-Token'] = fetchConfig.antiCustomerToken || '';
		}
		if(team && !['/customer/is-free-nickname'].includes(url)) {
			headers['Workspace-External-Id'] = team;
		}
    try {
 	    const response = await fetch(fullUrl, {
			method, // GET, POST, PUT, DELETE, PATCH
			mode: 'cors', // no-cors, cors, same-origin
			cache: 'no-cache', // default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, same-origin, omit
			headers,
			body: (method === 'GET' || method === 'DELETE') ? null : JSON.stringify(data),
			redirect: 'manual', // manual, follow, error
			referrerPolicy: 'no-referrer', // no-referrer, client
		});
    const responseData = await response.json();

		prepareLogsAndErrors(responseData, method, url)
		return responseData
	}catch(error){
		if (error instanceof Error) {
			prepareLogsAndErrors({is_success: false, errorMessage: `${error.message} ${error.stack}`, errorCode: 0}, method, url)
		}
		throw error
	}
}

const prepareLogsAndErrors = (data:IFetchDataResponse, method:string, url:string)=>{
	const backgroundColors = colors[Math.floor(Math.random() * colors.length)];
	if(data?.errors) {
		data.errorMessage =  data?.errors[0]?.message;
		data.errorCode =  data?.errors[0]?.code
	}
 	console.log(`%c API request ${method} ${url} `, `background: ${backgroundColors[0]};  color: #fff`)
 	if(data.errorMessage){
		console.log(`%c API  error ${data.errorMessage} ${data.errorCode}`, `background: #ff9b9b;  color: #fff`, data)
	}else{
		console.log(`%c API response ${method} ${url} `, `background: ${backgroundColors[1]};  color: #fff`, data)
	}

}
