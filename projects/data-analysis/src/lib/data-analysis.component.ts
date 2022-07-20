import { Component, Input, SimpleChanges } from '@angular/core';
import { DataItem } from '@swimlane/ngx-charts';
import { FieldData, ObservationApiService } from 'anecdata-ngcore';
import { RowQueryData } from 'anecdata-ngcore/lib/interfaces/observations/RowQueryData';
import { RowResultData } from 'anecdata-ngcore/lib/interfaces/observations/RowResultData';
import { DataFrame, fromJSON, ISeries, Series } from 'data-forge';
import {
  BehaviorSubject,
  debounceTime,
  map,
  Observable,
  shareReplay,
  Subject,
  switchMap,
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

  results: DataItem[] = [];

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
    this.fields = this.rows.pipe(
      map((res) => res.map((r) => r.Field)),
      shareReplay(1)
    );

    this.fields.subscribe((data) => {
      this.onDataLoaded(data);
    });
  }

  /**
   * Cait's implementation
   * @param data
   */
  onDataLoaded(data: FieldData[][]) {
    /**
     * Map the data structures to a simple key:value
     */
    const series = data.map((rowFields) => {
      // Create a JS object to assign values to
      const base: Record<string, number> = {};

      rowFields
        // Only include numbers in the object
        .filter((field) => field.type === 'number')
        .forEach((field) => {
          // Convert the value to a floating-point number
          let val = parseFloat(field.numeric_value as any as string);

          // Treat 'null' as zero
          if (field.numeric_value === null) {
            val = 0;
          }

          // Assign it to the object.
          base[field.name!] = val;
        });

      return base;
    });

    console.log(series);

    // Create a DataFrame
    const df = new DataFrame(series);

    const firstFrame = series[0] ?? {};

    const summarizers: Record<string, (obj: any) => number> = Object.keys(
      firstFrame
    ).reduce((cur, key: string) => {
      return Object.assign(cur, {
        [key]: (columnObj: ISeries) => columnObj.sum(),
      });
    }, {});

    const results = df.summarize(summarizers);

    console.log('results', results);

    /**
     * Create an object that ngx-charts can understand:
     */
    const chartData: DataItem[] = [];

    for (let col of Object.keys(results)) {
      chartData.push({ value: results[col], name: col });
    }
    // Assign 'the data to 'results':
    this.results = chartData;
  }

  /**
   * Student-defined method for processing data
   * @param data
   */
  onDataLoadedPhilemon(data: FieldData[][]) {
    const df = new DataFrame(data);
    const alldf: any[] = [];
    let num = 0;

    for (const column of df.getColumns()) {
      const name = column.name;
      const series = column.series;
      console.log(name, series);

      var newdf: any[] = [];

      for (const value of series) {
        const tjson = value['value'];
        newdf.push(tjson);
      }

      const temp = new Series(newdf);

      const tempdf = temp.toArray();

      if (num == 0) {
        for (const val of tempdf) {
          alldf.push([val]);
          num = 1;
        }
      } else {
        for (let i = 0; i < 79; i++) {
          console.log(i);
          alldf[i].push(tempdf[i]);
        }
      }
    }

    const df_sum = fromJSON(JSON.stringify(alldf))
      .renameSeries({
        '0': 'Num_bottles',
        '1': 'Plastic_Lids',
        '2': 'Bottle_Caps',
        '3': 'Forks_Knives_and_Spoons',

        '4': 'Plastic_Straws',
        '5': 'Food_wrappers',
        '6': 'Cigarette_Filters',
        '7': 'Vape_Cartridges',
        '8': 'Foam_Pieces',
        '9': 'Glass_Pieces',
        '10': 'Plastic_pieces',
      })
      .summarize({
        Plastic_Lids: (series) => series.sum(),
        Bottle_Caps: (series) => series.sum(),
        Forks_Knives_and_Spoons: (series) => series.sum(),
        Plastic_Straws: (series) => series.sum(),
        Food_wrappers: (series) => series.sum(),
        Cigarette_Filters: (series) => series.sum(),
        Vape_Cartridges: (series) => series.sum(),
        Foam_Pieces: (series) => series.sum(),
        Glass_Pieces: (series) => series.sum(),
        Plastic_pieces: (series) => series.sum(),
      });

    const array: any[] = [];
    for (const key in df_sum) {
      array.push({
        name: key,
        value: df_sum[key],
      });
    }
    console.log(array);
    this.results.push(array[0]);
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
