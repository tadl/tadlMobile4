import { Component, ViewChild } from '@angular/core';
import { EventDetailPage } from '../event-detail/event-detail';
import { IonicPage, Content, NavController, NavParams, Nav, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Globals } from '../../app/globals';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-events',
    templateUrl: 'events.html',
})

export class EventsPage {
    @ViewChild(Content) content: Content;

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
    lastPageReached: boolean = false;

    get_events() {
        let loading = this.loadingCtrl.create({content:'Loading events...'});
        loading.present();
        this.http.get(this.url).map(res => res.json()).subscribe(data=>{
            if (data.next_rest_url) {
                this.next_url = data.next_rest_url;
            } else {
                this.lastPageReached = true;
            }
            if (data.events) {
                this.events = data.events;
            }
            loading.dismiss();
        });
    }

    doInfinite(infiniteScroll) {
        console.log('begin async operation');
        setTimeout(() => {
            this.url = this.next_url;
            this.http.get(this.url).map(res => res.json()).subscribe(data=>{
                if (data.next_rest_url) {
                    this.next_url = data.next_rest_url;
                } else {
                    this.next_url = ""
                    this.lastPageReached = true;
                }
                if (data.events) {
                    this.events.push.apply(this.events, data.events);
                }
            });
        
            console.log('async operation has ended');
            infiniteScroll.complete();
        }, 500);
    }

    isLastPageReached():boolean {
        return this.lastPageReached;
    }

    scrollToTop() {
        this.content.scrollToTop();
    }

    itemTapped(event, item) {
        this.nav.push(EventDetailPage, {
            item: item
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EventsPage');
    }

}
