import { ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult } from "n8n-workflow";

interface INetgsmHeaderResponse {
  
    code: string;
    description: string;
    msgheaders: string[];
  
}


export const listSearch = {
	async listHeaders(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'netgsmApi', {
			method: 'GET',
			url: 'https://api.netgsm.com.tr/sms/rest/v2/msgheader',
		});        
        const headerResponse = response as INetgsmHeaderResponse;
		if (!headerResponse.msgheaders || !Array.isArray(headerResponse.msgheaders)) {
			throw new Error('Unexpected response format from Netgsm API');
		}

		const returnData: INodeListSearchItems[] = headerResponse.msgheaders.map(
			(smsheaders) => ({
				name: smsheaders,
				value: smsheaders,
			})
		);


		return {
			results: returnData,
		};
	},
};