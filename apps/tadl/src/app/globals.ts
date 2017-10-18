import { Injectable } from '@angular/core';
import { AlertController, Events} from 'ionic-angular';
import * as moment from 'moment';

@Injectable()
export class Globals {
    
    constructor(
        private alertCtrl: AlertController,
        public events: Events
    ){
    }

    public systemShortName: string = 'TADL';
    public catalogHost: string = 'catalog.tadl.org';
    public websiteHost: string = 'www.tadl.org';
    public logoFileName: string = 'logo.png'; /* redirected by nginx */
    public squareLogoFileName: string = 'logo-clock-only.png'; /* redirected by nginx */
    public newsCategoryExclude: string = '93'; /* 93=Announcement */

    public multi_location: boolean = true;
    public allLocationsValue: string = '22';

    /* this array is used to build the search formats */
    public searchFormats: Array<{name: string, code: string}> = [
        { name: 'All Formats', code: 'all' },
        { name: 'Books', code: 'a' },
        { name: 'Large Print', code: '534' },
        { name: 'Audiobooks', code: '515,518,546,571,572,582,584,590,597,680' },
        { name: 'eBooks', code: 'ebooks' },
        { name: 'Movies / TV', code: 'g' },
        { name: 'Music', code: 'j' },
        { name: 'Video Games', code: '777' }
    ];

    /* this array is iterated to generate the change pickup select options */
    /* also to generate search location, in combination with allLocationsValue */
    public pickup_locations: Array<{name: string, code: string}> = [
        { name: 'Woodmere', code: '23' },
        { name: 'Interlochen', code: '24' },
        { name: 'Kingsley', code: '25' },
        { name: 'Peninsula', code: '26' },
        { name: 'Fife Lake', code: '27' },
        { name: 'East Bay', code: '28' }
    ];

    /* this map is used to convert location code to location name */
    pickupLocations = new Map<string, string>([
        ['23', 'Woodmere'],
        ['24', 'Interlochen'],
        ['25', 'Kingsley'],
        ['26', 'Peninsula'],
        ['27', 'Fife Lake'],
        ['28', 'East Bay']
    ]);

    /* Used for displaying location name on item details */
    locationName = new Map<string, string>([
        ['TADL-EBB', 'East Bay Branch Library'],
        ['TADL-KBL', 'Kingsley Branch Library'],
        ['TADL-PCL', 'Peninsula Community Library'],
        ['TADL-IPL', 'Interlochen Public Library'],
        ['TADL-FLPL', 'Fife Lake Public Library'],
        ['TADL-WOOD', 'TADL Main Library']
    ]);

    /* this is in use by events, to filter by location */
    public eventVenues: Array<{venue: number, name: string}> = [
        { venue: 97, name: 'Woodmere (Main)' },
        { venue: 98, name: 'East Bay' },
        { venue: 99, name: 'Fife Lake' },
        { venue: 100, name: 'Interlochen' },
        { venue: 101, name: 'Kingsley' },
        { venue: 102, name: 'Peninsula' }
    ];

    /* NO NEED TO EDIT BELOW THIS LINE */

    public appName: string = this.systemShortName + ' Mobile';

    /* URLs for website things */
    public websiteHostBase: string = 'https://' + this.websiteHost;
    public newsURL: string = this.websiteHostBase + '/wp-json/wp/v2/posts?per_page=20&categories_exclude=' + this.newsCategoryExclude;
    public eventsURL: string = this.websiteHostBase + '/wp-json/tribe/events/v1/events?per_page=20&start_date=now';
    public logoURL: string = this.websiteHostBase + '/' + this.logoFileName;
    public squareLogoURL: string = this.websiteHostBase + '/' + this.squareLogoFileName;
    public hoursURL: string = this.websiteHostBase + '/wp-content/uploads/json/parsed-hours.json';

    /* URLs for catalog things */
    public catalogHostBase: string = 'https://' + this.catalogHost;
    public fromMobileParam: string = '?from_mobile=true';
    public coverURLBase: string = this.catalogHostBase + '/opac/extras/ac/jacket';
    public coverURLLg: string = this.coverURLBase + '/large/r/';
    public coverURLMd: string = this.coverURLBase + '/medium/r/';
    public coverURLSm: string = this.coverURLBase + '/small/r/';
    public passwordResetURLPrefix: string = this.catalogHostBase + '/main/reset_password_request.json' + this.fromMobileParam;
    public saveNewPasswordUrl: string = this.catalogHostBase + '/main/update_user_info.json'; /* uses params object in password.ts */
    public featuredURL: string = this.catalogHostBase + '/main/index.json' + this.fromMobileParam;
    public searchURL: string = this.catalogHostBase + '/search.json'; /* uses params object in search.ts */
    public loginHashURL: string = this.catalogHostBase + '/main/login_hash.json'; /* uses params object in user.ts */
    public loginPasswordURL: string = this.catalogHostBase + '/main/login.json' + this.fromMobileParam;
    public logoutURL: string = this.catalogHostBase + '/main/logout.json' + this.fromMobileParam;
    public checkoutsURL: string = this.catalogHostBase + '/checkouts.json' + this.fromMobileParam;
    public checkoutRenewURL: string = this.catalogHostBase + '/main/renew_checkouts.json' + this.fromMobileParam;
    public holdsURL: string = this.catalogHostBase + '/holds.json' + this.fromMobileParam;
    public holdPlaceURL: string = this.catalogHostBase + '/place_hold.json' + this.fromMobileParam;
    public holdManageURL: string = this.catalogHostBase + '/main/manage_hold.json' + this.fromMobileParam;
    public holdPickupUpdateURL: string = this.catalogHostBase + '/main/update_hold_pickup.json'; /* uses params object in user.ts */
    public itemDetailsURL: string = this.catalogHostBase + '/main/details.json' + this.fromMobileParam;

    /* this is in use by featured, search and details */
    itemType = new Map<string, string>([
        ['text', 'book'],
        ['notated music', 'musical-notes'],
        ['cartographic', 'map'],
        ['moving image', 'film'],
        ['sound recording-nonmusical', 'disc'],
        ['sound recording-musical', 'disc'],
        ['still image', 'image'],
        ['software, multimedia', 'document'],
        ['kit', 'briefcase'],
        ['mixed-material', 'briefcase'],
        ['three dimensional object', 'archive']
    ]);

    /* HELPER FUNCTIONS */

    /* three date formats used for (1)news feed, (null)events feed and (2)event detail */
    fixDate(str, fmt?) {
        if (fmt == 2) {
            return moment(str).format("dddd") + "<br/>" + moment(str).format("MMMM Do") + "<br/>" + moment(str).format("h:mm a");
        } else if (fmt == 1) {
            return moment(str).format("MMMM Do, h:mm a");
        } else {
            return moment(str).format("ddd MMMM Do, h:mm a");
        }
    }

    error_handler(err) {
        let message = '';
        if (err.status == 404) { message = 'somehow encountered a 404'; }
        if (err.status == 400) { message = 'somehow encountered a 400'; }
        if (message == '') {
            let alert = this.alertCtrl.create({
                title: "Oops...",
                subTitle: 'Network error. Check your internet connection or try again later',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        return
                    },
                }]
            });
            alert.present();
        } else {
            // maybe do something here, maybe not
        }
    }

    logout_alert() {
        let alert = this.alertCtrl.create({
            title: "Oops...",
            subTitle: 'Your login has expired. Please log in and try again',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.events.publish('log_me_out')
                },
            }]
        });
        alert.present();
    }

    show_more(id, div_type) {
        var div_to_hide = id + '_' + div_type;
        var div_to_show = div_to_hide + '_full';
        document.getElementById(div_to_show).setAttribute('style', 'display: block');
        document.getElementById(div_to_hide).setAttribute('style', 'display: none');

    }

    show_less(id, div_type){
        var div_to_show = id + '_' + div_type
        var div_to_hide = div_to_show + '_full'
        document.getElementById(div_to_show).setAttribute("style", "display: block")
        document.getElementById(div_to_hide).setAttribute("style", "display: none")
    }
}
