import { Component, ViewChild } from '@angular/core';
import { EventDetailPage } from '../event-detail/event-detail';
import { IonicPage, Content, NavController, NavParams, Nav, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Globals } from '../../app/globals';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-events',
    templateUrl: 'events.html'
})

export class EventsPage {

    @ViewChild(Content) content: Content;

    url: string = this.globals.eventsURL;
    lastPageReached: boolean = false;
    loading: boolean = false;
    events: any;
    location: any = '';
    page: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public nav: Nav,
        public globals: Globals,
        public loadingCtrl: LoadingController,
        private http: Http
    ) {
        this.page = '1';
        let loading = this.loadingCtrl.create({content:'Loading events...'});
        loading.present();
        this.loadEvents(this.page, '').then(data => {
            if (!data['next_rest_url']) { this.lastPageReached = true; }
            this.events = data['events'];
            this.loading = false;
            loading.dismiss();
        });
    }

    doRefresh(refresher) {
        var loc = '';
        if (this.location != '') { loc = this.location; } else { loc = ''; }
        this.loadEvents(1, loc).then(data => {
            this.events = data['events'];
            refresher.complete();
        });
    }

    loadEvents(page, loc?) {
        this.loading = true;
        let urlAppend:string = '';
        if (loc) {
            this.location = loc;
            urlAppend = '&venue=' + loc;
        }
        return new Promise(resolve => {
            this.http.get(this.url + '&page=' + page + urlAppend).map(res => res.json()).subscribe(data => {
                resolve(data);
            }, (err) => {
                this.lastPageReached = true;
                if (err.status != 400 ) {
                    this.globals.error_handler(err)
                }
            });
        });
    }

    loadMore(infiniteScroll) {
        this.page++;
        this.loadEvents(this.page, this.location).then(data => {
            let length = data['length'];
            if (length === 0) {
                infiniteScroll.complete();
                infiniteScroll.enable(false);
                return;
            }
            this.events.push.apply(this.events, data['events']);
            infiniteScroll.complete();
            this.loading = false;
        });
    }

    venueEvents(loc?) {
        let loading = this.loadingCtrl.create({content:'Loading events...'});
        loading.present();
        this.page = 1;
        this.lastPageReached = false;
        this.loadEvents(this.page, loc).then(data => {
            if (!data['next_rest_url']) { this.lastPageReached = true; }
            this.events = data['events'];
            loading.dismiss();
        });
    }


    isLastPageReached():boolean {
        return this.lastPageReached;
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
