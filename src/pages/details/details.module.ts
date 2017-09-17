import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemDetailsModal } from './details';

@NgModule({
  declarations: [
    ItemDetailsModal
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailsModal),
  ],
})
export class ItemDetailsModalModule {}
