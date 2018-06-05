import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { LoginPage } from '../../pages/login/login';

import { GlobalProvider } from '../../providers/global/global';
import { FigureProvider } from '../../providers/figure/figure';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

	details : any;
	loading : any;
	sticker : any;

	waiting : boolean = true;

	constructor(	public navCtrl: NavController, 
					public navParams: NavParams,
					public globalProvider: GlobalProvider,
					public figureProvider: FigureProvider,
					public loadingCtrl: LoadingController) {

		this.sticker = [];
		this.details = navParams.get("details");
		console.log(this.details);

		this.loading = this.loadingCtrl.create({
			content: 'Recebendo Dados, Aguarde ...'
		});

		this.loading.present();

		Observable.forkJoin(
			 	this.figureProvider.onGetAllFigure(),
			 	this.figureProvider.onRecoveryFigure(this.details.id),
			 	this.figureProvider.onRecoveryFigureTrade(this.details.id)
			 ).subscribe(
			 	data => {
			 		this.onSuccessGetAllFigure(data[0])
			 		this.onSuccessFigureUser(data[1])
			 		this.onSuccessFigureTrade(data[2])
			 		
			 		this.waiting = false;

			 		this.loading.dismiss()
			 	},
			 	error => this.onErrorFigure(error)
			 );
	}

	onSuccessGetAllFigure(success) {
		console.log(success);
		for(let entry of success.resp) {
			this.sticker.push({number : entry.figure_id - 1, name: entry.name, amount : 0, amount_trading: 0, trading: 0, valuable: entry.valuable});
		}
	}

	onSuccessFigureUser(success) {
		console.log(success);
		for(let entry of success.resp) {
			let sticker = this.sticker.find((element) => {
				return element.number == entry.figure_id - 1;
			});
			sticker.amount = entry.amount;
		}
	}

	onSuccessFigureTrade(success) {
		console.log(success);
		for(let entry of success.resp) {
			let sticker = this.sticker.find((element) => {
				return element.number == entry.figure_id - 1;
			});
			sticker.amount_trading = entry.amount;
			sticker.trading = entry.amount > 0;
		}
	}

	onErrorFigure(error) {
		this.loading.dismiss();
		let packet_error = this.globalProvider.checkPacketError(error);
		if(packet_error == "invalid_user") {
			this.globalProvider.alertMessage("Figurinhas", "Login ou Senha é inválido.");
			this.globalProvider.onLogout();
			this.navCtrl.setRoot(LoginPage);
		} else {	
			this.globalProvider.alertMessage("Figurinhas", "Ocorreu um erro ao receber as figurinhas, por favor, tente novamente mais tarde.");
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DetailsPage');
	}

}
