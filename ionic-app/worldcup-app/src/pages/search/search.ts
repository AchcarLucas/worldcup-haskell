import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { GlobalProvider } from '../../providers/global/global';
import { SearchProvider } from '../../providers/search/search';

import { LoginPage } from '../../pages/login/login';

import { Geolocation } from '@ionic-native/geolocation';

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

	logged : any;
	loading : any;

	page : number = 0;

	constructor(	public navCtrl: NavController,
					public navParams: NavParams,
					public geolocation: Geolocation,
					public globalProvider: GlobalProvider,
					public searchProvider: SearchProvider,
					public loadingCtrl: LoadingController,
					public storage: Storage,) {


		this.storage.get("logged").then((logged) => {
			if(logged) {
				this.logged = logged;
				this.onReceiveUsers();
			} else {
				this.globalProvider.onLogout();
				this.navCtrl.setRoot(LoginPage);
			}
		});
	}

	onReceiveUsers() {
		this.loading = this.loadingCtrl.create({
			content: 'Recebendo Dados, Aguarde ...'
		});

		this.loading.present();

		this.searchProvider.onSearchUserGps(this.page, this.logged.gps_latitude, this.logged.gps_longitude).subscribe(
			success=>this.onReceiveSuccess(success),
			error=>this.onReceiveError(error)
		);

		this.page += 1;
	}

	onReceiveSuccess(success) {
		console.log(success);
		this.loading.dismiss();
	}

	onReceiveError(error) {
		console.log(error);
		this.loading.dismiss();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SearchPage');
	}

}
