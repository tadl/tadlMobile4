import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/globals';

@IonicPage()
@Component({
    selector: 'page-event-detail',
    templateUrl: 'event-detail.html'
})
export class EventDetailPage {

    selectedItem: any;

    constructor(
        public nav: NavController,
        public navParams: NavParams,
        public globals: Globals
    ) {
        this.selectedItem = navParams.get('item');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EventDetailPage');
    }
}
