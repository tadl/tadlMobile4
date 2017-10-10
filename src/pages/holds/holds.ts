import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Events, Platform } from 'ionic-angular';
import { Globals } from '../../app/globals';
import { User } from '../../app/user';
import { Item } from '../../app/item';

@IonicPage()
@Component({
    selector: 'page-holds',
    templateUrl: 'holds.html'
})
export class HoldsPage {

    ready_only: boolean = this.navParams.get('ready_only') || false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        public events: Events,
        public user: User,
        public item: Item,
        public globals: Globals,
        public platform: Platform
    ) {
        this.user.load_holds(this.ready_only);
    }

    cancelHold(holdId, holdTitle) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Cancel hold on ' + holdTitle,
            buttons: [
                {
                    text: 'Cancel Hold',
                    role: 'destructive',
                    handler: () => {
                        this.user.cancel_hold(holdId);
                    }
                }, {
                    text: 'Nevermind',
                    role: 'cancel',
                    handler: () => {
                    }
                }
            ]
        });
        actionSheet.present();
    }

    doRefresh(refresher) {
        /* this is messed up because of the whole events business */
        /* we either need to return an observable (to .subscribe()) or 
            a promise (to .then()) */
        /* could probably setTimeout() but that's not great either. */
        this.user.load_holds(this.ready_only);
        refresher.complete();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HoldsPage');
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter HoldsPage');
    }
    ionViewDidLeave() {
        console.log('ionViewDidLeave HoldsPage');
    }


}
