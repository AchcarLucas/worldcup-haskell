import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { NavbarComponent } from '../components/navbar/navbar';

import { BrMaskerModule } from 'brmasker-ionic-3';
import { Geolocation } from '@ionic-native/geolocation';

import { SearchPipe } from '../pipes/search/search';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ChangeUserPage } from '../pages/change-user/change-user';
import { TradeFigurePage } from '../pages/trade-figure/trade-figure';
import { SearchPage } from '../pages/search/search';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalProvider } from '../providers/global/global';
import { LoginProvider } from '../providers/login/login';
import { FigureProvider } from '../providers/figure/figure';

@NgModule({
  declarations: [
    NavbarComponent,
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ChangeUserPage,
    TradeFigurePage,
    SearchPage,
    SearchPipe,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    BrMaskerModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ChangeUserPage,
    TradeFigurePage,
    SearchPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    GlobalProvider,
    LoginProvider,
    FigureProvider,
  ]
})
export class AppModule {}
