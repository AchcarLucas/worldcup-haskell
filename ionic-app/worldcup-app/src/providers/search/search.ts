import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout'
import 'rxjs/add/operator/delay';

import { GlobalProvider } from '../../providers/global/global';

/*
  Generated class for the SearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchProvider {

	api_url : string;

	constructor(	public http: Http,
					public globalProvider: GlobalProvider,) {
		console.log('Hello SearchProvider Provider');
		this.api_url = globalProvider.getURL();
	}

	/*
	 *	Calcula a distância em Kilometros usando duas posições de GPS
	 */
	GPSDistance(lat1 : number, lon1 : number, lat2 : number, lon2 : number) {
    	let p = 0.017453292519943295;    // Math.PI / 180
    	let c = Math.cos;
    	let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((lon1- lon2) * p))) / 2;
    	let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    	return dis;
  	}

  	onSearchUserGps(page, lat, lgt) {
  		let url = this.api_url + 'user/search/' + page + '/lat/' + lat + '/lng/' + lgt;
		console.log(url);
		return this.http.get(url).map(res => res.json());
	}

	onSearchUserId(user_id) {
		let url = this.api_url + 'user/search/' + user_id;
		console.log(url);
		return this.http.get(url).map(res => res.json());
	}

	onSearchUserFigure(figure_id, lat, lgt) {
		let url = this.api_url + 'user/search/figure/' + figure_id + '/lat/' + lat + '/lng/' + lgt;
		console.log(url);
		return this.http.get(url).map(res => res.json());
	}

}
