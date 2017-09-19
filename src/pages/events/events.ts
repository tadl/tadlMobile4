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
    ) { 
        this.get_events();
    }

    events: Array<{any}> = [];
    url: string = "https://www.tadl.org/wp-json/tribe/events/v1/events?start_date=now";
    next_url: string;
    prev_url: string;

    get_events() {
        let loading = this.loadingCtrl.create({content:'Loading events...'});
        loading.present();
        this.http.get(this.url).map(res => res.json()).subscribe(data=>{
            loading.dismiss();
            if (data.events) {
                this.events = data.events;
            }
            if (data.next_rest_url) {
                this.next_url = data.next_rest_url;
            }
            if (data.previous_rest_url) {
                this.prev_url = data.previous_rest_url;
            }
        });
    }

    doInfinite(infiniteScroll) {
        console.log('begin async operation');
        setTimeout(() => {
            this.url = this.next_url;
            this.http.get(this.url).map(res => res.json()).subscribe(data=>{
                if (data.events) {
                    this.events.push.apply(this.events, data.events);
                }
                if (data.next_rest_url) {
                    this.next_url = data.next_rest_url;
                }
                if (data.previous_rest_url) {
                    this.prev_url = data.previous_rest_url;
                }
            });
        
            console.log('async operation has ended');
            infiniteScroll.complete();
        }, 500);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EventsPage');
    }

}
