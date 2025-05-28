import type {
	ICredentialType,
	INodeProperties,    
	IAuthenticateGeneric,
	ICredentialTestRequest,
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
				'Authorization': 'Basic ={Buffer.from(`${credentials.username}:${credentials.password}`).toString("base64")}',
			},
		},
	};

	test: ICredentialTestRequest | undefined = {
		request: {
			baseURL: 'https://api.netgsm.com.tr/sms/rest/v2',
			url: '/inbox',
		},
	};

}
