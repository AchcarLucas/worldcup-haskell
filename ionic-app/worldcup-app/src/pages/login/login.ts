import { Component } from '@angular/core';
import { IonicPage, NavController, Events, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { GlobalProvider } from '../../providers/global/global';

import { HomePage } from '../../pages/home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	login : any = {};

	constructor(
			public navCtrl: NavController, 
			public navParams: NavParams,
			public formBuilder : FormBuilder, ) {
		this.login = this.formBuilder.group({
			email : ['', Validators.email],
			password : ['', Validators.required],
			remember : [false],
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	onLogin() {
		this.navCtrl.setRoot(HomePage);
	}

	onForgetPassword() {

	}

}
