import { UploadFile } from "../sites/uploading/uploading";
import { EventEmitter, Events } from "../util/EventEmitter";

export enum AuthState {
	NOT_AUTH = 'not_auth',
	AUTH = 'auth',
	PENDING = 'pending'
}

export enum CurrentFlow {
	LOGIN = 'login',
	REGISTER = 'register',
	RESET_PASSWORD = 'reset_password'
}

export class Auth extends EventEmitter {

	public static readonly shared = new Auth();

	private _authState: AuthState = AuthState.PENDING;

	private _profile: any = null;
	private _lastProfileFetch: number = 0;

	public currentFlow = CurrentFlow.LOGIN;

	private constructor() {
		super();

		void this.checkLogin();
	}

	public get isAuth(): AuthState {
		return this._authState;
	}

	public get getToken(): string | null {
		return localStorage.getItem('token');
	}

	public get getUploadToken(): string | null {
		return localStorage.getItem('upload_token');
	}

	public get profile(): any {
		return this._profile;
	}

	private set setAuth(value: AuthState) {
		this._authState = value;
		this.dispatch(Events.ON_AUTH_STATE_CHANGE, value);
	}

	public async checkLogin() {

		if (!this.isAuth) {
			this.setAuth = AuthState.NOT_AUTH;
			return false;
		}

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/auth/check', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + this.getToken
			}
		});

		if (!response.ok) {
			this.setAuth = AuthState.NOT_AUTH;
			return false;
		}

		this.setAuth = AuthState.AUTH;

		await this.getProfile();
	}

	public async login(username: string, password: string) {

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username, password
			}),
		});

		if (!response.ok) {
			this.dispatch(Events.LOGIN_FAILED, 'Email or password is incorrect');
			return false;
		}

		const data = await response.json();

		if (data.token) {
			localStorage.setItem('token', data.token);
			await this.getProfile();
			this.setAuth = AuthState.AUTH;
		} else {
			this.dispatch(Events.LOGIN_FAILED, 'No token received from server');
			return false;
		}

		this.dispatch(Events.LOGIN_SUCCESSFUL);

		return true;
	}

	public async logout() {

		if (!this.isAuth) return;

		await fetch(process.env.REACT_APP_API_BASE_URL + 'api/auth/logout', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + this.getToken
			}
		});

		this._lastProfileFetch = 0;
		this._profile = null;

		localStorage.removeItem('token');
		localStorage.removeItem('upload_token');
		this.setAuth = AuthState.NOT_AUTH;
		this.dispatch(Events.LOGOUT);
	}

	public async register(email: string, password: string, emailConfirmation: string, passwordConfirmation: string, username: string, displayName: string) {
		
		if (email !== emailConfirmation) {
			this.dispatch(Events.REGISTER_FAILED, "Emails don't match");
			return false;
		}

		if (password !== passwordConfirmation) {
			this.dispatch(Events.REGISTER_FAILED, "Passwords don't match");
			return false;
		}

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/account/new', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email, password, username, display_name: displayName
			}),
		});

		if (!response.ok) {
			this.dispatch(Events.REGISTER_FAILED);
			return false;
		}

		this.dispatch(Events.REGISTER_SUCCESSFUL);

		await this.login(email, password);

		return true;
	}

	public async resetPassword(email: string) {

		console.log("Resetting password")

		await new Promise<void>((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, 2000);
		});

		let shouldSuccess = Math.random() > 0.5;

		if (shouldSuccess) {
			this.dispatch(Events.RESET_PASSWORD_SUCCESSFUL);
			return true;
		} else {
			this.dispatch(Events.RESET_PASSWORD_FAILED);
			return false;
		}
	}

	public async getProfile(bypassCache = false) {

		if (!this.isAuth) return null;

		if ((this._lastProfileFetch !== 0 && Date.now() - this._lastProfileFetch < 1000 * 60 * 5) && !bypassCache) {
			return this._profile;
		}

		this._lastProfileFetch = Date.now();

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/account/profile', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if (!response.ok) return null;

		const data = await response.json();

		this._profile = data;

		this.dispatch(Events.PROFILE_FETCHED, data);

		return data;
	}

	public async createCheckoutSession(priceId: string) {
		if (!this.isAuth) return null;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/billing/subscribe', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({
				price: priceId,
				tier: ""
			})
		});

		if (!response.ok) {
			this.dispatch(Events.CHECKOUT_SESSION_CREATION_FAILED);
			return null;
		}

		const { url } = await response.json();

		if (!url) {
			this.dispatch(Events.CHECKOUT_SESSION_CREATION_FAILED);
			return null;
		}

		this.dispatch(Events.CHECKOUT_SESSION_CREATED, url);

		return url;
	}

	public async fetchUploadTokens() {
		if (!this.isAuth) return null;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/tokens', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if (!response.ok) {
			this.dispatch(Events.UPLOAD_TOKENS_FETCH_FAILED);
			return null;
		}

		const { tokens } = await response.json();

		if (!tokens) {
			this.dispatch(Events.UPLOAD_TOKENS_FETCH_FAILED);
			return null;
		}

		this.dispatch(Events.UPLOAD_TOKENS_FETCHED, tokens);

		return tokens;
	}

	public async createUploadToken(name: string, description: string, max_uses: number) {
		if (!this.isAuth) return null;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/tokens', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({
				name,
				description,
				max_uses
			})
		});

		if (!response.ok) {
			this.dispatch(Events.UPLOAD_TOKENS_CREATION_FAILED);
			return null;
		}

		const { token, token_id } = await response.json();

		if (!token || !token_id) {
			this.dispatch(Events.UPLOAD_TOKENS_CREATION_FAILED);
			return null;
		}

		this.dispatch(Events.UPLOAD_TOKENS_CREATED, token, token_id);

		return { token, token_id };
	}

	public async regenerateUploadToken(tokenId: string) {
		if (!this.isAuth) return null;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/tokens/' + tokenId + '/regenerate', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if (!response.ok) {
			this.dispatch(Events.UPLOAD_TOKENS_REGENERATION_FAILED);
			return null;
		}

		const { token, token_id } = await response.json();

		if (!token || !token_id) {
			this.dispatch(Events.UPLOAD_TOKENS_REGENERATION_FAILED);
			return null;
		}

		this.dispatch(Events.UPLOAD_TOKENS_REGENERATED, token, token_id);

		return { token, token_id };
	}

	public async deleteUploadToken(tokenId: string) {
		if (!this.isAuth) return null;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/tokens/' + tokenId, {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if (!response.ok) {
			this.dispatch(Events.UPLOAD_TOKENS_DELETION_FAILED);
			return null;
		}

		this.dispatch(Events.UPLOAD_TOKENS_DELETED, tokenId);

		return { tokenId };
	}

	public async fetchGallery() {
		if (!this.isAuth) return null;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/uploads/all', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if (!response.ok) {
			this.dispatch(Events.GALLERY_FETCH_FAILED);
			return null;
		}

		const { uploads } = await response.json();

		if (!uploads) {
			this.dispatch(Events.GALLERY_FETCH_FAILED);
			return null;
		}

		this.dispatch(Events.GALLERY_FETCHED, uploads);

		return uploads;
	}

	public async deleteFile(fileId: string) {
		if (!this.isAuth) return null;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/uploads/' + fileId, {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if (!response.ok) {
			this.dispatch(Events.FILE_DELETION_FAILED);
			return null;
		}

		this.dispatch(Events.FILE_DELETED, fileId);

		return { fileId };
	}

	public async fetchUploadToken(tokenId: string) {
		if (!this.isAuth) return null;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/tokens/' + tokenId, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if (!response.ok) {
			this.dispatch(Events.UPLOAD_TOKEN_FETCH_FAILED);
			return null;
		}

		const token = await response.json();

		if (!token) {
			this.dispatch(Events.UPLOAD_TOKEN_FETCH_FAILED);
			return null;
		}

		this.dispatch(Events.UPLOAD_TOKEN_FETCHED, token);

		return token;
	}

	public async verifyCustomDomain() {
		if (!this.isAuth) return false;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/custom_domain/verify', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if (!response.ok) {
			this.dispatch(Events.CUSTOM_DOMAIN_VERIFICATION_FAILED);
			return false;
		}

		const { status } = await response.json();

		if (status !== 200) {
			this.dispatch(Events.CUSTOM_DOMAIN_VERIFICATION_FAILED);
			return false;
		}

		this.dispatch(Events.CUSTOM_DOMAIN_VERIFIED, true);

		return true;
	}

	public async setCustomDomain(domain: string) {
		if (!this.isAuth) return false;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/custom_domain', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				domain
			})
		});

		if (!response.ok) {
			this.dispatch(Events.CUSTOM_DOMAIN_SET_FAILED);
			return false;
		}

		const { status } = await response.json();

		if (status !== 200) {
			this.dispatch(Events.CUSTOM_DOMAIN_SET_FAILED);
			return false;
		}

		this.dispatch(Events.CUSTOM_DOMAIN_SET_SUCCESSFUL);

		return true;
	}

	public async deleteCustomDomain() {
		if (!this.isAuth) return false;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/custom_domain', {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if (!response.ok) {
			this.dispatch(Events.CUSTOM_DOMAIN_DELETION_FAILED);
			return false;
		}

		const { status } = await response.json();

		if (status !== 200) {
			this.dispatch(Events.CUSTOM_DOMAIN_DELETION_FAILED);
			return false;
		}

		this.dispatch(Events.CUSTOM_DOMAIN_DELETED);

		return true;
	}

	public async setSubdomain(subdomain: string) {
		if (!this.isAuth) return false;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/subdomain', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				subdomain
			})
		});

		if (!response.ok) {
			this.dispatch(Events.SUBDOMAIN_DELETION_FAILED);
			return false;
		}

		const { status } = await response.json();

		if (status !== 200) {
			this.dispatch(Events.SUBDOMAIN_DELETION_FAILED);
			return false;
		}

		this.dispatch(Events.SUBDOMAIN_SET_SUCCESSFUL);

		return true;
	}

	public async deleteSubdomain() {
		if (!this.isAuth) return false;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/subdomain', {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if (!response.ok) {
			this.dispatch(Events.SUBDOMAIN_DELETION_FAILED);
			return false;
		}

		const { status } = await response.json();

		if (status !== 200) {
			this.dispatch(Events.SUBDOMAIN_DELETION_FAILED);
			return false;
		}

		this.dispatch(Events.SUBDOMAIN_DELETED);

		return true;
	}

	public async updateEmbedConfig(config: object) {
		if (!this.isAuth) return false;

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/account/embed', {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(config)
		});

		if (!response.ok) {
			this.dispatch(Events.EMBED_CONFIG_UPDATE_FAILED);
			return false;
		}

		const { status } = await response.json();

		if (status !== 200) {
			this.dispatch(Events.EMBED_CONFIG_UPDATE_FAILED);
			return false;
		}

		this.dispatch(Events.EMBED_CONFIG_UPDATED);

		return true;
	}

	public async uploadFile(file: UploadFile) {
		if (this.getUploadToken === null) return null;

		const formData = new FormData();
		formData.append('file', file.file);
		formData.append('private', file.private ? 'true' : 'false');
		formData.append('password', file.password);

		const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/uploads', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + this.getUploadToken,
			},
			body: formData
		});

		if (!response.ok) {
			this.dispatch(Events.UPLOAD_FAILED);
			return null;
		}

		const data = await response.json();

		if (!data) {
			this.dispatch(Events.UPLOAD_FAILED);
			return null;
		}

		this.dispatch(Events.UPLOAD_SUCCESSFUL, data);

		return data;
	}

	public setUploadToken(token: string) {
		localStorage.setItem('upload_token', token);
	}

	public setFlow(flow: CurrentFlow) {
		this.currentFlow = flow;
		this.dispatch(Events.FLOW_CHANGE, flow);
	}
}
