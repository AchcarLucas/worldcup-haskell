import { NgModule } from '@angular/core';
import { SearchPipe } from './search/search';
import { FilterPipe } from './filter/filter';
@NgModule({
	declarations: [SearchPipe,
    FilterPipe],
	imports: [],
	exports: [SearchPipe,
    FilterPipe]
})
export class PipesModule {}
