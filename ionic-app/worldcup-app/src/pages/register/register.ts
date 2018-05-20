import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { GlobalProvider } from '../../providers/global/global';
import { LoginProvider } from '../../providers/login/login';

import { Geolocation } from '@ionic-native/geolocation';

declare var google;

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	@ViewChild('map') mapElement: ElementRef;
	register : any = {};
  	map: any;
  	marker : any = null;
  	infoWindow : any = null;

  	loading : any;

	constructor(
			public navCtrl: NavController, 
			public navParams: NavParams,
			public formBuilder : FormBuilder, 
			public geolocation: Geolocation, 
			public globalProvider: GlobalProvider, 
			public loginProvider: LoginProvider,
			public loadingCtrl: LoadingController,
			public storage: Storage,) {
			let group = {
			name : ['', Validators.required],
			email : ['', Validators.email],
			gps_latitude : [0, Validators.required],
			gps_longitude : [0, Validators.required],
			telphone_1 : [''],
			telphone_2 : ['', Validators.required],
			password: ['', Validators.required],
			password_repeat: ['', Validators.required],
		};

		this.register = this.formBuilder.group(group);

		this.geolocation.getCurrentPosition().then((resp) => {
			this.register.controls['gps_latitude'].setValue(resp.coords.latitude);
			this.register.controls['gps_longitude'].setValue(resp.coords.longitude);
			this.onAddMarker({lat: resp.coords.latitude, lng: resp.coords.longitude}, true)
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	ionViewDidLoad() {
		this.onLoadMap();
	}

	onChangeLat(value) {
		let lat = Number(value);
		let lng = Number(this.register.controls['gps_longitude'].value);
		if(!isNaN(lat) && !isNaN(lng)) {
			this.register.controls['gps_latitude'].setValue(value);
			this.onAddMarker({lat: value, lng: this.register.controls['gps_longitude'].value}, true)
		}
	}

	onChangeLng(value) {
		let lat = Number(this.register.controls['gps_latitude'].value);
		let lng = Number(value);
		if(!isNaN(lat) && !isNaN(lng)) {
			this.register.controls['gps_longitude'].setValue(value);
			this.onAddMarker({lat: lat, lng: lng}, true)
		}
	}

	onLoadMap() {
		let latLng = new google.maps.LatLng(-23.533773, -46.625290);
 
	    let mapOptions = {
	      center: latLng,
	      zoom: 3,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    }
	 
	    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

	    google.maps.event.addListener(this.map, "click", (event) => {
		    this.onAddMarker({lat: event.latLng.lat(), lng: event.latLng.lng()}, false);
		});
	}

	onAddMarker(myLatLng, center) {
		console.log(myLatLng);
		if(this.marker == null) {
			this.marker = new google.maps.Marker({
				map: this.map,
				animation: google.maps.Animation.DROP,
				position: myLatLng,
				center: myLatLng,
				title:'lat ' + myLatLng.lat + ' lng ' + myLatLng.lng
			});

			this.marker.setMap(this.map);

			this.infoWindow = new google.maps.InfoWindow({
					content: this.marker.getTitle()
			});

			google.maps.event.addListener(this.marker, 'click', () => {
				this.infoWindow.open(this.map, this.marker);
			});

			this.map.setCenter(this.marker.getPosition());
		} else {
			this.marker.setPosition(myLatLng);
			this.marker.setTitle('lat ' + myLatLng.lat + ' lng ' + myLatLng.lng);
			this.infoWindow.setContent(this.marker.getTitle());
			this.register.controls['gps_latitude'].setValue(myLatLng.lat);
			this.register.controls['gps_longitude'].setValue(myLatLng.lng);
		}

		if(center) {
			this.map.setCenter(this.marker.getPosition());
		}
		
	}

	onRemoveMarker() {
		this.marker.setMap(null);
	}

	onRegister() {
		this.loading = this.loadingCtrl.create({
			content: 'Conectando, Aguarde ...'
		});

		this.loading.present();

		let data = 	{	name: this.register.value.name,
						email: this.register.value.email,
						password: this.register.value.password,
						gps_latitude: this.register.value.gps_latitude,
						gps_longitude: this.register.value.gps_longitude,
						telphone_1: this.register.value.telphone_1,
						telphone_2: this.register.value.telphone_2,
					};

		this.loginProvider.onRegister(data).subscribe(
			success=>this.onSuccessRegister(success),
			error=>this.onErrorRegister(error)
		);
	}

	onSuccessRegister(success) {
		console.log(success);
		this.loading.dismiss();

		if(success.resp) {
			this.globalProvider.alertMessage("Cadastro", "Seu cadastro foi criado com sucesso");
			this.navCtrl.pop();
			return;
		}
	}

	onErrorRegister(error) {
		console.log(error);
		this.globalProvider.connectMessageError();
		this.loading.dismiss();
	}

}
