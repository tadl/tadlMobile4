import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Globals } from '../app/globals';
import { User } from '../app/user'
import { Item } from '../app/item'
import { HomePage } from '../pages/home/home';
import { CheckoutsPage } from '../pages/checkouts/checkouts';
import { HoldsPage } from '../pages/holds/holds';
import { EventsPage } from '../pages/events/events';
import { ItemDetailsModal } from '../pages/details/details'
import { SearchPage } from '../pages/search/search'
import { InfoPage } from '../pages/info/info'
import { NewsPage } from '../pages/news/news'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: Nav
  checkoutsPage = CheckoutsPage
  homePage = HomePage
  holdsPage = HoldsPage
  searchPage = SearchPage
  eventsPage = EventsPage
  infoPage = InfoPage
  newsPage = NewsPage
  public rootPage: any = HomePage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public globals: Globals,
    public user: User,
    public item: Item) 
    {
      this.initializeApp();
      user.auto_login();

      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'Events', component: EventsPage },
        { title: 'Locations', component: InfoPage },
        { title: 'News', component: NewsPage },
        { title: 'Checkouts', component: CheckoutsPage }
      ];
  }




  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
