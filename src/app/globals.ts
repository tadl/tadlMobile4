import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
   public app_title:string = 'TADL Mobile';
   public multi_location:boolean = true;
   public pickup_locations: Array<{name: string, code: string}> = [
        { name: 'Woodmere', code: '23' },
        { name: 'Interlochen', code: '24' },
        { name: 'Kingsley', code: '25' },
        { name: 'Peninsula', code: '26' },
        { name: 'Fife Lake', code: '27' },
        { name: 'East Bay', code: '28' }
	];
    public friendly_location_name:Array<{code: string, name: string}> = [
        { code: 'TADL-EBB', name: 'East Bay Branch Library' },
        { code: 'TADL-KBL', name: 'Kingsley Branch Library' },
        { code: 'TADL-PCL', name: 'Peninsula Community Library' },
        { code: 'TADL-IPL', name: 'Interlochen Public Library' },
        { code: 'TADL-FLPL', name: 'Fife Lake Public Library' },
        { code: 'TADL-WOOD', name: 'TADL Main Library' }
    ];

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
