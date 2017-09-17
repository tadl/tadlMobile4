import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CheckoutsPage } from '../pages/checkouts/checkouts';
import { ItemDetailsModal } from '../pages/details/details'
import { Globals } from './globals';
import { User } from './user';
import { Item } from './item';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HoldsPage } from '../pages/holds/holds';
import { SearchPage } from '../pages/search/search'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    HoldsPage,
    SearchPage,
    CheckoutsPage,
    ItemDetailsModal,
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
    HoldsPage,
    SearchPage,
    ItemDetailsModal,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Globals,
    User,
    Item,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
