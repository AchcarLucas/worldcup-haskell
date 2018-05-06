import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NavbarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {

	@Input() title : string;
	@Input() menu : boolean = true;

	constructor(public navCtrl: NavController, public navParams: NavParams, public events : Events) {
	}

}
