import { Injectable } from '@angular/core';
import { AlertController, Events} from 'ionic-angular';
import * as moment from 'moment';

@Injectable()
export class Globals {
    
    constructor(
        private alertCtrl: AlertController,
        public events: Events
    ){}


    public systemShortName: string = 'TADL';
    public catalogHost: string = 'catalog.tadl.org';
    public websiteHost: string = 'www.tadl.org';
    public logoFileName: string = 'logo.png';
    public newsCategoryExclude: string = '93'; /* 93=Announcement */

    public multi_location: boolean = true;

    /* this array is iterated to generate the change pickup select options */
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
    public newsURL: string = 'https://' + this.websiteHost + '/wp-json/wp/v2/posts?per_page=20&categories_exclude=' + this.newsCategoryExclude;
    public eventsURL: string = 'https://' + this.websiteHost + '/wp-json/tribe/events/v1/events?per_page=20&start_date=now';
    public logoURL: string = 'https://' + this.websiteHost + '/' + this.logoFileName;
    public hoursURL: string = 'https://' + this.websiteHost + '/wp-content/uploads/json/parsed-hours.json';

    /* URLs for catalog things */
    public coverURLBase: string = 'https://' + this.catalogHost + '/opac/extras/ac/jacket';
    public coverURLLg: string = this.coverURLBase + '/large/r/';
    public coverURLMd: string = this.coverURLBase + '/medium/r/';
    public coverURLSm: string = this.coverURLBase + '/small/r/';
    public passwordResetURLPrefix: string = 'https://' + this.catalogHost + '/main/reset_password_request.json';
    public saveNewPasswordUrl: string = 'https://' + this.catalogHost + '/main/update_user_info.json'
    public featuredURL: string = 'https://' + this.catalogHost + '/main/index.json';
    public searchURL: string = 'https://' + this.catalogHost + '/search.json';
    public loginHashURL: string = 'https://' + this.catalogHost + '/main/login_hash.json';
    public loginPasswordURL: string = 'https://' + this.catalogHost + '/main/login.json';
    public logoutURL: string = 'https://' + this.catalogHost + '/main/logout.json';
    public checkoutsURL: string = 'https://' + this.catalogHost + '/checkouts.json';
    public checkoutRenewURL: string = 'https://' + this.catalogHost + '/main/renew_checkouts.json';
    public holdsURL: string = 'https://' + this.catalogHost + '/holds.json';
    public holdPlaceURL: string = 'https://' + this.catalogHost + '/place_hold.json';
    public holdManageURL: string = 'https://' + this.catalogHost + '/main/manage_hold.json';
    public holdPickupUpdateURL: string = 'https://' + this.catalogHost + '/main/update_hold_pickup.json';
    public itemDetailsURL: string = 'https://' + this.catalogHost + '/main/details.json';

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

    error_handler(){
        let alert = this.alertCtrl.create({
            title: "Opps...",
            subTitle: 'Network error. Check your internet connection or try again later',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    return
                },
            }]
        });
        alert.present();
    }

    logout_alert(){
        let alert = this.alertCtrl.create({
            title: "Opps...",
            subTitle: 'Your login has expired please login and try again',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.events.publish('log_me_out')
                },
            }]
        });
        alert.present();
    }

    show_more(id, div_type){
        var div_to_hide = id + '_' + div_type
        var div_to_show = div_to_hide + '_full'
        document.getElementById(div_to_show).setAttribute("style", "display: block")
        document.getElementById(div_to_hide).setAttribute("style", "display: none")

    }

    show_less(id, div_type){
        var div_to_show = id + '_' + div_type
        var div_to_hide = div_to_show + '_full'
        document.getElementById(div_to_show).setAttribute("style", "display: block")
        document.getElementById(div_to_hide).setAttribute("style", "display: none")
    }
}
