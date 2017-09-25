import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
    public systemShortName: string = 'TADL';
    public appName: string = this.systemShortName + ' Mobile';
    public multi_location: boolean = true;

    pickupLocations = new Map<string, string>([
        ['23', 'Woodmere'],
        ['24', 'Interlochen'],
        ['25', 'Kingsley'],
        ['26', 'Peninsula'],
        ['27', 'Fife Lake'],
        ['28', 'East Bay']
    ]);

    locationName = new Map<string, string>([
        ['TADL-EBB', 'East Bay Branch Library'],
        ['TADL-KBL', 'Kingsley Branch Library'],
        ['TADL-PCL', 'Peninsula Community Library'],
        ['TADL-IPL', 'Interlochen Public Library'],
        ['TADL-FLPL', 'Fife Lake Public Library'],
        ['TADL-WOOD', 'TADL Main Library']
    ]);

    public pickup_locations: Array<{name: string, code: string}> = [
        { name: 'Woodmere', code: '23' },
        { name: 'Interlochen', code: '24' },
        { name: 'Kingsley', code: '25' },
        { name: 'Peninsula', code: '26' },
        { name: 'Fife Lake', code: '27' },
        { name: 'East Bay', code: '28' }
    ];

    public friendly_location_name: Array<{code: string, name: string}> = [
        { code: 'TADL-EBB', name: 'East Bay Branch Library' },
        { code: 'TADL-KBL', name: 'Kingsley Branch Library' },
        { code: 'TADL-PCL', name: 'Peninsula Community Library' },
        { code: 'TADL-IPL', name: 'Interlochen Public Library' },
        { code: 'TADL-FLPL', name: 'Fife Lake Public Library' },
        { code: 'TADL-WOOD', name: 'TADL Main Library' }
    ];

    public newsURL: string = 'https://www.tadl.org/wp-json/wp/v2/posts?per_page=20&amp;categories_exclude=93';
    public eventsURL: string = 'https://www.tadl.org/wp-json/tribe/events/v1/events?per_page=20&amp;start_date=now';
    public logoURL: string = 'https://www.tadl.org/logo.png';
    public hoursURL: string = 'https://www.tadl.org/wp-content/uploads/json/parsed-hours.json';

    public coverURLPrefix: string = 'https://catalog.tadl.org/opac/extras/ac/jacket/medium/r/';
    public featuredURL: string = 'https://catalog.tadl.org/main/index.json';
    public searchURL: string = 'https://catalog.tadl.org/search.json';

    public loginURL: string = 'https://catalog.tadl.org/login.json';
    public checkoutsURL: string = 'https://catalog.tadl.org/checkouts.json';
    public checkoutRenewURL: string = 'https://catalog.tadl.org/main/renew_checkouts.json';
    public holdsURL: string = 'https://catalog.tadl.org/holds.json';
    public holdPlaceURL: string = 'https://catalog.tadl.org/place_hold.json';
    public holdManageURL: string = 'https://catalog.tadl.org/main/manage_hold.json';
    public holdPickupUpdateURL: string = 'https://catalog.tadl.org/main/update_hold_pickup.json';
    public itemDetailsURL: string = 'https://catalog.tadl.org/main/details.json';

    public passwordResetURLPrefix: string = 'https://apiv2.catalog.tadl.org/account/password_reset'; /* really? */

    /* helper functions */
    shortname_to_friendlyname (shortname) {
        var location = this.array_search(shortname, this.friendly_location_name);
        return location.name;
    }

    array_search(key, array) {
        for (var i=0; i < array.length; i++) {
            if (array[i].code === key) {
                return array[i];
            }
        }
    }


}
