import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AlertController, Events, LoadingController } from 'ionic-angular';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GlobalProvider {

	// URL global do provider
	web_url : string = "http://127.0.0.1:8080/";
	api_url : string = this.web_url + "";
	image_url : string = "http://127.0.0.1:8080/static/storage";

	
	constructor(public http: Http,
				public loadingCtrl: LoadingController,
				public alertCtrl: AlertController,
				public events: Events) {
		console.log('Hello GlobalProvider Provider');
	}

	/*
	 * Retorna a URL global do site
	 */
	getWebUrl() {
		return this.web_url;
	}

	/*
	 * Retorna a URL global da API provider
	 */
	getURL() {
		return this.api_url;
	}

	/*
	 * Retorna a URL global da pasta de imagem provider
	 */
	getImageURL() {
		return this.image_url;
	}

	/*
	* Ao receber um packet, essa função verifica se ocorreu algum erro
	*/
	checkPacketError(error) {
		let parser_json = JSON.parse(error._body);
		console.log("except " + parser_json.resp.excpt);
		return parser_json.resp.excpt;
	}

	/*
	* Message Connect Error
	*/
	connectMessageError() {
		this.alertMessage("Erro de Conexão", "Erro ao tentar conectar com o servidor, Verifique sua conexão com a internet e tente novamente");
	}

	/*
	* Message Timeout Error
	*/
	timeoutMessageError() {
		this.alertMessage("Timeout Error", "Verifique sua conexão com a internet e tente novamente.");
	}

	/*
	 * Mensagem de Alerta Geral (Utilizado por todo o sistema)
	 */
	alertMessage(title, message) {
		let alert = this.alertCtrl.create({
	      title: title,
	      message: message,
	      buttons: ['OK']
	    });

	    alert.present();
	}
}
