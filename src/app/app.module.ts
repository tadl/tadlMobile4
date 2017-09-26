import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CheckoutsPage } from '../pages/checkouts/checkouts';
import { EventsPage } from '../pages/events/events';
import { FeaturedPage } from '../pages/featured/featured';
import { ItemDetailsModal } from '../pages/details/details';
import { PasswordModal } from '../pages/password/password';
import { Globals } from './globals';
import { User } from './user';
import { Item } from './item';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HoldsPage } from '../pages/holds/holds';
import { SearchPage } from '../pages/search/search';
import { InfoPage } from '../pages/info/info';
import { NewsPage } from '../pages/news/news';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { PostDetailPage } from '../pages/post-detail/post-detail';
import { BarcodePage } from '../pages/barcode/barcode';
import { LoginPage } from '../pages/login/login';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        HoldsPage,
        SearchPage,
        CheckoutsPage,
        EventsPage,
        FeaturedPage,
        ItemDetailsModal,
        PasswordModal,
        PostDetailPage,
        EventDetailPage,
        InfoPage,
        NewsPage,
        LoginPage,
        BarcodePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpModule,
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        CheckoutsPage,
        EventsPage,
        FeaturedPage,
        HoldsPage,
        SearchPage,
        ItemDetailsModal,
        PasswordModal,
        PostDetailPage,
        EventDetailPage,
        InfoPage,
        NewsPage,
        LoginPage,
        BarcodePage
    ],
    providers: [
        StatusBar,
        InAppBrowser,
        SplashScreen,
        Globals,
        User,
        Item,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})

export class AppModule {}
