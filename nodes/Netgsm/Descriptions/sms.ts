import { IDataObject, IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from "n8n-workflow";

export const SMSOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'SMS Send',
				value: 'smsSend',
                description: 'Send a text message to a phone number',
                action: 'Send a text message',
				routing: {
					request: {
						url: '/sms/rest/v2/send',						
						returnFullResponse: true,                        
					},
					send: {
						preSend: [ sendSMS ],
					}, 
				},
			},
			{
				name: 'SMS Status Query',
				value: 'smsStatusQuery',
                description: 'Check delivery status of a sent SMS using Job ID',
                action: 'Check SMS status',
				routing: {
					request: {
						url: '/sms/rest/v2/report',	
						returnFullResponse: true,                        					
					},
				},
			},
			{
				name: 'SMS Inbox Query',
				value: 'smsInboxQuery',
                description: 'Retrieve received SMS messages from inbox',
                action: 'Get inbox messages',
				routing: {					
					request: {
						url: '/sms/rest/v2/inbox',
						returnFullResponse: true,
						method: "GET"
					},
				},
			},
		],
		default: 'smsSend',
		displayOptions: {
			show: {
				resource: ['sms'],
			},
		},
	}
];

export const SMSFields: INodeProperties[] = [
   {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        default: '',
        placeholder: '905XXXXXXXXX',
        required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['smsSend'],
			},
		},        
    },
    {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['smsSend'],
			},
		},                
    },
    {
        displayName: 'Message Header',
        name: 'msgheader',
        type: 'string',
        default: '',
        required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['smsSend'],
			},
		},                
    },

	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['smsSend'],
			},
		},  
		options: [
            {
                displayName: 'Message Context Coding',
                name: 'language',
                type: 'string',
                default: 'TR',                
                displayOptions: {
                    show: {
                        resource: ['sms'],
                        operation: ['smsSend'],
                    },
                },                
            },
        ],
    },        

	// SMS report

    {
        displayName: 'Jobid',
        name: 'jobid',
        type: 'string',
        default: '',        
        required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['smsStatusQuery'],
			},
		},        
    },    
];

async function sendSMS( this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions ): Promise<IHttpRequestOptions> {
    const additionalOptions = this.getNodeParameter('additionalOptions', {}) as IDataObject;
    const language = additionalOptions.language as string

    const messages: { no: string; msg: string }[] = [];
        
    const phone = this.getNodeParameter('phone') as string;
    const message = this.getNodeParameter('message') as string;
    messages.push({ no: phone, msg: message });
    const header = this.getNodeParameter('msgheader') as string;			
    

    let body:  {
        msgheader: string;
        messages: any;
        appname: string;
        encoding?: string; 
        iysfilter?: string;
        partnercode?: string;
        startdate?: string;
        stopdate?: string;
    } = {
        msgheader: header,        
        messages: messages,
        appname: 'n8n-integration'        
    };    
    
    if(language){
        body.encoding = language;
    }

    requestOptions.body = body;
	return requestOptions;
}

