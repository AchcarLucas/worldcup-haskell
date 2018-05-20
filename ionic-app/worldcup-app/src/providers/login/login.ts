import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout'
import 'rxjs/add/operator/delay';

import { GlobalProvider } from '../../providers/global/global';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

	api_url : string;

	constructor(	public http: Http,
					public globalProvider: GlobalProvider,) {
		console.log('Hello LoginProvider Provider');
		this.api_url = globalProvider.getURL();
	}

	public onLogin(data) {
		let body = JSON.stringify(data);
		console.log(this.api_url + 'user/login');
		return this.http.post(this.api_url + 'user/login', body, null).retry(2).timeout(30000).map(res => res.json());
	}

	public onRegister(data) {
		let body = JSON.stringify(data);
		console.log(this.api_url + 'user/create');
		return this.http.post(this.api_url + 'user/create', body, null).retry(2).timeout(30000).map(res => res.json());
	}

	public onChangeRegister(data) {
		let body = JSON.stringify(data);
		console.log(this.api_url + 'user/change');
		return this.http.patch(this.api_url + 'user/change', body, null).retry(2).timeout(30000).map(res => res.json());
	}

}
