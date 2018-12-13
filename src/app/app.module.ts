import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component'; 
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MonthDatePickerComponent } from './month-date-picker/month-date-picker.component'
import { Constants }                    from '../helpers/test.constants';


@NgModule({
  declarations: [
    AppComponent,
MonthDatePickerComponent


  ],
  imports: [
    BrowserModule,
    NgbModule,
    ReactiveFormsModule,
     FormsModule,

  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
     
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
