import { Component } from '@angular/core';
import { IonicPage, NavController, Events, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { GlobalProvider } from '../../providers/global/global';
import { LoginProvider } from '../../providers/login/login';

import { HomePage } from '../../pages/home/home';
import { RegisterPage } from '../../pages/register/register';

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
			public formBuilder: FormBuilder, 
			public globalProvider: GlobalProvider, 
			public loginProvider: LoginProvider) {
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
		let data = {email:this.login.value.email, password:this.login.value.password};
		this.loginProvider.onLogin(data).subscribe(
			success=>this.onSuccessLogin(success),
			error=>this.onErrorLogin(error)
		);
		//this.navCtrl.setRoot(HomePage);
	}

	onSuccessLogin(success) {
		console.log(success);
	}

	onErrorLogin(error) {
		console.log(error);
	}

	onRegister() {
		this.navCtrl.push(RegisterPage);
	}

	onForgetPassword() {

	}

}
