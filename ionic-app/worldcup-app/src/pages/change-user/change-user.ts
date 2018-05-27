import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { GlobalProvider } from '../../providers/global/global';
import { LoginProvider } from '../../providers/login/login';

import { Geolocation } from '@ionic-native/geolocation';

declare var google;

/**
 * Generated class for the ChangeUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-user',
  templateUrl: 'change-user.html',
})
export class ChangeUserPage {

	@ViewChild('map') mapElement: ElementRef;
	change : any = {};
  	map: any;
  	marker : any = null;
  	infoWindow : any = null;

  	loading : any;

	constructor(	public navCtrl: NavController, 
					public navParams: NavParams,
					public formBuilder : FormBuilder, 
					public geolocation: Geolocation, 
					public globalProvider: GlobalProvider, 
					public loginProvider: LoginProvider,
					public loadingCtrl: LoadingController,
					public storage: Storage) {
		let group = {
			name : ['', Validators.required],
			email : ['', Validators.email],
			gps_latitude : [0, Validators.required],
			gps_longitude : [0, Validators.required],
			telphone_1 : [''],
			telphone_2 : ['', Validators.required],
			password: ['', Validators.required],
			password_repeat: ['', Validators.required]
		}

		this.change = this.formBuilder.group(group);

		this.geolocation.getCurrentPosition().then((resp) => {
			this.change.controls['gps_latitude'].setValue(resp.coords.latitude);
			this.change.controls['gps_longitude'].setValue(resp.coords.longitude);
			//this.onAddMarker({lat: resp.coords.latitude, lng: resp.coords.longitude}, true)
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ChangeUserPage');
	}

	onChange() {

	}

}
