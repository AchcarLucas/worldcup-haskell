import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeUserPage } from './change-user';

@NgModule({
  declarations: [
    ChangeUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeUserPage),
  ],
})
export class ChangeUserPageModule {}
