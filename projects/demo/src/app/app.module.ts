import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AnecdataCoreModule } from 'anecdata-ngcore';
import { DataAnalysisModule } from 'dist/data-analysis';
import { StarterLibraryModule } from 'projects/starter-library/src/public-api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,

    DataAnalysisModule,
    BrowserModule,
    AppRoutingModule,
    StarterLibraryModule,
    AnecdataCoreModule.forRoot({
      apiKey: '93752983567823965823965872365872',
      appName: 'ng-analysis-demo',
      appVersion: '0.2.0',
      baseUrl: 'https://www.anecdata.org',
    }),
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
