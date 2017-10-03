import { Component, ViewChild, Injectable, Input } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, ActionSheetController, Content, Events, ModalController } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';
import { Globals } from './globals';
import { PasswordModal } from '../pages/password/password';
import 'rxjs/Rx';

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
        public actionSheetCtrl: ActionSheetController
    ) {
    }

    username: string;
    password: any = ''
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

    /* Auto Log User in if username and password in local storage */
    auto_login() {
        this.storage.get('username').then(data => {
            if (data) {
                this.storage.get('username').then((val) => {
                    this.username = val;
                    this.storage.get('password').then(data => {
                        if (data) {
                            this.storage.get('password').then((val) => {
                                this.password = val;
                                this.login(true);
                            });
                        }
                    });
                });
            }
        });
    }

    /* Login User */
    login(auto: boolean = false) {
        let loading = this.loadingCtrl.create({content: 'Logging in...'});
        loading.present();
        let params = new URLSearchParams();
        params.append('username', this.username);
        var path = this.globals.loginHashURL;
        if (auto != true && this.password.length > 4 ) {
            this.password = Md5.hashStr(this.password);
            params.append('hashed_password', this.password);
        } else if (auto != true && this.password.length <= 4) {
            params.append('password', this.password);
            path = this.globals.loginPasswordURL;
        } else {
            params.append('hashed_password', this.password);
        }
        this.login_error = '';
        this.http.get(path, {params})
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.token) {
                        this.logged_in = true;
                        this.full_name = data.full_name;
                        this.checkout_count = data.checkouts;
                        this.holds_count = data.holds;
                        this.fines = data.fine;
                        this.holds_ready = data.holds_ready;
                        if (data.holds_ready && (data.holds_ready != 0)) {
                            this.holds_ready_alert();
                        }
                        this.card = data.card;
                        this.token = data.token;
                        this.default_pickup = this.globals.pickupLocations.get(data.pickup_library);
                        this.storage.set('username', this.username);
                        if (this.password.length <= 4) {
                            this.temp_password();
                        } else {
                            this.storage.set('password', this.password);
                        }
                    } else {
                        this.login_error = 'Unable to login with this username and password. Please try again or request a password reset.';
                        this.password = '';
                    }
                },
                err => this.globals.error_handler()
            );
    }


    /* Logout User */
    logoutConfirm() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Do you wish to log out?',
            buttons: [
                {
                    text: 'Log Out',
                    role: 'destructive',
                    handler: () => {
                        this.logout();
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                }
            ]
        });
        actionSheet.present();
    }

    logout() {
        this.logged_in = false;
        this.username = '';
        this.password = '';
        this.token = '';
        this.storage.clear();
        this.events.publish('logged_out')
    }

    /* Get Checkouts */
    load_checkouts() {
        let loading = this.loadingCtrl.create({content:'Loading Checkouts...'});
        loading.present();
        this.checkout_errors.length = 0;
        this.http.get(this.globals.checkoutsURL + '?token=' + this.token)
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.checkouts) {
                        this.checkouts = data.checkouts;
                    }
                },
                err => this.globals.error_handler()
            )
    }

    /* Renew Items */
    renew(checkout_ids:string, record_ids:string) {
        let loading = this.loadingCtrl.create({content:'Attempting renewal...'});
        loading.present();
        this.checkout_errors.length = 0;
        this.http.get(this.globals.checkoutRenewURL + '?token=' + this.token + '&checkout_ids=' + checkout_ids + '&record_ids=' + record_ids)
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.checkouts) {
                        var message = '';
                        if (data.errors.length > 0 && !data.message.startsWith("Failed")) {
                            message = data.message + ' ' + 'One or more items failed to renew.';
                        } else {
                            message = data.message;
                        }
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
                        alert.present()
                    }
                },
                err => this.globals.error_handler()
            );
    }

    /* get holds */

    load_holds() {
        let loading = this.loadingCtrl.create({content:'Loading Holds...'});
        loading.present();
        this.http.get(this.globals.holdsURL + '?token=' + this.token)
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.holds) {
                        this.holds = data.holds;
                        this.events.publish('got_holds');
                    }
                },
                err => this.globals.error_handler()
            );
    }

    holds_ready_alert(){
        let alert = this.alertCtrl.create({
            title: 'Holds Ready for Pickup',
            subTitle: 'One or more items are ready for you to pickup',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        return;
                    },
                },
                {
                    text: 'View Holds Ready for Pickup',
                    handler: () => {
                        this.events.publish('manage_holds',{ready: true});
                    },
                }
            ]
        });
        alert.present();
    }


    /* Place Hold */
    place_hold(record_id, force) {
        let loading = this.loadingCtrl.create({content:'Placing Hold...'});
        loading.present();
        var path = this.globals.holdPlaceURL + '?token=' + this.token + '&record_id=' + record_id;
        if (force == true) {
            path = path + '&force=true';
        }
        this.http.get(path)
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.hold_confirmation[0].need_to_force == true) {
                        let alert = this.alertCtrl.create({
                            title: data.hold_confirmation[0].message,
                            subTitle: 'Pickup location: ' + this.default_pickup,
                            buttons: [
                                {
                                    text: 'Cancel',
                                    handler: () => {
                                        return;
                                    },
                                },
                                {
                                    text: 'Place Hold Anyway',
                                    handler: () => {
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
                                        return;
                                    },
                                },
                                {
                                    text: 'Manage Holds',
                                    handler: () => {
                                        this.events.publish('manage_holds',{ready: false});
                                    },
                                }
                            ]
                        });
                        alert.present();
                    }
                },
                err => this.globals.error_handler()
            );
    }

    /* Cancel Hold */
    cancel_hold(hold_id) {
        let loading = this.loadingCtrl.create({content:'Canceling Hold...'});
        loading.present();
        this.http.get(this.globals.holdManageURL + '?token=' + this.token + '&hold_id=' + hold_id + '&task=cancel')
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.target_holds) {
                        this.holds = data.holds;
                        this.events.publish('got_holds');
                        this.holds_count = data.user.holds;
                        this.holds_ready = data.user.holds_ready;
                    }
                },
                err => this.globals.error_handler()
            );
    }

    /* Suspend Hold */
    suspend_hold(hold_id) {
        let loading = this.loadingCtrl.create({content:'Suspending Hold...'});
        loading.present();
        this.http.get(this.globals.holdManageURL + '?token=' + this.token + '&hold_id=' + hold_id + '&task=suspend')
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.target_holds) {
                        this.holds = data.holds;
                        this.events.publish('got_holds');
                    }
                },
                err => this.globals.error_handler()
            );
    }

    /* Activate Hold */
    activate_hold(hold_id) {
        let loading = this.loadingCtrl.create({content:'Activating Hold...'});
        loading.present();
        this.http.get(this.globals.holdManageURL + '?token=' + this.token + '&hold_id=' + hold_id + '&task=activate')
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.target_holds) {
                        this.holds = data.holds;
                        this.events.publish('got_holds');
                    }
                },
                err => this.globals.error_handler()
            );
    }

    /* Change Hold Pickup Location */
    change_hold_pickup(hold_id, state, event) {
        let loading = this.loadingCtrl.create({content:'Changing Pickup Location...'});
        loading.present();
        let holdState = '';
        let params = new URLSearchParams();
        params.append('token', this.token);
        params.append('hold_id', hold_id);
        params.append('new_pickup', event);
        if (state == 'Active') { holdState = 'f'; }
        else { holdState = 't'; }
        params.append('hold_state', holdState);
        this.http.get(this.globals.holdPickupUpdateURL, {params} )
            .finally(() => loading.dismiss())
            .map(res => res.json())
            .subscribe(
                data => {
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
                },
                err => this.globals.error_handler()
            );
    }

    /* Renew all items */
    renew_all() {
        var record_ids:string = '';
        var checkout_ids: string = '';
        for (let checkout of this.checkouts) {
            record_ids = record_ids + checkout['record_id'] + ',';
            checkout_ids = checkout_ids + checkout['checkout_id'] + ',';
        }
        this.renew(checkout_ids, record_ids);
    }

    /* Remove all checkout error messages */
    clear_checkout_errors() {
        this.checkout_errors.length = 0;
    }

    /* Reset Password */
    reset_password() {
        let password_reset_modal = this.modalCtrl.create(PasswordModal, {});
        password_reset_modal.present();
    }

    /* Detect temporary passwords */
    temp_password(){
        let password_reset_modal = this.modalCtrl.create(PasswordModal, {temp: true, token: this.token, temp_password: this.password});
        password_reset_modal.present();
    }

    /* Check for usernames and hashed passwords from previous versions of apps */

    check_legacy_storage() {
        if (localStorage.username) {
            var username = localStorage.username;
            this.storage.set('username', username);
            localStorage.removeItem('username');
        }
        if (localStorage.hash) {
            var password = localStorage.hash;
            this.storage.set('password', password);
            localStorage.removeItem('hash');
        }
        if (localStorage.token) {
            localStorage.removeItem('token');
        }
        if (localStorage.card) {
            localStorage.removeItem('card');
        }
    }

}
