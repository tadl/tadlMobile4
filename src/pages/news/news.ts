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

    url: string = "https://www.tadl.org/wp-json/wp/v2/posts?per_page=20&categories_exclude=93";
    lastPageReached: boolean = false;
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
        });
    }

    loadPosts(page) {
        if (!page) {
            let page = 1;
        }
        return new Promise(resolve => {
            this.http.get( this.url + '&page=' + page ).map(res => res.json()).subscribe(data => {
                resolve(data);
            }, (err) => {
                this.lastPageReached = true;
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
