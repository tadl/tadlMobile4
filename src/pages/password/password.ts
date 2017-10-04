import { Component, NgModule, Injectable, } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, IonicPageModule, LoadingController } from 'ionic-angular';
import { Http, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5';
import { Globals } from '../../app/globals'
import 'rxjs/Rx';

@IonicPage()
@Component({
    selector: 'page-password',
    templateUrl: 'password.html'
})

export class PasswordModal {

    constructor(
        private http: Http,
        public loadingCtrl: LoadingController,
        private storage: Storage,
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public globals: Globals,
    ) {
    }

    new_password_1: string;
    new_password_2: string;
    password_error: string;
    password_success: boolean = false;
    reset_sent: boolean = false;
    temp: boolean = this.navParams.get('temp') || false;
    temp_password: string = this.navParams.get('temp_password') || ''
    valid_password: boolean = false;
    username: string
    token: string = this.navParams.get('token') || ''

    ionViewDidLoad() {
        console.log('ionViewDidLoad PasswordModal');
        this.reset_sent = false;
    }

    reset_password() {
        this.http.get(this.globals.passwordResetURLPrefix + '?username=' + this.username)
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.message) {
                        this.reset_sent = true;
                    } 
                },
                err => this.globals.error_handler()
            );
    }

    close_modal() {
        this.viewCtrl.dismiss();
    }

    validate_new_password(event){
        this.password_error = ''
        this.valid_password = false
        if(this.new_password_1.length < 7){
            this.password_error =  'Password must be at least 7 characters. '
        }
        if(!this.new_password_1.match(/\d/)){
            this.password_error = this.password_error + 'Password must contain at least one number. '
        }
        if(!this.new_password_1.match(/[a-zA-Z]/)){
            this.password_error = this.password_error + 'Password must contain at least one letter. '
        }
        if(this.new_password_1 != this.new_password_2){
            this.password_error = this.password_error + 'New passwords do not match. '
        }
        if(this.password_error == ''){
            this.valid_password = true
        }
    }

    save_new_password(){
        let loading = this.loadingCtrl.create({content: 'Saving new password...'});
        loading.present();
        let params = new URLSearchParams();
        params.append('password', this.temp_password)
        params.append('new_password', this.new_password_1)
        params.append('token', this.token)
        this.http.get(this.globals.saveNewPasswordUrl, {params})
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
                    if(data.user.error){
                        this.close_modal()
                        this.globals.logout_alert()
                    }
                    else if (data.message == 'success') {
                        this.password_success = true
                        var password = Md5.hashStr(this.new_password_1);
                        this.storage.set('password', password);
                    }else{
                        this.globals.error_handler()
                    }
                },
                err => this.globals.error_handler()
            );

    }

}
