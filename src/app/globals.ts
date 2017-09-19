import { Injectable } from '@angular/core';

@Injectable()
export class Globals{
   public app_title:string = 'TADL Mobile';
   public multi_location:boolean = true;
   public pickup_locations: Array<{name: string, code: string}> = [
        { name: 'Woodmere', code: '23' },
        { name: 'Interlochen', code: '24' },
        { name: 'Kingsley', code: '25' },
        { name: 'Peninsula', code: '26' },
        { name: 'Fife Lake', code: '27' },
        { name: 'East Bay', code: '28' },
	];
}