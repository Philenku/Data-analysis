import { Component, Input, SimpleChanges } from '@angular/core';
import { ObservationApiService } from 'anecdata-ngcore';
import { RowQueryData } from 'anecdata-ngcore/lib/interfaces/observations/RowQueryData';
import { RowResultData } from 'anecdata-ngcore/lib/interfaces/observations/RowResultData';
import { DataFrame, Series,fromJSON } from 'data-forge';
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

  sample_visual: any[] = []

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
    this.fields.subscribe(data => {
      const row_data = data as any[][]
      const df = new DataFrame(row_data)
      const alldf :any[] = []
      var num = 0
      for (const column of df.getColumns()) {
        const name = column.name;
        const series = column.series;
        var newdf: any[] = []
          for (const value of series){
            const tjson = value['value']
            newdf.push(tjson)
          }
        const temp = new Series(newdf)
        const tempdf = temp.toArray()
        if(num==0){
          for(const val of tempdf){
            alldf.push([val])
            num = 1
          }
        }else{
          for(let i=0;i<newdf.length;i++){
            alldf[i].push(tempdf[i])
          }
        }
      }
      const df_sum = fromJSON(JSON.stringify(alldf))
      .renameSeries({'0': 'Num_bottles',
      '1':"Plastic_Lids",
      '2':"Bottle_Caps",
      '3': "Forks_Knives_and_Spoons",

      '4':"Plastic_Straws",
      '5':"Food_wrappers",
      '6':"Cigarette_Filters",
      '7':"Vape_Cartridges",
      '8':"Foam_Pieces",
      '9':"Glass_Pieces",
      '10': "Plastic_pieces"

    })
    .summarize({
      Num_bottles : series => series.sum(),
      Plastic_Lids : series => series.sum() ,
      Bottle_Caps  : series => series.sum() ,
      Forks_Knives_and_Spoons  : series => series.sum() ,
      Plastic_Straws : series => series.sum() ,
      Food_wrappers : series => series.sum() ,
      Cigarette_Filters : series => series.sum() ,
      Vape_Cartridges : series => series.sum() ,
      Foam_Pieces : series => series.sum() ,
      Glass_Pieces : series => series.sum() ,
      Plastic_pieces : series => series.sum() 
    })
    const array :any[] = []
    for(const key in df_sum){
      array.push({
        name: key,
        value: df_sum[key]
      })
    }
      console.log(array)
      this.sample_visual.push(array)
    })
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
