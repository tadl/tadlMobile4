import { Component } from '@angular/core';
import { NavController, Nav, Events, Platform } from 'ionic-angular';
import { Globals } from '../../app/globals';
import { CheckoutsPage } from '../checkouts/checkouts';
import { SearchPage } from '../search/search';
import { EventsPage } from '../events/events';
import { FeaturedPage } from '../featured/featured';
import { InfoPage } from '../info/info';
import { NewsPage } from '../news/news';
import { HoldsPage } from '../holds/holds';
import { User } from '../../app/user';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    searchPage = SearchPage;
    checkoutsPage = CheckoutsPage;
    eventsPage = EventsPage;
    infoPage = InfoPage;
    newsPage = NewsPage;
    featuredPage = FeaturedPage;
    holdsPage = HoldsPage

    query: string;

    constructor(
        public navCtrl: NavController,
        public globals: Globals,
        public nav: Nav,
        public events: Events,
        public platform: Platform,
        public user: User
    ){}

    ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
    }
}
