import { ILoadOptionsFunctions, INodePropertyOptions } from "n8n-workflow";

interface INetgsmHeaderResponse {
  headers: {
    code: string;
    description: string;
    msgheaders: string[];
  };
}


export const loadOptions = {
	async listHeaders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		const headerResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'netgsmApi', {
			method: 'GET',
			url: 'https://api.netgsm.com.tr/sms/rest/v2/msgheader',
		}) as INetgsmHeaderResponse;

        

		const returnData: INodePropertyOptions[] = headerResponse.headers.msgheaders.map(
			(smsheaders) => ({
				name: "Header",
				value: smsheaders,
			})
		);

		return returnData;
	},
};