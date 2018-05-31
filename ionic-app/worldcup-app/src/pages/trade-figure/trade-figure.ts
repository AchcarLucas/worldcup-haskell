import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../../pages/login/login';

import { FigureProvider } from '../../providers/figure/figure';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the TradeFigurePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-trade-figure',
  templateUrl: 'trade-figure.html',
})
export class TradeFigurePage {

	loading : any;
	sticker : any;
	logged : any;

	constructor(	public navCtrl: NavController,
					public actionSheetCtrl: ActionSheetController,
					public alertCtrl: AlertController,
					public loadingCtrl: LoadingController,
					public globalProvider: GlobalProvider,
					public figureProvider: FigureProvider,
					public storage: Storage,) {
		this.sticker = [];
		storage.get('sticker').then((val) => {
		    this.sticker = val;
		});

		this.storage.get("logged").then((logged) => {
			if(logged) {
				this.logged = logged;
			} else {
				this.globalProvider.onLogout();
				this.navCtrl.setRoot(LoginPage);
			}
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TradeFigurePage');
	}

	onSticker(stick) {
		console.log(stick);
		if(stick.amount > 0) {
			let actionSheet = this.actionSheetCtrl.create({
		      title: 'Modificar Figurinha (Nº ' + stick.number + ')',
		      buttons: [
		        {
		          text: 'Adicionar',
		          icon: 'md-add-circle',
		          handler: () => {
		           this.onAdd(stick);
		          }
		        },{
		          text: 'Remover',
		          icon: 'md-remove-circle',
		          handler: () => {
		            this.onRemove(stick);
		          }
		        },{
		          text: 'Remover Tudo',
		          icon: 'md-trash',
		          handler: () => {
		            stick.amount_trading = 0;
		            stick.trading = false;
		            this.onDispatchToServer(stick);
		          }
		        },{
		          text: 'Cancelar',
		          icon: 'md-close-circle',
		          handler: () => {
		            console.log('Cancel clicked');
		          }
		        }
		      ]
		    });
		    actionSheet.present();
		}
	}

	onAdd(stick) {
		let alert = this.alertCtrl.create({
			title: "Adicionar",
		    message: 'Figurinha (Nº ' + stick.number + ')',
		    inputs: [
		      {
		        name: 'add',
		        placeholder: '0',
		        type: 'number',
		      },
		    ],
		    buttons: [
		      {
		        text: 'Cancelar',
		        role: 'cancel',
		        handler: data => {
		          console.log('Cancel clicked');
		        }
		      },
		      {
		        text: 'Adicionar',
		        handler: data => {
		        	let value = Number(data.add);
		        	if(isNaN(value)) {
		        		this.globalProvider.alertMessage("Número Inválido", "O número digitado é inválido");
		        		return false;
		        	} else if(value <= 0) {
		        		this.globalProvider.alertMessage("Número Inválido", "O número digitado deve ser maior que zero e não negativo");
		        		return false;
		        	} else if((value + stick.amount_trading) > stick.amount) {
		        		this.globalProvider.alertMessage("Número Inválido", "Quantidade de figurinhas insuficientes para ser trocada");
		        		return false;
		        	}
		        	stick.amount_trading += value;
	            	stick.trading = stick.amount_trading > 0;

					this.onDispatchToServer(stick);
		        }
		      }
		    ]
		  });
		  alert.present();
	}

	onRemove(stick) {
		let alert = this.alertCtrl.create({
			title: "Remover",
		    message: 'Figurinha (Nº ' + stick.number + ')',
		    inputs: [
		      {
		        name: 'remove',
		        placeholder: '0',
		        type: 'number',
		      },
		    ],
		    buttons: [
		      {
		        text: 'Cancelar',
		        role: 'cancel',
		        handler: data => {
		          console.log('Cancel clicked');
		        }
		      },
		      {
		        text: 'Remover',
		        handler: data => {
		        	let value = Number(data.remove);
		        	if(isNaN(value)) {
		        		this.globalProvider.alertMessage("Número Inválido", "O número digitado é inválido");
		        		return false;
		        	} else if(value <= 0) {
		        		this.globalProvider.alertMessage("Número Inválido", "O número digitado deve ser maior que zero e não negativo");
		        		return false;
		        	}

		        	stick.amount_trading -= value;
	            	
					if(stick.amount_trading < 0) {
						stick.amount_trading = 0;
					}

					stick.trading = stick.amount_trading > 0;

					this.onDispatchToServer(stick);
		        }
		      }
		    ]
		  });
		  alert.present();
	}

	onDispatchToServer(stick) {

		this.loading = this.loadingCtrl.create({
			content: 'Enviando Dados, Aguarde ...'
		});

		this.loading.present();


		let data = {
			"login" : {
				"email" : this.logged.email,
				"password" : this.logged.password
			},
			"figure_id" : stick.number + 1,
			"amount" : stick.amount_trading
		}

		this.figureProvider.onUpdateFigureTrade(data).subscribe(
			success=>this.onServerSuccess(success),
			error=>this.onServerError(error)
		);
	}

	onServerSuccess(success) {
		console.log(success);
		this.loading.dismiss();

		if(success.resp.content == "updated" || success.resp.content == "inserted") {
			this.globalProvider.alertMessage("Atualizando Figurinha", "Figurinha atualizada com sucesso.");
		}

		this.storage.set('sticker', this.sticker);
	}

	onServerError(error) {
		console.log(error);
		this.loading.dismiss();

		let packet_error = this.globalProvider.checkPacketError(error);
		if(packet_error == "invalid_user") {
			this.globalProvider.alertMessage("Atualizando Figurinha", "Login ou Senha é inválido.");
			this.globalProvider.onLogout();
			this.navCtrl.setRoot(LoginPage);
		} else {	
			this.globalProvider.alertMessage("Atualizando Figurinha", "Ocorreu um erro ao tentar fazer a atualização das figurinhas, por favor, tente novamente.");
		}
	}

}
