import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { GlobalProvider } from '../../providers/global/global';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	sticker : any;

	constructor(	public navCtrl: NavController,
					public actionSheetCtrl: ActionSheetController,
					public alertCtrl: AlertController,
					public globalProvider: GlobalProvider,
					public storage: Storage) {
		this.sticker = [];
		for(var i = 0; i < 682; ++i) {
			this.sticker.push({number : i, name: "", amount : 0, amount_trading: 0, trading: 0});
		}

		storage.set('sticker', this.sticker);
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
