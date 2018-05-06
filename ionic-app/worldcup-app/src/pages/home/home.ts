import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	sticker : any;

	constructor(public navCtrl: NavController) {
		this.sticker = [];
		for(var i = 0; i < 682; ++i) {
			this.sticker.push({number : i, amount : Math.floor(Math.random() * 20), trading : false});
		}
	}

	onSticker(stick) {
		console.log(stick);
	}

}
