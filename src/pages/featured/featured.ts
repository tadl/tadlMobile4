import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { Globals } from '../../app/globals';
import { User } from '../../app/user';
import { Item } from '../../app/item';


@IonicPage()
@Component({
    selector: 'page-featured',
    templateUrl: 'featured.html',
})

export class FeaturedPage {
    url: string = 'https://catalog.tadl.org/main/index.json';
    items: any[];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public nav: Nav,
        public loadingCtrl: LoadingController,
        public events: Events,
        public globals: Globals,
        public item: Item,
        public user: User,
        private http: Http
    ) {
        this.get_feeds();
    }

    get_feeds() {
        var loading = this.loadingCtrl.create({content:'Loading items...'});
        loading.present();
        this.http.get(this.url).map(res => res.json()).subscribe(data=>{
            if (data.featured_items) {
                console.log(data.last_updated);
                this.items = data.featured_items;
            }
            loading.dismiss();
        });
    }

    toggleSection(i) {
        this.items[i].open = !this.items[i].open;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FeaturedPage');
    }

}
