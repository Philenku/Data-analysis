import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ApiService, ObservationApiService } from 'anecdata-ngcore';
import { DataAnalysisComponent } from './data-analysis.component';



@NgModule({
  imports: [CommonModule],
  declarations: [DataAnalysisComponent],
 
  exports: [DataAnalysisComponent],
  providers: [ApiService, ObservationApiService, HttpClient],
})
export class DataAnalysisModule {}
