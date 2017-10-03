import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController, Nav, Events } from 'ionic-angular';
import { Globals } from '../../app/globals';
import { CheckoutsPage } from '../checkouts/checkouts';
import { SearchPage } from '../search/search';
import { EventsPage } from '../events/events';
import { FeaturedPage } from '../featured/featured';
import { InfoPage } from '../info/info';
import { NewsPage } from '../news/news';
import { HoldsPage } from '../holds/holds';

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
        public splashScreen: SplashScreen,
        public events: Events
    ){
        setTimeout(() => {
            this.splashScreen.hide();
        }, 100);

        events.subscribe('manage_holds', (object) => {
            if (object.ready != true) {
                this.nav.push(this.holdsPage,{},{animate:false});
            } else {
                this.nav.push(this.holdsPage,{ready_only: true},{animate:false});
            }
        });

        events.subscribe('logged_out', () => {
            this.nav.goToRoot({});
        });
    }

}
