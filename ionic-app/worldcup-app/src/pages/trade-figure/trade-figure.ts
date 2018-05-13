import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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

	sticker : any;

	constructor(	public navCtrl: NavController,
					public actionSheetCtrl: ActionSheetController,
					public alertCtrl: AlertController,
					public globalProvider: GlobalProvider,
					public storage: Storage,) {
		this.sticker = [];
		storage.get('sticker').then((val) => {
		    this.sticker = val;
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TradeFigurePage');
	}

	onSticker(stick) {

	}

}
