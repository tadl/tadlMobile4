import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HoldsPage } from './holds';

@NgModule({
  declarations: [
    HoldsPage,
  ],
  imports: [
    IonicPageModule.forChild(HoldsPage),
  ],
})
export class HoldsPageModule {}
