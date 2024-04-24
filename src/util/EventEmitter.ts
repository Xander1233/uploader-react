export enum Events {
	LOGIN_SUCCESSFUL = 'login_successful',
	LOGIN_FAILED = 'login_failed',
	LOGOUT = 'logout',
	REGISTER_SUCCESSFUL = 'register_successful',
	REGISTER_FAILED = 'register_failed',
	RESET_PASSWORD_SUCCESSFUL = 'reset_password_successful',
	RESET_PASSWORD_FAILED = 'reset_password_failed',
	ON_AUTH_STATE_CHANGE = 'on_auth_state_change',
	PROFILE_FETCHED = 'profile_fetched',

	FLOW_CHANGE = 'flow_change',
	CHECKOUT_SESSION_CREATED = 'checkout_session_created',
	CHECKOUT_SESSION_CREATION_FAILED = 'checkout_session_creation_failed',

	UPLOAD_TOKENS_CREATED = 'upload_tokens_created',
	UPLOAD_TOKENS_CREATION_FAILED = 'upload_tokens_creation_failed',
	UPLOAD_TOKENS_REGENERATED = 'upload_tokens_regenerated',
	UPLOAD_TOKENS_REGENERATION_FAILED = 'upload_tokens_regeneration_failed',
	UPLOAD_TOKENS_DELETED = 'upload_tokens_deleted',
	UPLOAD_TOKENS_DELETION_FAILED = 'upload_tokens_deletion_failed',
	UPLOAD_TOKENS_FETCHED = 'upload_tokens_fetched',
	UPLOAD_TOKENS_FETCH_FAILED = 'upload_tokens_fetch_failed',

	UPLOAD_TOKEN_FETCHED = 'upload_token_fetched',
	UPLOAD_TOKEN_FETCH_FAILED = 'upload_token_fetch_failed',

	GALLERY_FETCHED = 'gallery_fetched',
	GALLERY_FETCH_FAILED = 'gallery_fetch_failed',

	FILE_DELETED = 'file_deleted',
	FILE_DELETION_FAILED = 'file_deletion_failed',

	CUSTOM_DOMAIN_SET_SUCCESSFUL = 'custom_domain_set_successful',
	CUSTOM_DOMAIN_SET_FAILED = 'custom_domain_set_failed',
	CUSTOM_DOMAIN_VERIFIED = 'custom_domain_verified',
	CUSTOM_DOMAIN_VERIFICATION_FAILED = 'custom_domain_verification_failed',
	CUSTOM_DOMAIN_DELETED = 'custom_domain_deleted',
	CUSTOM_DOMAIN_DELETION_FAILED = 'custom_domain_deletion_failed',

	SUBDOMAIN_SET_SUCCESSFUL = 'subdomain_set_successful',
	SUBDOMAIN_SET_FAILED = 'subdomain_set_failed',
	SUBDOMAIN_DELETED = 'subdomain_deleted',
	SUBDOMAIN_DELETION_FAILED = 'subdomain_deletion_failed',

	EMBED_CONFIG_UPDATED = 'embed_config_updated',
	EMBED_CONFIG_UPDATE_FAILED = 'embed_config_update_failed',

	UPLOAD_FAILED = 'upload_failed',
	UPLOAD_SUCCESSFUL = 'upload_successful',
}

export abstract class EventEmitter {
	
	private _count = 0;

	private _events: { [key: string]: {
		callback: Function,
		once: boolean,
		id: number
	}[] } = {};

	protected dispatch(event: Events, ...data: any[]) {
		if (!this._events[event]) return;
		this._events[event].forEach(callback => {
			callback.callback(...data);
			if (callback.once) this.unsubscribe(event, callback.id);
		})
	}

	public subscribe(event: Events, callback: (...data: any) => any) {
		if (!this._events[event]) this._events[event] = [];
		this._events[event].push({ callback, once: false, id: this._count++ });
	}

	public unsubscribe(event: Events, id: number) {
		if (!this._events[event]) return;
		this._events[event] = this._events[event].filter(callback => callback.id !== id)
	}

	public subscribeOnce(event: Events, callback: (...data: any) => any) {
		if (!this._events[event]) this._events[event] = [];
		this._events[event].push({ callback, once: true, id: this._count++ });
	}
}
