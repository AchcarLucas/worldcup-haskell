import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout'
import 'rxjs/add/operator/delay';

import { GlobalProvider } from '../../providers/global/global';
/*
  Generated class for the FigureProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FigureProvider {

	api_url : string;

	constructor(	public http: Http,
					public globalProvider: GlobalProvider,) {
		console.log('Hello FigureProvider Provider');
		this.api_url = globalProvider.getURL();
	}

	onGetAllFigure() {
		console.log(this.api_url + 'all/figure');
		return this.http.get(this.api_url + 'all/figure').map(res => res.json());
	}

	onRecoveryFigure(user_id) {
		console.log(this.api_url + 'user/figure/' + user_id + '/recovery');
		return this.http.get(this.api_url + 'user/figure/' + user_id + '/recovery').map(res => res.json());
	}

	onUpdateFigure(data) {
		let body = JSON.stringify(data);
		console.log(this.api_url + 'user/figure/edit');
		console.log(body);
		return this.http.post(this.api_url + 'user/figure/edit', body, null).retry(2).timeout(30000).map(res => res.json());
	}

	onRecoveryFigureTrade(user_id) {
		console.log(this.api_url + 'user/figure/trade/' + user_id + '/recovery');
		return this.http.get(this.api_url + 'user/figure/trade/' + user_id + '/recovery').map(res => res.json());
	}

	onUpdateFigureTrade(data) {
		let body = JSON.stringify(data);
		console.log(this.api_url + 'user/figure/trade/edit');
		console.log(body);
		return this.http.post(this.api_url + 'user/figure/trade/edit', body, null).retry(2).timeout(30000).map(res => res.json());
	}

}
