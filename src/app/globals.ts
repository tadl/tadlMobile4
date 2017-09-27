import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class Globals {
    public systemShortName: string = 'TADL';
    public catalogHost: string = 'catalog.tadl.org';
    public websiteHost: string = 'www.tadl.org';
    public logoFileName: string = 'logo.png';

    public multi_location: boolean = true;

    /* This might need to remain as an array, because it's iterated for
       the change pickup code                                            */
    public pickup_locations: Array<{name: string, code: string}> = [
        { name: 'Woodmere', code: '23' },
        { name: 'Interlochen', code: '24' },
        { name: 'Kingsley', code: '25' },
        { name: 'Peninsula', code: '26' },
        { name: 'Fife Lake', code: '27' },
        { name: 'East Bay', code: '28' }
    ];

    /* this will be replaced by the locationName map */
    public friendly_location_name: Array<{code: string, name: string}> = [
        { code: 'TADL-EBB', name: 'East Bay Branch Library' },
        { code: 'TADL-KBL', name: 'Kingsley Branch Library' },
        { code: 'TADL-PCL', name: 'Peninsula Community Library' },
        { code: 'TADL-IPL', name: 'Interlochen Public Library' },
        { code: 'TADL-FLPL', name: 'Fife Lake Public Library' },
        { code: 'TADL-WOOD', name: 'TADL Main Library' }
    ];

    /* This might not be used ever. we'll see */
    pickupLocations = new Map<string, string>([
        ['23', 'Woodmere'],
        ['24', 'Interlochen'],
        ['25', 'Kingsley'],
        ['26', 'Peninsula'],
        ['27', 'Fife Lake'],
        ['28', 'East Bay']
    ]);

    /* this will replace the friendly_location_name array 
       because it's just a lookup table, not iterated anywhere */
    locationName = new Map<string, string>([
        ['TADL-EBB', 'East Bay Branch Library'],
        ['TADL-KBL', 'Kingsley Branch Library'],
        ['TADL-PCL', 'Peninsula Community Library'],
        ['TADL-IPL', 'Interlochen Public Library'],
        ['TADL-FLPL', 'Fife Lake Public Library'],
        ['TADL-WOOD', 'TADL Main Library']
    ]);

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
    public newsURL: string = 'https://' + this.websiteHost + '/wp-json/wp/v2/posts?per_page=20&categories_exclude=93';
    public eventsURL: string = 'https://' + this.websiteHost + '/wp-json/tribe/events/v1/events?per_page=20&start_date=now';
    public logoURL: string = 'https://' + this.websiteHost + '/' + this.logoFileName;
    public hoursURL: string = 'https://' + this.websiteHost + '/wp-content/uploads/json/parsed-hours.json';

    /* URLs for catalog things */
    public coverURLPrefix: string = 'https://' + this.catalogHost + '/opac/extras/ac/jacket/medium/r/';
    public featuredURL: string = 'https://' + this.catalogHost + '/main/index.json';
    public searchURL: string = 'https://' + this.catalogHost + '/search.json';
    public loginURL: string = 'https://' + this.catalogHost + '/login.json';
    public checkoutsURL: string = 'https://' + this.catalogHost + '/checkouts.json';
    public checkoutRenewURL: string = 'https://' + this.catalogHost + '/main/renew_checkouts.json';
    public holdsURL: string = 'https://' + this.catalogHost + '/holds.json';
    public holdPlaceURL: string = 'https://' + this.catalogHost + '/place_hold.json';
    public holdManageURL: string = 'https://' + this.catalogHost + '/main/manage_hold.json';
    public holdPickupUpdateURL: string = 'https://' + this.catalogHost + '/main/update_hold_pickup.json';
    public itemDetailsURL: string = 'https://' + this.catalogHost + '/main/details.json';

    /* URLs for ilscatcher2 things */
    public passwordResetURLPrefix: string = 'https://apiv2.catalog.tadl.org/account/password_reset'; /* really? */


    /* HELPER FUNCTIONS */

    /* this won't be necessary once it's converted to a map */
    shortname_to_friendlyname (shortname) {
        var location = this.array_search(shortname, this.friendly_location_name);
        return location.name;
    }
    /* same */
    array_search(key, array) {
        for (var i=0; i < array.length; i++) {
            if (array[i].code === key) {
                return array[i];
            }
        }
    }

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


}
