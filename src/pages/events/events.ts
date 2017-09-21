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

    url: string = "https://www.tadl.org/wp-json/tribe/events/v1/events?per_page=20&start_date=now";
    lastPageReached: boolean = false;
    events: any;
    page: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public nav: Nav,
        public loadingCtrl: LoadingController,
        private http: Http,
    ) { 
        this.page = '1';
        this.loadEvents(this.page).then(data => {
            console.log('Posts loaded', data);
            if (!data['next_rest_url']) { this.lastPageReached = true; }
            this.events = data['events'];
        });
    }

    loadEvents(page) {
        if (!page) {
            let page = 1;
        }
        return new Promise(resolve => {
            this.http.get( this.url + '&page=' + page ).map(res => res.json()).subscribe(data => {
                resolve(data);
            }, (err) => {
                this.lastPageReached = true;
            });
        });
    }

    loadMore(infiniteScroll) {
        this.page++;
        this.loadEvents(this.page).then(data => {
            let length = data['length'];
            if (length === 0) {
                infiniteScroll.complete();
                infiniteScroll.enable(false);
                return;
            }
            this.events.push.apply(this.events, data['events']);
            infiniteScroll.complete();
        });
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
