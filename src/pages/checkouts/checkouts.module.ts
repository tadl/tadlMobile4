import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutsPage } from './checkouts';

@NgModule({
  declarations: [
    CheckoutsPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckoutsPage),
  ],
})
export class CheckoutsPageModule {}
