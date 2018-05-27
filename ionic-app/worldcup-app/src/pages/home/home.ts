import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/forkJoin'

import { FigureProvider } from '../../providers/figure/figure';
import { GlobalProvider } from '../../providers/global/global';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	logged : any;
	sticker : any;
	loading : any;

	constructor(	public navCtrl: NavController,
					public actionSheetCtrl: ActionSheetController,
					public alertCtrl: AlertController,
					public globalProvider: GlobalProvider,
					public storage: Storage,
					public loadingCtrl: LoadingController,
					public figureProvider: FigureProvider) {
		this.sticker = [];
		
		this.loading = this.loadingCtrl.create({
			content: 'Recebendo Dados, Aguarde ...'
		});

		this.loading.present();

		this.storage.get("logged").then((logged) => {
			if(logged) {
				this.logged = logged;
				 Observable.forkJoin(
				 	this.figureProvider.onGetAllFigure(),
				 	this.figureProvider.onRecoveryFigure(logged.id),
				 	this.figureProvider.onRecoveryFigureTrade(logged.id)
				 ).subscribe(
				 	data => {
				 		this.onSuccessGetAllFigure(data[0])
				 		this.onSuccessFigureUser(data[1])
				 		this.onSuccessFigureTrade(data[2])

				 		storage.set('sticker', this.sticker)

				 		this.loading.dismiss()
				 	},
				 	error => this.onErrorFigure(error)
				 );
			}
		});
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
			this.globalProvider.alertMessage("Modificação de Usuário", "Senha antiga não é válido.");
		} else {	
			this.globalProvider.alertMessage("Modificação de Usuário", "Não foi possível modificar seu usuário, verifique todos os campos antes de continuar.");
		}
	}

	onSticker(stick) {
		console.log(stick);
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
	            stick.amount = 0;
	            if(stick.amount < stick.amount_trading) {
					stick.amount = stick.amount_trading;
					this.onAlert(stick);
				}
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
		        	} else if(value < 0) {
		        		this.globalProvider.alertMessage("Número Inválido", "O número digitado não pode ser negativo");
		        		return false;
		        	}
					stick.amount += value;
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
		        	} else if(value < 0) {
		        		this.globalProvider.alertMessage("Número Inválido", "O número digitado não pode ser negativo");
		        		return false;
		        	}

					stick.amount -= value;

					if(stick.amount < stick.amount_trading) {
						stick.amount = stick.amount_trading;
						this.onAlert(stick);
					}

					if(stick.amount < 0) {
						stick.amount = 0;
					}
		        }
		      }
		    ]
		  });
		  alert.present();
	}

	onAlert(stick) {
		this.globalProvider.alertMessage("Alerta", "Não foi possível remover todas as figurinhas de Nº " + stick.number + ", existe(m) "+stick.amount_trading+" figurinha(s) desse número sendo trocada(s).");
	}

}
