import { INodeType, 
	INodeTypeDescription, 
	NodeConnectionType,
 } from 'n8n-workflow';

import { SMSFields, SMSOperations } from './Descriptions/sms';
import { IYSFields, IYSOperations } from './Descriptions/iys';
import { listSearch } from './Descriptions/utils';


export class Netgsm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Netgsm',
		name: 'netgsm',
		icon: 'file:netgsm.svg',
		group: ['transform'],
		version: 1,		
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Netgsm API',
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
			json: true,
		},		
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'ILETI YONETIM SISTEMI',
						value: 'iys',
					},					
					{
						name: 'SMS',
						value: 'sms',
					},				
				],
				default: 'sms',
			},
			//SMS
			...SMSOperations,
			...SMSFields,
			//IYS
            ...IYSOperations,
            ...IYSFields,			

		],
	};

	methods = {
		listSearch,
	};
}
