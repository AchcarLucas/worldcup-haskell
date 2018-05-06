import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormControl } from '@angular/forms';

import { GlobalProvider } from '../../providers/global/global';

import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	register : any = {};
	
	constructor(
			public navCtrl: NavController, 
			public navParams: NavParams,
			public formBuilder : FormBuilder, 
			public geolocation: Geolocation) {
			let group = {
			name : ['', Validators.required],
			email : ['', Validators.email],
			gps_latitude : [''],
			gps_longitude : [''],
			telphone_1 : [''],
			telphone_2 : ['', Validators.required],
		};

		this.register = this.formBuilder.group(group);

		this.geolocation.getCurrentPosition().then((resp) => {
			this.register.controls['gps_latitude'].setValue(resp.coords.latitude);
			this.register.controls['gps_longitude'].setValue(resp.coords.longitude);
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterPage');
	}

	onRegister() {

	}

}
