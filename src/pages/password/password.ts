import { Component, NgModule, Injectable, } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, IonicPageModule } from 'ionic-angular';
import { Http } from '@angular/http';
import { Globals } from '../../app/globals'
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-password',
    templateUrl: 'password.html'
})

export class PasswordModal {

    constructor(
        private http: Http,
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public globals: Globals
    ) {
    }

    username: string;
    reset_sent: boolean = false;

    ionViewDidLoad() {
        console.log('ionViewDidLoad PasswordModal');
        this.reset_sent = false;
    }

    reset_password() {
        this.reset_sent = true;
        this.http.get(this.globals.passwordResetURLPrefix + '?username=' + this.username).map(res => res.json()).subscribe(data => {
            if (data.message) {
                this.reset_sent = true;
            } else {
            }
        });
    }

    close_modal() {
        this.viewCtrl.dismiss();
    }

}
