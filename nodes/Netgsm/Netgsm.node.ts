import { INodeType, 
	INodeTypeDescription, 
	NodeConnectionType,
 } from 'n8n-workflow';

import { SMSFields, SMSOperations } from './Descriptions/sms';



export class Netgsm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Netgsm',
		name: 'netgsm',
		icon: 'file:netgsm.svg',
		group: ['transform'],
		version: 1,		
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Send SMS via Netgsm',
		defaults: {
			name: 'Netgsm',
		},
		usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'netgsmApi',
				required: true,
			},
		],
		requestDefaults: {
			method: 'POST',
			baseURL: 'https://api.netgsm.com.tr',
			headers: {
				'Content-Type': 'application/json',
			},
		},		
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'SMS',
						value: 'sms',
					},
				],
				default: 'sms',
			},
			...SMSOperations,
			...SMSFields,

		],
	};

}
