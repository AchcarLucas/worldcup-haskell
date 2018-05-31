import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { GlobalProvider } from '../../providers/global/global';
import { SearchProvider } from '../../providers/search/search';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

	loading : any;

	constructor(	public navCtrl: NavController, 
				public navParams: NavParams,
				public geolocation: Geolocation, 
				public globalProvider: GlobalProvider, 
				public loadingCtrl: LoadingController,
				public storage: Storage,) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SearchPage');
	}

}
