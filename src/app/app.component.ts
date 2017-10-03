import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Globals } from '../app/globals';
import { User } from '../app/user';
import { Item } from '../app/item';
import { HomePage } from '../pages/home/home';
import { CheckoutsPage } from '../pages/checkouts/checkouts';
import { HoldsPage } from '../pages/holds/holds';
import { EventsPage } from '../pages/events/events';
import { FeaturedPage } from '../pages/featured/featured';
import { ItemDetailsModal } from '../pages/details/details'
import { PasswordModal } from '../pages/password/password';
import { SearchPage } from '../pages/search/search';
import { InfoPage } from '../pages/info/info';
import { NewsPage } from '../pages/news/news';
import { BarcodePage } from '../pages/barcode/barcode';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild('content') nav: Nav;

    checkoutsPage = CheckoutsPage;
    homePage = HomePage;
    holdsPage = HoldsPage;
    searchPage = SearchPage;
    eventsPage = EventsPage;
    featuredPage = FeaturedPage;
    infoPage = InfoPage;
    newsPage = NewsPage;
    barcodePage = BarcodePage;
    public rootPage: any = HomePage;
    pages: Array<{title: string, component: any}>;

    constructor(
        public platform: Platform, 
        public statusBar: StatusBar, 
        public splashScreen: SplashScreen,
        public globals: Globals,
        public user: User,
        public item: Item
    ) {
        this.initializeApp();
        user.auto_login();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.user.check_legacy_storage();
            setTimeout(() => {
                this.splashScreen.hide();
            }, 100);
        });
        this.platform.resume.subscribe(() => {
            this.user.auto_login();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
