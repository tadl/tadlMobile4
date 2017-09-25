import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-event-detail',
    templateUrl: 'event-detail.html'
})
export class EventDetailPage {

    selectedItem: any;

    constructor(
        private nav: NavController,
        navParams: NavParams
    ) {
        this.selectedItem = navParams.get('item');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EventDetailPage');
    }

}
