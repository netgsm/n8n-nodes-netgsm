import {
	IHookFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class NetgsmTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Netgsm Trigger',
		name: 'netgsmTrigger',
		icon: 'file:netgsm.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow on Netgsm events',
		defaults: {
			name: 'Netgsm Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'netgsmApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'incoming SMS',
						value: 'incomingSms',
						description: 'Trigger when an SMS is received',
					},
					{
						name: 'SMS Report',
						value: 'smsReport',
						description: 'Trigger when SMS delivery report is received',
					},
				],
				default: 'incomingSms',
				required: true,
				description: 'The event to trigger on',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;

				const endpoint = event === 'incomingSms'
					? '/sms/rest/v2/inboxwebhook'
					: '/sms/rest/v2/reportwebhook';

				try {
					await this.helpers.httpRequestWithAuthentication.call(this, 'netgsmApi', {
						method: 'POST',
						url: `https://api.netgsm.com.tr${endpoint}`,
						body: {
							webhookUrl: webhookUrl,
						},
						json: true,
					});
					return true;
				} catch (error) {
					throw new Error(`Failed to register webhook: ${error.message}`);
				}
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const event = this.getNodeParameter('event') as string;

				const endpoint = event === 'incomingSms'
					? '/sms/rest/v2/inboxwebhook'
					: '/sms/rest/v2/reportwebhook';

				try {
					await this.helpers.httpRequestWithAuthentication.call(this, 'netgsmApi', {
						method: 'DELETE',
						url: `https://api.netgsm.com.tr${endpoint}`,
						json: true,
					});
					return true;
				} catch (error) {
					return false;
				}
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		return {
			workflowData: [
				[
					{
						json: bodyData,
					},
				],
			],
		};
	}
}
