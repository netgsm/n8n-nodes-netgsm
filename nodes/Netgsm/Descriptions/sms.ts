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
                        json: true,
                        encoding: "json",                                                                       
					},            
					send: {
                        type: "body",
						preSend: [ reportRequest ],
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
                displayName: 'IYS Check Mode',
                name: 'iys',
                type: 'options',
                default: '0',          
                options: [
					{
						name: 'Bussiness to Customer',
						value: '11',
						description: 'Commercial content to individuals (B2C)',
					},
					{
						name: 'Bussiness to Bussiness',
						value: '12',
						description: 'Commercial content to businesses (B2B)',
					},                    
					{
						name: 'Message Text Is Informational',
						value: '0',
						description: 'Informational messages that are not subject to IYS checks',
					},                     
                ],   
            },             
            {
                displayName: 'Message Encoding',
                name: 'language',
                type: 'options',
                default: 'TR',          
                options: [
					{
						name: 'Turkish Encoding',
						value: 'TR',
						description: 'No Translate Turkish Characters',
					},
					{
						name: 'GSM Encoding',
						value: '',
						description: 'Translate Turkish Characters',
					},                    
                ],
            },                       
            {
                displayName: 'Partner Code',
                name: 'partnercode',
                type: 'string',
                default: '',          
            },      
            {
                displayName: 'SMS Send Datetime',
                name: 'startdate',
                type: "dateTime",
                default: '',          
            },
            {
                displayName: 'SMS Valid Until',
                name: 'stopdate',
                type: "dateTime",
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

async function convertTimestamp(date:Date){
        // ddMMyyyyHHmm
        const formatted =
        String(date.getDate()).padStart(2, '0') +
        String(date.getMonth() + 1).padStart(2, '0') +
        date.getFullYear() +
        String(date.getHours()).padStart(2, '0') +
        String(date.getMinutes()).padStart(2, '0');    
        return formatted;
}

async function sendSMS( this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions ): Promise<IHttpRequestOptions> {
    const additionalOptions = this.getNodeParameter('additionalOptions', {}) as IDataObject;
    const language = additionalOptions.language as string;
    const partnercode = additionalOptions.partnercode as string;
    const iysmode = additionalOptions.iys as string;
    const optStartDate = additionalOptions.startdate as Date;
    const optStopDate = additionalOptions.stopdate as Date;
    const startdate = await convertTimestamp(optStartDate);
    const stopdate = await convertTimestamp(optStopDate);

    const messages: { no: string; msg: string }[] = [];
        
    const phone = this.getNodeParameter('phone') as string;
    const message = this.getNodeParameter('message') as string;
    messages.push({ no: phone, msg: message });
    const headerobject = this.getNodeParameter('msgheader') as IDataObject;			
    const header = headerobject.value as string;		
    

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

    if(partnercode){
        smsjson.partnercode = partnercode;
    }

    if(iysmode){
        smsjson.iysfilter = iysmode;
    }

    if(startdate){
        smsjson.startdate = startdate;
    }

    if(stopdate){
        smsjson.stopdate = stopdate;
    }    

    requestOptions.body = JSON.stringify(smsjson);    
	return requestOptions;
}

async function reportRequest( this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions ): Promise<IHttpRequestOptions> {
    const jobid = this.getNodeParameter('jobid') as string;
    const jobids: string[] = [jobid];
    let reportjson:  {        
        jobids: any;
        appname: string;   
    } = {        
        jobids: jobids,
        appname: 'n8n-integration'
    };    
    requestOptions.body = JSON.stringify(reportjson);    
	return requestOptions;
}
