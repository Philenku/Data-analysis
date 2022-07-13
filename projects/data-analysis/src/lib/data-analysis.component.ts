import { Component } from '@angular/core';
import { ObservationApiService } from 'anecdata-ngcore';

import { map, Observable, Subject } from 'rxjs';
@Component({
  selector: 'lib-data-analysis',
  template: `
    <p>
      Data-analysis works! {{((posts | async) ?? []).length}} observations loaded from server.
    </p>
  `,
  styles: [
  ]
})
export class DataAnalysisComponent  {


  posts: Observable<any[]> = new Subject();

  constructor(
    private obsApi: ObservationApiService
  ) { }

  ngOnInit(): void {
    this.posts = this.obsApi.list({}).pipe(map(res => res.posts));
  }

}
