import { NgModule, Component, ViewChild, Injectable, Input } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, Content, Events, ModalController } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';
import { Globals } from './globals';
import { ItemDetailsModal } from '../pages/details/details';
import { PasswordModal } from '../pages/password/password';
import 'rxjs/add/operator/map';

@Component({
    providers: [Http]
})

export class User {
    @ViewChild(Content) content: Content;
    constructor(
        private alertCtrl: AlertController,
        private http: Http,
        public loadingCtrl: LoadingController,
        private storage: Storage,
        public events: Events,
        public globals: Globals,
        public modalCtrl: ModalController,
    ) {
    }


    username: string;
    password: string;
    password_hash: string;
    logged_in : boolean;
    full_name: string;
    checkout_count: string;
    holds_count: string;
    holds_ready: string;
    fines: string;
    card: string;
    token: string;
    default_pickup: string;
    login_error: string;
    holds: Array<{any}> = [];
    checkouts: Array<{any}> = [];
    checkout_mesages: string;
    checkout_errors: Array<{any}> = [];

    /** Auto Log User in if username and password in local storage */
    auto_login() {
        this.storage.get('username').then(data => {
            if (data) {
                this.storage.get('username').then((val) => {
                    this.username = val;
                });
            }
        });
        this.storage.get('password').then(data => {
            if (data) {
                this.storage.get('password').then((val) => {
                    this.password = val;
                    this.login(true);
                });
            }
        });
    }

    /** Login User */
    login(auto: boolean = false) {
        let loading = this.loadingCtrl.create({content: 'Logging in...'});
        loading.present();
        let passHash:any = '';
        if (auto != true) {
            passHash = Md5.hashStr(this.password);
            console.log(passHash);
        } else {
            passHash = this.password;
            console.log(passHash);
        }
        this.login_error = '';
        this.http.get(this.globals.loginURL + '?username=' + this.username + '&password=' + this.password).map(res => res.json()).subscribe(data=>{
            if (data.token) {
                this.logged_in = true;
                this.full_name = data.full_name;
                this.checkout_count = data.checkouts;
                this.holds_count = data.holds;
                this.fines = data.fine;
                this.holds_ready = data.holds_ready;
                this.card = data.card;
                this.token = data.token;
                this.default_pickup = this.pickup_code_to_name(data.pickup_library);
                this.storage.set('username', this.username);
                this.storage.set('password', this.password);
            } else {
                this.login_error = "Unable to login with this username and password. Please try again or request a password reset."
            }
            loading.dismiss();
        });
    }

    /** Logout User */
    logout() {
        this.logged_in = false;
        this.username = '';
        this.password = '';
        this.storage.clear();
    }

    /** Get Checkouts */
    load_checkouts() {
        let loading = this.loadingCtrl.create({content:'Loading Checkouts...'});
        loading.present();
        this.checkout_errors.length = 0;
        this.http.get(this.globals.checkoutsURL + '?token=' + this.token).map(res => res.json()).subscribe(data=>{
            if (data.checkouts) {
                this.checkouts = data.checkouts;
            } else {
            }
            loading.dismiss();
        });
    }

    /** Renew Items */
    renew(checkout_ids:string, record_ids:string) {
        let loading = this.loadingCtrl.create({content:'Attempting renewal...'});
        loading.present();
        this.checkout_errors.length = 0;
        this.http.get(this.globals.checkoutRenewURL + '?token=' + this.token + '&checkout_ids=' + checkout_ids + '&record_ids=' + record_ids).map(res => res.json()).subscribe(data=>{
            if (data.checkouts) {
                var message = '';
                if (data.errors.length > 0 && !data.message.startsWith("Failed")) {
                    message = data.message + ' ' + 'One or more items failed to renew.';
                } else {
                    message = data.message;
                }
                loading.dismiss();
                let alert = this.alertCtrl.create({
                    title: message,
                    buttons: [{
                        text: 'Ok',
                        handler: () => {
                            this.checkouts = data.checkouts
                            this.checkout_errors = data.errors
                            this.events.publish('renew')
                        },
                    }]
                });
                alert.present();
            }
        });
    }

    /* get holds */

    load_holds() {
        let loading = this.loadingCtrl.create({content:'Loading Holds...'});
        loading.present();
        this.http.get(this.globals.holdsURL + '?token=' + this.token).map(res => res.json()).subscribe(data=>{
            if (data.holds) {
                this.holds = data.holds;
                this.events.publish('got_holds');
            } else {
            }
            loading.dismiss();
        });
    }

    /** Place Hold */
    place_hold(record_id, force) {
        let loading = this.loadingCtrl.create({content:'Placing Hold...'});
        loading.present();
        var path = this.globals.holdPlaceURL + '?token=' + this.token + '&record_id=' + record_id
        if(force == true){
            path = path + "&force=true"
        }
        this.http.get(path).map(res => res.json()).subscribe(data=>{
            if(data.hold_confirmation[0].need_to_force == true){
                let alert = this.alertCtrl.create({
                    title: data.hold_confirmation[0].message,
                    subTitle: 'Pickup location: ' + this.default_pickup,
                    buttons: [
                        {
                            text: 'Cancel',
                            handler: () => {
                                return
                            },
                        },
                        {
                            text: 'Place Hold Anyway',
                            handler: () =>{
                                this.place_hold(record_id, true);
                            },
                        }
                    ]
                });
                alert.present();
            }
            else if (data.hold_confirmation) {
                this.holds_count = data.user.holds;
                let alert = this.alertCtrl.create({
                    title: data.hold_confirmation[0].message,
                    subTitle: 'Pickup location: ' + this.default_pickup,
                    buttons: [
                        {
                            text: 'Ok',
                            handler: () => {
                                return
                            },
                        },
                        {
                            text: 'Manage Holds',
                            handler: () =>{
                                this.events.publish('manage_holds');
                            },
                        }
                    ]
                });
                alert.present();
            } else {
            }
            loading.dismiss();
        });
    }

    /** Cancel Hold */
    cancel_hold(hold_id) {
        let loading = this.loadingCtrl.create({content:'Canceling Hold...'});
        loading.present();
        this.http.get(this.globals.holdManageURL + '?token=' + this.token + '&hold_id=' + hold_id + '&task=cancel').map(res => res.json()).subscribe(data=>{
            if (data.target_holds) {
                this.holds = data.holds;
                this.events.publish('got_holds');
                this.holds_count = data.user.holds;
                this.holds_ready = data.user.holds_ready;
            } else {
            }
            loading.dismiss();
        });
    }

    /** Suspend Hold */
    suspend_hold(hold_id) {
        let loading = this.loadingCtrl.create({content:'Suspending Hold...'});
        loading.present();
        this.http.get(this.globals.holdManageURL + '?token=' + this.token + '&hold_id=' + hold_id + '&task=suspend').map(res => res.json()).subscribe(data=>{
            if (data.target_holds) {
                this.holds = data.holds;
                this.events.publish('got_holds');
            } else {
            }
            loading.dismiss();
        });
    }

    /** Activate Hold */
    activate_hold(hold_id) {
        let loading = this.loadingCtrl.create({content:'Activating Hold...'});
        loading.present();
        this.http.get(this.globals.holdManageURL + '?token=' + this.token + '&hold_id=' + hold_id + '&task=activate').map(res => res.json()).subscribe(data=>{
            if (data.target_holds) {
                this.holds = data.holds;
                this.events.publish('got_holds');
            } else {
            }
            loading.dismiss();
        });
    }

    /** Change Hold Pickup Loaction */
    change_hold_pickup(hold_id, event) {
        let loading = this.loadingCtrl.create({content:'Changing Pickup Location...'});
        loading.present();
        let params = new URLSearchParams();
        params.append('token', this.token);
        params.append('hold_id', hold_id);
        params.append('new_pickup', event);
        this.http.get(this.globals.holdPickupUpdateURL, {params} ).map(res => res.json()).subscribe(data=>{
            loading.dismiss();
            if (data.message) {
                let alert = this.alertCtrl.create({
                    title: 'Pickup location changed to ' + data.message.pickup_location,
                    buttons: [{
                        text: 'Ok',
                        handler: () => {
                            this.load_holds();
                        },
                    }]
                });
                alert.present();
            }
        });
    }

    /** Renew all items */
    renew_all() {
        var record_ids:string = '';
        var checkout_ids: string = '';
        for (let checkout of this.checkouts) {
            record_ids = record_ids + checkout['record_id'] + ',';
            checkout_ids = checkout_ids + checkout['checkout_id'] + ',';
        }
        this.renew(checkout_ids, record_ids);
    }

    /** Remove all checkout error messages */
    clear_checkout_errors() {
        this.checkout_errors.length = 0;
    }

    /** Get 'pretty' string for user's default pickup location */
    pickup_code_to_name (location_code) {
        var location = this.pickup_code_search(location_code, this.globals.pickup_locations);
        return location.name;
    }

    pickup_code_search(nameKey, myArray) {
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].code === nameKey) {
                return myArray[i];
            }
        }
    }

    /** Reset Password */
    reset_password() {
        let password_reset_modal = this.modalCtrl.create(PasswordModal, {});
        password_reset_modal.present();
    }

}
