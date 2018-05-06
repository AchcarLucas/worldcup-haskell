import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { NavbarComponent } from '../components/navbar/navbar';

import { BrMaskerModule } from 'brmasker-ionic-3';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalProvider } from '../providers/global/global';

@NgModule({
  declarations: [
    NavbarComponent,
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrMaskerModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalProvider,
    Geolocation,
  ]
})
export class AppModule {}
