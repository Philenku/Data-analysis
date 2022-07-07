import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StarterLibraryModule } from 'projects/starter-library/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataAnalysisModule } from 'projects/data-analysis/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StarterLibraryModule,
    DataAnalysisModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
