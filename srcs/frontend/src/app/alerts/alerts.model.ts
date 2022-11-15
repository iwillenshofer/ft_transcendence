interface IAlert {
	type? : string;
	msg? : string;
	acceptable? : boolean;
	dismissible? : boolean;
	timeout? : number;
	challenger? : any;
	username? : any;
}

export class AlertModel {

	constructor (alert?: IAlert) {		
		this.type = alert?.type ?? 'success';
		this.msg = alert?.msg ?? '';
		this.acceptable = alert?.acceptable ?? false;
		this.dismissible = alert?.dismissible ?? true;
		this.timeout = alert?.timeout ?? 5000;
		this.challenger = alert?.challenger ?? '';
		this.username = alert?.username ?? '';
	};

	static fromAlert(type: string, message: string): AlertModel {
        return new this(
			{
					type: type,
					msg: message,
			}
        );
    }

	static fromChallenge(challenger: any, username: any, message: string): AlertModel {
        return new this(
			{
					type: 'success',
					msg: message,
					timeout: 0,
					dismissible: false,
					acceptable: true,
					challenger: challenger,
					username: username
			}
        );
    }
	public type: string;
	public msg: string;
	public acceptable: boolean;
	public dismissible: boolean;
	public timeout: number;
	public challenger: any;
	public username: any;
}
