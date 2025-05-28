import { ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult } from "n8n-workflow";

interface INetgsmHeaderResponse {
  headers: {
    code: string;
    description: string;
    msgheaders: string[];
  };
}

export const listheaders = {
	async listHeaders(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
		const headerResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'netgsmApi', {
			method: 'GET',
			url: 'https://api.netgsm.com.tr/sms/rest/v2/msgheader',
		}) as INetgsmHeaderResponse;

        

		const returnData: INodeListSearchItems[] = headerResponse.headers.msgheaders.map(
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