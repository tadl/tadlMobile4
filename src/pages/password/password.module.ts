import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordModal } from './password';

@NgModule({
  declarations: [
    PasswordModal,
  ],
  imports: [
    IonicPageModule.forChild(PasswordModal),
  ],
})
export class PasswordPageModule {}
