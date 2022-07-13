import { Component, Input, SimpleChanges } from '@angular/core';
import { ObservationApiService } from 'anecdata-ngcore';
import { RowQueryData } from 'anecdata-ngcore/lib/interfaces/observations/RowQueryData';
import { RowResultData } from 'anecdata-ngcore/lib/interfaces/observations/RowResultData';

import {
  BehaviorSubject,
  debounceTime,
  map,
  Observable,
  shareReplay,
  Subject,
  switchMap
} from 'rxjs';
@Component({
  selector: 'lib-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.scss'],
})
export class DataAnalysisComponent {
  @Input() query: RowQueryData = {};

  rows: Observable<RowResultData[]> = new Subject();
  fields: Observable<RowResultData['Field'][]> = new Subject();

  // Observable of all query changes. Everything listens to this.
  queryChanges: BehaviorSubject<RowQueryData> = new BehaviorSubject({});

  destroy = new Subject<void>();

  constructor(private obsApi: ObservationApiService) {}

  ngOnInit(): void {

    this.queryChanges.next(this.query);

    this.rows = this.queryChanges.pipe(
      debounceTime(200),
      switchMap((query) => this.obsApi.listRows(query)),
      map((res) => res.rows),
      shareReplay(1)
    );

    this.fields = this.rows.pipe(
      map((res) => res.map((r) => r.Field)),
      shareReplay(1)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query']) {
      this.queryChanges.next(this.query);
    }
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
