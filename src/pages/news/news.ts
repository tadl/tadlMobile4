import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Globals } from '../../app/globals';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-news',
    templateUrl: 'news.html',
})

export class NewsPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public nav: Nav,
        public globals: Globals,
        public loadingCtrl: LoadingController,
        private http: Http,
    ) {
        this.get_news();
    }

    posts: Array<{any}> = [];
    url: string = "https://www.tadl.org/wp-json/wp/v2/posts?categories_exclude=93";
    page: number = 1;
    lastPageReached: boolean = false;

    get_news() {
        let loading = this.loadingCtrl.create({content:'Loading news...'});
        loading.present();
        this.http.get(this.url + '&page=' + this.page).map(res => res.json()).subscribe(data=>{
            if (data) {
                this.posts = data;
            }
            loading.dismiss();
        });
    }

    doInfinite(infiniteScroll) {
        this.page++;
        setTimeout(() => {
            this.http.get(this.url + '&page=' + this.page).map(res => res.json()).subscribe(data=>{
                if (data) {
                    this.posts.push.apply(this.posts, data);
                } else {
                    this.lastPageReached = true;
                }
            }, (err) => {
                this.lastPageReached = true;
            });

            infiniteScroll.complete();
        }, 500);
    }

    isLastPageReached():boolean {
        return this.lastPageReached;
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad NewsPage');
    }

}
