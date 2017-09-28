import { Component, Injectable, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
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
        public user: User,
        public item: Item,
        public events: Events,
        public globals: Globals
    ) {
        events.subscribe('renew', () => {
            this.content.scrollToTop();
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CheckoutsPage');
        this.user.load_checkouts();
    }

    dueCheck(dueDate) {
        /* if due date is before now the item is overdue */
        if (moment(dueDate).isBefore(moment())) { return 'overDue'; }
        /* if 3 days from now is after due date the item is due soon */
        else if (moment().add(3, 'days').isAfter(moment(dueDate))) { return 'dueSoon'; }
        /* the item is not due soon or orverdue */
        else { return 'green'; }
    }

}
