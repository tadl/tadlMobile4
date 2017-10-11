import { Component, ViewChild, Injectable, Input } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { App, AlertController, LoadingController, ActionSheetController, Content, Events, ModalController, ToastController } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';
import { Globals } from './globals';
import { PasswordModal } from '../pages/password/password';
import 'rxjs/Rx';

@Component({
    providers: [Http]
})

export class User {
    @ViewChild(Content) content: Content;
    pages = {};
    constructor(
        private alertCtrl: AlertController,
        private http: Http,
        public loadingCtrl: LoadingController,
        public events: Events,
        public globals: Globals,
        public modalCtrl: ModalController,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        private storage: Storage,
        public appCtrl: App
    ) {
        events.subscribe('log_me_out', () => {
            console.log('triggered log_me_out event');
            this.logout()
        });
        this.pages['holdsPage'] = require('../pages/holds/holds').HoldsPage;
    }

    username: string;
    password: any = ''
    hashed_password: any = ''
    logged_in : boolean;
    full_name: string;
    ils_username: string;
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
    auto_login(background: boolean = false) {
        this.storage.get('username').then(data => {
            if (data) {
                this.storage.get('username').then((val) => {
                    this.username = val;
                    this.storage.get('hashed_password').then(data => {
                        if (data) {
                            this.storage.get('hashed_password').then((val) => {
                                this.hashed_password = val;
                                this.login(true, background);
                            });
                        }
                    });
                });
            }
        });
    }

    /* Login User */
    login(auto: boolean = false, background: boolean = false) {
        let loading = this.loadingCtrl.create({content: 'Logging in...'});
        if (background != true) {
            loading.present();
        }
        let params = new URLSearchParams();
        if (auto != true) {
            this.hashed_password = Md5.hashStr(this.password);
        }
        params.append('username', this.username);
        params.append('hashed_password', this.hashed_password);
        var path = this.globals.loginHashURL;
        this.login_error = '';
        this.http.get(path, {params})
            .finally(() => {
                if (background != true) {
                    loading.dismiss();
                }
                this.events.publish('login_attempt');
                this.events.unsubscribe('login_attempt');
            })
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.token) {
                        this.logged_in = true;
                        this.full_name = data.full_name;
                        this.checkout_count = data.checkouts;
                        this.holds_count = data.holds;
                        this.fines = data.fine;
                        this.ils_username = data.username;
                        if (background == true) {
                            if ((this.holds_ready < data.holds_ready) && data.holds_ready != 0) {
                                this.holds_ready = data.holds_ready;
                                this.showToast('You have one or more holds available for pickup.');
                            } else {
                                this.holds_ready = data.holds_ready;
                            }
                        } else {
                            this.holds_ready = data.holds_ready;
                            if (data.holds_ready && (data.holds_ready != 0)) {
                                this.showToast('You have one or more holds available for pickup.');
                            }
                        }
                        this.card = data.card;
                        this.token = data.token;
                        this.default_pickup = this.globals.pickupLocations.get(data.pickup_library);
                        this.storage.set('username', this.username);
                        if (data.temp_code) {
                            this.temp_password();
                        } else {
                            this.storage.set('hashed_password', this.hashed_password);
                        }
                    } else {
                        this.login_error = 'Unable to login with this username and password. Please try again or request a password reset.';
                        this.password = '';
                    }
                },
                err => this.globals.error_handler(err)
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
        this.http.get(this.globals.logoutURL + '?token=' + this.token)
            .subscribe(
                data => {
                    this.token = '';
                    this.username = '';
                    this.password = '';
                    this.hashed_password = '';
                    this.card = '';
                    this.login_error = '';
                    this.storage.clear();
                    this.checkouts = [];
                    this.holds = [];
                    this.logged_in = false;
                    this.events.publish('logged_out');
                },
                err => this.globals.error_handler(err)
            )
    }

    /* Get Checkouts */
    load_checkouts(background: boolean = false) {
        let loading = this.loadingCtrl.create({content:'Loading Checkouts...'});
        if (background == false) {
            loading.present();
        }
        this.checkout_errors.length = 0;
        this.http.get(this.globals.checkoutsURL + '?token=' + this.token)
            .finally(() => {
                if (background == false) {
                    loading.dismiss();
                }
            })
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.user.error) {
                        this.auto_login(true);
                        this.events.subscribe('login_attempt', () => {
                            console.log('triggered login_attempt within load_checkouts');
                            if (this.login_error =='') {
                                this.load_holds();
                            } else {
                                this.globals.logout_alert();
                            }
                        });
                    } else {
                        if (data.checkouts) {
                            this.checkouts = data.checkouts;
                        }
                        if (data.user) {
                            this.checkout_count = data.user.checkouts;
                            this.holds_count = data.user.holds;
                            this.fines = data.user.fine;
                            this.holds_ready = data.user.holds_ready;
                        }
                    }
                },
                err => this.globals.error_handler(err)
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
                    if (data.user.error) {
                        this.auto_login(true);
                        this.events.subscribe('login_attempt', () => {
                            console.log('triggered login_attempt event within renew');
                            if (this.login_error == '') {
                                this.renew(checkout_ids, record_ids);
                            } else {
                                this.globals.logout_alert();
                            }
                        });
                    }
                    else if (data.checkouts) {
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
                                    this.checkouts = data.checkouts;
                                    this.checkout_errors = data.errors;
                                },
                            }]
                        });
                        alert.present();
                    }
                },
                err => this.globals.error_handler(err)
            );
    }

    /* load holds */
    load_holds(available: boolean = false) {
        let loading = this.loadingCtrl.create({content:'Loading Holds...'});
        loading.present();
        this.http.get(this.globals.holdsURL + '?token=' + this.token)
            .finally(() => {
                loading.dismiss()
            })
            .map(res => res.json())
            .subscribe(
                data => {
                    if (data.user.error) {
                        this.auto_login(true);
                        this.events.subscribe('login_attempt', () => {
                            console.log('triggered login_attempt event within load_holds');
                            if (this.login_error == '') {
                                this.load_holds();
                            } else {
                                this.globals.logout_alert();
                            }
                        });
                    } else {
                        if (data.holds) {
                            if (available == true) { /* process only available holds */
                                this.holds = data.holds.filter(
                                    hold => hold['queue_status'].startsWith('Ready')
                                );
                            } else { /* process all holds */
                                this.holds = data.holds;
                            }
                        }
                        if (data.user) { /* update user dashboard */
                            this.checkout_count = data.user.checkouts;
                            this.holds_count = data.user.holds;
                            this.fines = data.user.fine;
                            this.holds_ready = data.user.holds_ready;
                        }
                    }

                },
                err => this.globals.error_handler(err)
            );
    }

    /* place hold */
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
                    if (data.user.error) {
                        this.auto_login(true);
                        this.events.subscribe('login_attempt', () => {
                            console.log('triggered login_attempt event within place_holds');
                            if (this.login_error == '') {
                                this.place_hold(record_id, force);
                            } else {
                                this.globals.logout_alert();
                            }
                        });
                    }
                    else if (data.hold_confirmation[0].need_to_force == true) {
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
                                        this.appCtrl.getRootNav().push(this.pages['holdsPage'])
                                        this.events.publish('manage_holds',{ready: false});
                                    },
                                }
                            ]
                        });
                        alert.present();
                    }
                },
                err => this.globals.error_handler(err)
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
                    if (data.user == "bad token") {
                        this.auto_login(true);
                        this.events.subscribe('login_attempt', () => {
                            console.log('triggered login_attempt event within cancel_hold');
                            if (this.login_error == '') {
                                this.cancel_hold(hold_id);
                            } else {
                                this.globals.logout_alert();
                            }
                        });
                    }
                    else if (data.target_holds) {
                        this.holds = data.holds;
                        this.holds_count = data.user.holds;
                        this.holds_ready = data.user.holds_ready;
                    }
                },
                err => this.globals.error_handler(err)
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
                    if (data.user == "bad token") {
                        this.auto_login(true);
                        this.events.subscribe('login_attempt', () => {
                            console.log('triggered login_attempt event within suspend_hold');
                            if (this.login_error == '') {
                                this.suspend_hold(hold_id);
                            } else {
                                this.globals.logout_alert();
                            }
                        });
                    }
                    else if (data.target_holds) {
                        this.holds = data.holds;
                    }
                },
                err => this.globals.error_handler(err)
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
                    if (data.user == "bad token") {
                        this.auto_login(true);
                        this.events.subscribe('login_attempt', () => {
                            console.log('triggered login_attempt event within activate_hold');
                            if (this.login_error == '') {
                                this.activate_hold(hold_id);
                            } else {
                                this.globals.logout_alert();
                            }
                        });
                    }
                    else if (data.target_holds) {
                        this.holds = data.holds;
                    }
                },
                err => this.globals.error_handler(err)
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
                    if (data.message == "bad login") {
                        this.auto_login(true);
                        this.events.subscribe('login_attempt', () => {
                            console.log('triggered login_attempt event within change_hold_pickup');
                            if (this.login_error == '') {
                                this.change_hold_pickup(hold_id, state, event);
                            } else {
                                this.globals.logout_alert();
                            }
                        });
                    }
                    else if (data.message != "bad login") {
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
                err => this.globals.error_handler(err)
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
    temp_password() {
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
            var pass = localStorage.hash;
            this.storage.set('hashed_password', pass);
            localStorage.removeItem('hash');
        }
        if (localStorage.token) {
            localStorage.removeItem('token');
        }
        if (localStorage.card) {
            localStorage.removeItem('card');
        }
    }

    showToast(message) {
        const toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true,
            closeButtonText: 'OK',
            dismissOnPageChange: true,
            position: 'top'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

}
