import { IDataObject, IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from "n8n-workflow";

export const IYSOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Add IYS Address',
				value: 'iysAdd',
                description: 'This service is used to add a phone number or email address to IYS',
                action: 'Add phone number or email',
				routing: {
					request: {
						url: '/iys/add',						
						returnFullResponse: true, 
                        json: true,
                        encoding: "json",                                                                       
					},            
					send: {
                        type: "body",
						preSend: [ addIYS ],
					}, 
				},
			},
			{
				name: 'Query IYS Address',
				value: 'iysQuery',
                description: 'This service is used to add a phone number or email address to IYS',
                action: 'Query phone number or email',
				routing: {
					request: {
						url: '/iys/search',						
						returnFullResponse: true, 
                        json: true,
                        encoding: "json",                                                                       
					},            
					send: {
                        type: "body",
						preSend: [ queryIYS ],
					}, 
				},
			},			
		],
		default: 'iysAdd',
		displayOptions: {
			show: {
				resource: ['iys'],
			},
		},
	}
];

export const IYSFields: INodeProperties[] = [
    {
        displayName: 'Address Type',
        name: 'type',
        type: 'options',
        default: 'MESAJ',          
        options: [
            {
                name: 'Message',
                value: 'MESAJ',
                description: 'The channel through which the recipient has consented to receive messages (SMS)'
            },
            {
                name: 'Email',
                value: 'EPOSTA',
                description: 'The channel through which the recipient has consented to receive emails'
            },
            {
                name: 'Call',
                value: 'ARAMA',
                description: 'The channel through which the recipient has consented to receive phone calls'
            }
        ],
        required: true,
		displayOptions: {
			show: {
				resource: ['iys'],
				operation: ['iysAdd','iysQuery'],
			},
		},          
    },  
    {
        displayName: 'Consent Source',
        name: 'source',
        type: 'options',
        default: 'HS_WEB',          
       options: [
            {
                name: 'ATM',
                value: 'HS_ATM',
                description: 'Consent was provided through an ATM interface'
            },
            {
                name: 'Call Center',
                value: 'HS_CAGRI_MERKEZI',
                description: 'Consent was obtained through a call center interaction'
            },
            {
                name: 'Electronic Environment',
                value: 'HS_EORTAM',
                description: 'Consent was obtained via an electronic environment (general digital medium)'
            },
            {
                name: 'Email',
                value: 'HS_EPOSTA',
                description: 'Consent was provided through an email communication'
            },
            {
                name: 'Event',
                value: 'HS_ETKINLIK',
                description: 'Consent was collected during an event (e.g., fair, seminar, promo)'
            },
            {
                name: 'Legal Decision',
                value: 'HS_KARAR',
                description: 'Consent status was determined by a legal or administrative decision'
            },
            {
                name: 'Mobile Application',
                value: 'HS_MOBIL',
                description: 'Consent was provided through a mobile app'
            },
            {
                name: 'Physical Environment',
                value: 'HS_FIZIKSEL_ORTAM',
                description: 'Consent was given through a physical environment (e.g., store, branch)'
            },
            {
                name: 'Prior to 2015',
                value: 'HS_2015',
                description: 'Consent was granted before the year 2015'
            },
            {
                name: 'SMS',
                value: 'HS_MESAJ',
                description: 'Consent was given via SMS message'
            },
            {
                name: 'Social Media',
                value: 'HS_SOSYAL_MEDYA',
                description: 'Consent was given via social media platforms'
            },
            {
                name: 'Website',
                value: 'HS_WEB',
                description: 'Consent was obtained through a website or online form'
            },
            {
                name: 'Wet Signature',
                value: 'HS_ISLAK_IMZA',
                description: 'Consent was given via a wet-ink signature on a physical document'
            }
        ],
        required: true,
		displayOptions: {
			show: {
				resource: ['iys'],
				operation: ['iysAdd'],
			},
		},          
    },         
    {
        displayName: 'Recipient',
        name: 'recipient',
        type: 'string',
        default: '',
        placeholder: '+905XXXXXXXXX or mail@mailhost.com',
        required: true,
		displayOptions: {
			show: {
				resource: ['iys'],
				operation: ['iysAdd','iysQuery'],
			},
		},               
    },
    {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        default: 'ONAY',          
        options: [
            {
                name: 'Consent Given',
                value: 'ONAY',
                description: 'The recipient has given consent to be contacted through the specified channel'
            },
            {
                name: 'Consent Rejected',
                value: 'RET',
                description: 'The recipient has rejected or withdrawn consent to be contacted through the specified channel'
            }
        ],  
        required: true,
		displayOptions: {
			show: {
				resource: ['iys'],
				operation: ['iysAdd'],
			},
		},          
    },    
    {
        displayName: 'Consent Date',
        name: 'consentDate',
        type: "dateTime",
        default: '',          
        required: true,
		displayOptions: {
			show: {
				resource: ['iys'],
				operation: ['iysAdd'],
			},
		},          
    },     
    {
        displayName: 'Recipient Type',
        name: 'recipientType',
        type: 'options',
        default: 'BIREYSEL',          
        options: [
            {
                name: 'Individual',
                value: 'BIREYSEL',
                description: 'The consent was obtained for individual (personal) communication purposes'
            },
            {
                name: 'Business',
                value: 'TACIR',
                description: 'The consent was obtained for commercial or business-related communication purposes'
            }
        ],          
        required: true,
		displayOptions: {
			show: {
				resource: ['iys'],
				operation: ['iysAdd','iysQuery'],
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
				resource: ['iys'],
				operation: ['iysAdd'],
			},
		},   
		options: [
            {
                displayName: 'Referance ID',
                name: 'refid',
                type: 'string',
                default: '',                   
            },   
            {
                displayName: 'Retailer Code',
                name: 'retailerCode',
                type: 'string',
                default: '',                   
            },   
            {
                displayName: 'Retailer Access',
                name: 'retailerAccess',
                type: 'string',
                default: '',                   
            },  
            {
                displayName: 'Application Key',
                name: 'appkey',
                type: 'string',
                default: '',                   
            },                                                                      
        ],
    },        

	
];

async function addIYS( this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions ): Promise<IHttpRequestOptions> {
    const additionalOptions = this.getNodeParameter('additionalOptions', {}) as IDataObject;
    const refid = additionalOptions.refid as string;
    const retailerCode = additionalOptions.retailerCode as string;
    const retailerAccess = additionalOptions.retailerAccess as string;
    const appkey = additionalOptions.appkey as string;        
        
    const typeO = this.getNodeParameter('type') as IDataObject;
    const type = typeO.value as string;
    const sourceO = this.getNodeParameter('source') as IDataObject;    
    const source = sourceO.value as string;
    const recipient = this.getNodeParameter('recipient') as string;			    
    const statusO = this.getNodeParameter('status') as IDataObject;    
    const status = statusO.value as string;    
    const recipientTypeO = this.getNodeParameter('recipientType') as IDataObject;    
    const recipientType = recipientTypeO.value as string;
    const consentDate = this.getNodeParameter('consentDate') as Date;	       

    const bodyItem:{
        type: string; 
        source: string; 
        recipient: string;
        status: string;
        consentDate: Date;
        recipientType: string;        
        retailerCode?: string;
        retailerAccess?: string;
        appkey?: string;
    } = { type: type, source: source, recipient: recipient, status: status,  consentDate: consentDate, recipientType: recipientType};
    
    const body: {data: typeof bodyItem[]} = {data:[]};

    if(retailerCode){
        bodyItem.retailerCode = retailerCode;
    }

    if(retailerAccess){
        bodyItem.retailerAccess = retailerAccess;
    }

    if(appkey){
        bodyItem.appkey = appkey;
    }

    body.data.push(bodyItem);

    const header= await getHeader(this);

    if(refid){
        header.refid = refid;
    }

    const iysjson = {header: header, body: body};

    requestOptions.body = JSON.stringify(iysjson);    
	return requestOptions;
}

async function queryIYS( this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions ): Promise<IHttpRequestOptions> {
    const typeO = this.getNodeParameter('type') as IDataObject;
    const type = typeO.value as string;    
    const recipientTypeO = this.getNodeParameter('recipientType') as IDataObject;    
    const recipientType = recipientTypeO.value as string;
    const recipient = this.getNodeParameter('recipient') as string;
    const header= await getHeader(this);
    const bodyItem:{
        type: string;         
        recipient: string;
        recipientType: string;        
    } = { type: type, recipient: recipient, recipientType: recipientType};    
    const body: {data: typeof bodyItem[]} = {data:[]};
    const iysjson = {header: header, body: body};
    requestOptions.body = JSON.stringify(iysjson);    
	return requestOptions;    
}    

async function getHeader(fn: IExecuteSingleFunctions)  {
	const credentials = await fn.getCredentials<{
		username: string;
		authService: 'smsAuth' | 'iysAuth';
		password: string;
		brandCode: string;		
	}>('netgsmApi');

    const username = credentials.username as string;
    const password = credentials.password as string;
    const brandCode = credentials.brandCode as string;    

    const header:{
        username: string; 
        password: string; 
        brandCode: string;
        refid?: string;
    } = { username: username, password: password, brandCode: brandCode};

    return header;    
}