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
                        json: true,
                        encoding: "json",                                                                       
					},            
					send: {
                        type: "body",
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
        displayName: 'Message Header',
        name: 'msgheader',
		type: 'resourceLocator',
		default: { mode: 'list', value: null },
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['smsSend'],
			},
		},
		modes: [
			{
				displayName: 'From list',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'listHeaders',
					searchable: true,
				},
			}			
		],
		required: true,
	},    
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
                displayName: 'Message Encoding',
                name: 'language',
                type: 'options',
                default: '11',          
                options: [
					{
						name: 'Turkish Encoding',
						value: '11',
						description: 'No Translate Turkish Characters',
					},
					{
						name: 'GSM Encoding',
						value: '0',
						description: 'Translate Turkish Characters to Latin',
					},                    
                ],
            },
            {
                displayName: 'IYS Check Mode',
                name: 'iys',
                type: 'options',
                default: '0',          
                options: [
					{
						name: 'Bireysel',
						value: '11',
						description: 'Bireysel Kontrol',
					},
					{
						name: 'Tacir',
						value: '12',
						description: 'Tacir Kontrol',
					},                    
					{
						name: 'Bilgilendirme',
						value: '0',
						description: 'Kontrolsüz',
					},                     
                ],   
            },            
            {
                displayName: 'Partner Code',
                name: 'partnercode',
                type: 'string',
                default: '',          
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
    

    let smsjson:  {
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
        smsjson.encoding = language;
    }

    requestOptions.body = JSON.stringify(smsjson);    
	return requestOptions;
}

