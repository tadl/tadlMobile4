import { Component, ViewChild } from '@angular/core';
import { PostDetailPage } from '../post-detail/post-detail';
import { IonicPage, Content, NavController, NavParams, Nav, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Globals } from '../../app/globals';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-news',
    templateUrl: 'news.html'
})

export class NewsPage {

    @ViewChild(Content) content: Content;

    url: string = this.globals.newsURL;
    lastPageReached: boolean = false;
    loading: boolean = false;
    posts: any;
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
        let loading = this.loadingCtrl.create({content:'Loading news...'});
        loading.present();
        this.loadPosts(this.page).then(data => {
            this.posts = data;
            loading.dismiss();
            this.loading = false;
        });
    }

    doRefresh(refresher) {
        this.loadPosts(1).then(data => {
            this.posts = data;
            refresher.complete();
        });
    }

    loadPosts(page: number = 1) {
        this.loading = true;
        return new Promise(resolve => {
            this.http.get( this.url + '&page=' + page ).map(res => res.json()).subscribe(data => {
                resolve(data);
            }, (err) => {
                this.lastPageReached = true;
                this.globals.error_handler(err)
            });
        });
    }

    loadMore(infiniteScroll) {
        this.page++;
        this.loadPosts(this.page).then(data => {
            let length = data['length'];
            if (length === 0) {
                infiniteScroll.complete();
                infiniteScroll.enable(false);
                return;
            }
            this.posts.push.apply(this.posts , data);
            infiniteScroll.complete();
            this.loading = false;
        });
    }

    isLastPageReached():boolean {
        return this.lastPageReached;
    }

    itemTapped(event, item) {
        this.nav.push(PostDetailPage, {
            item: item
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NewsPage');
    }

}
