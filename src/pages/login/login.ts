import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/user';
import { Globals } from '../../app/globals';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public globals: Globals,
        public user: User
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

}
