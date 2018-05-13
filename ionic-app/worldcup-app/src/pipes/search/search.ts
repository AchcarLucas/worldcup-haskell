import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], terms: string) {
   	if(!items) return [];
	  if(!terms) return items;

    return items.filter( it => {
    	return String(it.number).toLowerCase().includes(terms.toLowerCase()) || String(it.name).toLowerCase().includes(terms.toLowerCase()); // only filter country name
    });
  }
}
