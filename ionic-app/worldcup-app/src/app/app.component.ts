import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TradeFigurePage } from '../pages/trade-figure/trade-figure';
import { ChangeUserPage } from '../pages/change-user/change-user';
import { SearchPage } from '../pages/search/search';

import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;

  pages: Array<{title: string, icon:string, color:string, component: any}>;

  constructor(
                public platform: Platform, 
                public statusBar: StatusBar, 
                public splashScreen: SplashScreen,
                public storage : Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Minhas Figurinhas', icon:"md-images", color:"black", component: HomePage },
      { title: 'Trocar Figurinhas', icon:"md-people", color:"black", component: TradeFigurePage },
      { title: 'Buscar Figurinhas', icon:"md-contacts", color:"black", component: SearchPage },
      { title: 'Alterar Dados', icon:"md-contact", color:"black", component: ChangeUserPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.storage.get("logged").then((val) => {
      if(val) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  onLogout() {
    this.storage.remove("logged");
    this.storage.remove("sticker");
    this.nav.setRoot(this.rootPage);
  }
}
