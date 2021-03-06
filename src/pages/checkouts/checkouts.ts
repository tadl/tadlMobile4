import { Component, Injectable, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform, Content, ActionSheetController } from 'ionic-angular';
import { User } from '../../app/user';
import { Globals } from '../../app/globals';
import { Item } from '../../app/item';
import * as moment from 'moment';

@IonicPage()
@Component({
    selector: 'page-checkouts',
    templateUrl: 'checkouts.html'
})

@Injectable()
export class CheckoutsPage {

    @ViewChild(Content) content: Content;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        public user: User,
        public item: Item,
        public events: Events,
        public platform: Platform,
        public globals: Globals
    ) {
        this.user.load_checkouts();
    }

    renewAll() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Renew all items?',
            buttons: [
                {
                    text: 'Renew All',
                    handler: () => {
                        this.user.renew_all();
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

    doRefresh(refresher) {
        /* this is messed up because of the whole events business */
        /* we either need to return an observable (to .subscribe()) or
            a promise (to .then()) */
        /* could probably setTimeout() but that's not great either. */
        this.user.load_checkouts();
        refresher.complete();
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad CheckoutsPage');
    }

    ionViewDidEnter() {
        console.log('ionViewDidEnter CheckoutsPage');
    }
    ionViewDidLeave() {
        console.log('ionViewDidLeave CheckoutsPage');
    }

    dueCheck(dueDate) {
        /* if due date is before now the item is overdue */
        if (moment(dueDate).isBefore(moment().format('YYYY-MM-DD'), 'day')) { return 'overDue'; }

        /* if due date is today */
        if (moment(dueDate).isSame(moment().format('YYYY-MM-DD'), 'day')) { return 'dueToday'; }

        /* if 3 days from now is after due date the item is due soon */
        else if (moment().add(3, 'days').isAfter(moment(dueDate))) { return 'dueSoon'; }

        /* the item is not due soon or overdue */
        else { return 'green'; }

    }

}
