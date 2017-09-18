import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-events',
    templateUrl: 'events.html',
})

export class EventsPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public nav: Nav,
        public loadingCtrl: LoadingController,
        private http: Http,
    ) { }

    events: Array<{any}> = [];

    get_events() {
        let loading = this.loadingCtrl.create({content:'Loading events...'});
        loading.present();
        this.http.get('https://www.tadl.org/wp-json/tribe/events/v1/events?start_date=now').map(res => res.json()).subscribe(data=>{
            loading.dismiss();
            if (data.events) {
                this.events = data.events;
            } else {
            }
        });
    }

    ionViewDidLoad() {
        this.get_events();
        console.log('ionViewDidLoad EventsPage');
    }

}
