import { ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult } from "n8n-workflow";

interface INetgsmHeaderResponse {
  
    code: string;
    description: string;
    msgheaders: string[];
  
}


export const listSearch = {
	async listHeaders(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
		const headerResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'netgsmApi', {
			method: 'GET',
			url: 'https://api.netgsm.com.tr/sms/rest/v2/msgheader',
		}) as INetgsmHeaderResponse;

        console.log(headerResponse);

		const returnData: INodeListSearchItems[] = headerResponse.msgheaders.map(
			(smsheaders) => ({
				name: "Header",
				value: smsheaders,
			})
		);


		return {
			results: returnData,
		};
	},
};