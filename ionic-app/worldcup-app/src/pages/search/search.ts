import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { GlobalProvider } from '../../providers/global/global';
import { SearchProvider } from '../../providers/search/search';

import { LoginPage } from '../../pages/login/login';
import { DetailsPage } from '../../pages/details/details';

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
	users : any;
	filter : string;

	number_filter : number = null;

	infiniteScroll : any = null;
	scrollDone : boolean = false;

	page : number = 0;

	constructor(	public navCtrl: NavController,
					public navParams: NavParams,
					public geolocation: Geolocation,
					public globalProvider: GlobalProvider,
					public searchProvider: SearchProvider,
					public loadingCtrl: LoadingController,
					public storage: Storage,) {

		this.number_filter = this.navParams.get("number_filter");

		this.users = [];

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

		if(this.number_filter == null) {
			this.searchProvider.onSearchUserGps(this.page, this.logged.gps_latitude, this.logged.gps_longitude).subscribe(
				success=>this.onReceiveSuccess(success),
				error=>this.onReceiveError(error)
			);
		} else {
			this.searchProvider.onSearchUserFigure(Number(this.number_filter) + 1, this.logged.gps_latitude, this.logged.gps_longitude).subscribe(
				success=>this.onReceiveSuccess(success),
				error=>this.onReceiveError(error)
			);
		}

		this.page += 1;
	}

	onReceiveSuccess(success) {
		console.log(success);
		this.loading.dismiss();

		if(success.resp.length == 0) {
			this.scrollDone = true;
		}

		for(let entry of success.resp) {
			if(entry.id != this.logged.id) {
				entry.distance = this.searchProvider.GPSDistance(entry.gps_latitude, entry.gps_longitude, this.logged.gps_latitude, this.logged.gps_longitude);
				entry.distance = entry.distance.toFixed(2);
				this.users.push(entry);
			}
		}

		if(!this.users.length) {
			this.globalProvider.alertMessage("Search", "Nenhum resultado encontrado");
			this.navCtrl.pop();
		}

		if(this.infiniteScroll) {
			this.infiniteScroll.complete();
		}
	}

	onReceiveError(error) {
		console.log(error);
		this.loading.dismiss();
	}

	doInfinite(event) {
		this.infiniteScroll = event;
		if(!this.scrollDone) {
			this.onReceiveUsers();
		} else {
			event.complete();
		}
	}

	onDetails(entry) {
		this.navCtrl.push(DetailsPage, {
									      details: entry,  
									    });
	}

	onSearch(event) {
		console.log(this.filter);
		if(this.filter && this.filter.length) {
			this.navCtrl.push(SearchPage, 
										{ 
											number_filter : this.filter
										});
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SearchPage');
	}

}
