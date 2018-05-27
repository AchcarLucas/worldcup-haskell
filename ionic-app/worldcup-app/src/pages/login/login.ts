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

	loading : any;
	login : any = {};

	constructor(
			public navCtrl: NavController, 
			public navParams: NavParams,
			public formBuilder: FormBuilder, 
			public globalProvider: GlobalProvider, 
			public loginProvider: LoginProvider,
			public loadingCtrl: LoadingController,
			public storage: Storage,) {
		this.login = this.formBuilder.group({
			email : ['', Validators.email],
			password : ['', Validators.required],
			remember : [false],
		});

		this.storage.get("remember").then((remember) => {
		    if(remember) {
		    	this.login.controls['remember'].setValue(remember);
		    	this.storage.get("account").then((account) => {
		    		if(account) {
		    			this.login.controls['email'].setValue(account['email']);
		    			this.login.controls['password'].setValue(account['password']);
		    		}
		    	});
		    }
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
		this.storage.get("logged").then((val) => {
			if(val) {
				this.navCtrl.setRoot(HomePage);
			}
		});
	}

	onLogin() {
		this.loading = this.loadingCtrl.create({
			content: 'Conectando, Aguarde ...'
		});

		this.loading.present();

		let data = {email:this.login.value.email, password:this.login.value.password};

		this.storage.set("account", data);
		this.storage.set("remember", this.login.value.remember);

		this.loginProvider.onLogin(data).subscribe(
			success=>this.onSuccessLogin(success),
			error=>this.onErrorLogin(error)
		);
	}

	onSuccessLogin(success) {
		console.log(success);
		this.loading.dismiss();
		if(success.resp.length != 0) {
			let data = {
				'id': success.resp[0].id,
				'name': success.resp[0].name,
				'email': success.resp[0].email,
				'password': this.login.value.password,
				'telphone_1': success.resp[0].telphone_1,
				'telphone_2': success.resp[0].telphone_2,
				'gps_latitude': success.resp[0].gps_latitude,
				'gps_longitude': success.resp[0].gps_longitude,
			}
			this.storage.set("logged", data);
			this.globalProvider.alertMessage("Seja Bem-vindo (" + success.resp[0].name + ")", "Você está conectado ...");
			this.navCtrl.setRoot(HomePage);
			return;
		}
		this.globalProvider.alertMessage("Login Inválido", "Login ou Senha não existe, verifique e tente novamente");
	}

	onErrorLogin(error) {
		console.log(error);
		this.globalProvider.connectMessageError();
		this.loading.dismiss();
	}

	onRegister() {
		this.navCtrl.push(RegisterPage);
	}

	onForgetPassword() {

	}

}
