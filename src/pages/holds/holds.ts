import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Events } from 'ionic-angular';
import { Globals } from '../../app/globals';
import { User } from '../../app/user';
import { Item } from '../../app/item';

@IonicPage()
@Component({
    selector: 'page-holds',
    templateUrl: 'holds.html'
})
export class HoldsPage {

    confirmation: string = "0"; /* ????? */
    ready_only: boolean = this.navParams.get('ready_only') || false;
    processed_holds: Array<{any}> = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        public events: Events,
        public user: User,
        public item: Item,
        public globals: Globals
    ) {
        this.user.load_holds();
        events.subscribe('got_holds', () => {
            this.process_holds();
        });
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

    process_holds() {
        if (this.ready_only == true) {
            this.processed_holds = this.user.holds.filter(
                hold => hold['queue_status'].startsWith('Ready')
            );
        } else {
            this.processed_holds = this.user.holds;
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HoldsPage');
    }

}
