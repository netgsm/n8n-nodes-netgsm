import type {
	ICredentialType,
	INodeProperties,    
	IAuthenticateGeneric,
	ICredentialTestRequest,
	IHttpRequestHelper,
	ICredentialDataDecryptedObject,
	IDataObject,
} from 'n8n-workflow';

export class NetgsmApi implements ICredentialType {
	name = 'netgsmApi';

	displayName = 'Netgsm API';

	documentationUrl = 'https://www.netgsm.com.tr/dokuman/';

	properties: INodeProperties[] = [
		{
			displayName: 'Netgsm API Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Netgsm API Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
	];	
	
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '={{$auth.authorization}}',
			},
		},
	};

	test: ICredentialTestRequest | undefined = {
		request: {
			baseURL: 'https://api.netgsm.com.tr/sms/rest/v2',
			url: '/msgheader',
		},
	};


	async preAuthentication(
		this: IHttpRequestHelper,
		credentials: ICredentialDataDecryptedObject,
	): Promise<IDataObject> {
		const { username, password } = credentials;
		const authString = `${username}:${password}`;
		const encoded = Buffer.from(authString).toString('base64');

		return {
			authorization: `Basic ${encoded}`,
		};
	}

}
