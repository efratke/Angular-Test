import { Component } from '@angular/core';
import { Revenue } from '../helpers/revenue.service';
import { Constants } from '../helpers/test.constants';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'efrat';
  rows: string[];
  headers: string[];
  revenues: Revenue[] = [];
  sumMonth: number = 0;
  myForm: FormGroup;
  capacity: number = 0;
  @ViewChild('fileImportInput')
  fileImportInput: any;
  isPanelVisible: boolean = false;
  isReusltVisible: boolean = false;
  csvRecords = [];

  calculate(event) {
    this.sumMonth = 0;
    let dif: number = 0;
    let daily: number = 0;
    let start: Date;
    let end: Date;

    for (let i = 0; i < this.revenues.length; i++) {
     
      //startDate equals the selected date
      start = new Date(this.revenues[i].startDay);
      end = new Date(this.revenues[i].endDay);
      if (!isNaN(end.getTime()))
        end = new Date(this.revenues[i].endDay);
      else {
        end = new Date();
        end.setHours(0, 0, 0, 0);
      }


      if (start.getMonth() + 1 == this.myForm.value.fecha.month
        && start.getFullYear() == this.myForm.value.fecha.year) {
        if ((end > start && end.getMonth() + 1 != start.getMonth() + 1)) {
          let firstDay = start.getDate();
          let numDays = this.getNumberOfDaysInMonth(start.getMonth() + 1, start.getFullYear());
          dif = numDays - firstDay + 1;
          daily = this.revenues[i].monthlyPrice / numDays;
          this.sumMonth += daily * dif;

        }
        else {
          //if start and end are at the same month
          if ((end.getMonth() + 1 == start.getMonth() + 1) && end.getFullYear() == start.getFullYear()) {
            dif = end.getDate() - start.getDate() + 1;
            daily = this.revenues[i].monthlyPrice / this.getNumberOfDaysInMonth(end.getMonth() + 1, end.getFullYear());
            this.sumMonth += daily * dif;
          }

        }
      }
      else {
        if (start < this.getFirdtDayOfMonth(this.myForm.value.fecha.month, this.myForm.value.fecha.year)) {
          if (end > this.geLastDayInMonth(this.myForm.value.fecha.month, this.myForm.value.fecha.year)) {
            this.sumMonth += this.revenues[i].monthlyPrice * 1;
          }
          else {
            if (end <= this.geLastDayInMonth(this.myForm.value.fecha.month, this.myForm.value.fecha.year)) {
              dif = end.getDate();
              daily = this.revenues[i].monthlyPrice / this.getNumberOfDaysInMonth(end.getMonth() + 1, end.getFullYear());
              this.sumMonth += daily * dif;
            }
            else {

              if (end == this.getFirdtDayOfMonth(this.myForm.value.fecha.month, this.myForm.value.fecha.year)) {

                daily = this.revenues[i].monthlyPrice / this.getNumberOfDaysInMonth(end.getMonth() + 1, end.getFullYear());
                this.sumMonth += daily * 1;
              }
            }
          }
        }

      }
      console.log(i + " "+ this.sumMonth);
    }

    this.capacity = 0;
    let beginMonth: Date;
    let endMonth: Date;
    let totalCapacity: number = 0;

    //get total capacity of offices
    for (let i = 0; i < this.revenues.length; i++) {
      totalCapacity += (this.revenues[i].capacity) * 1;
    }

    beginMonth = this.getFirdtDayOfMonth(this.myForm.value.fecha.month, this.myForm.value.fecha.year);
    endMonth = this.geLastDayInMonth(this.myForm.value.fecha.month, this.myForm.value.fecha.year);

    for (let i = 0; i < this.revenues.length; i++) {
      start = new Date(this.revenues[i].startDay);

      end = new Date(this.revenues[i].endDay);
      //if we dont have end day
      if (!isNaN(end.getTime()))
        end = new Date(this.revenues[i].endDay);
      else {
        end = new Date();
        end.setHours(0, 0, 0, 0);
      }


      if (beginMonth > start && beginMonth < end)
        this.capacity += (this.revenues[i].capacity) * 1;
      else if (endMonth > start && endMonth < end)
        this.capacity += (this.revenues[i].capacity) * 1;
      else if (beginMonth.valueOf() == start.valueOf())
        this.capacity += (this.revenues[i].capacity) * 1;
      else if (endMonth.valueOf() == start.valueOf())
        this.capacity += (this.revenues[i].capacity) * 1;
      else if (beginMonth.valueOf() == end.valueOf())
        this.capacity += (this.revenues[i].capacity) * 1;
      else if (endMonth.valueOf() == end.valueOf())
        this.capacity += (this.revenues[i].capacity) * 1;
      else if (beginMonth < start && endMonth > start)
        this.capacity += (this.revenues[i].capacity) * 1;

    }
    debugger
    this.capacity = totalCapacity - this.capacity;
    this.isReusltVisible = true;

  }

  getFirdtDayOfMonth(month: number, year: number): Date {
    let date: Date = new Date();
    if (month < 10) {
      date = new Date(year + '-0' + month + '-01T00:00:00');
    }
    else {
      date = new Date(year + '-' + month + '-01T00:00:00');
    }
    return (date);


  }
  geLastDayInMonth(month: number, year: number): Date {
    let date: Date = new Date();
    if (month < 10) {
      date = new Date(year + '-0' + month + '-01T00:00:00');
    }
    else {
      date = new Date(year + '-' + month + '-01T00:00:00');
    }

    date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return (date);

  }
  getNumberOfDaysInMonth(month: number, year: number): number {
    return (this.geLastDayInMonth(month, year).getDate());


  }
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      fecha: { year: 2018, month: 10 }
    });

  }



  fileChangeListener($event): void {

    var text = [];
    var files = $event.srcElement.files;

    var input = $event.target;
    var reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      let csv = reader.result;
      let csvData = csv.toString();
      let csvRecordsArray = csvData.split(/\r|\n|\r/);
      this.headers = csvRecordsArray[0].split(',');

      for (let i = 1; i < csvRecordsArray.length; i++) {

        let data = csvRecordsArray[i].split(',');
        if (data.length === this.headers.length) {
          let tarr = [];
          for (let j = 0; j < this.headers.length; j++) {
            tarr.push(data[j]);
          }
          let r = new Revenue();
          r.capacity = tarr[0];
          r.monthlyPrice = tarr[1];
          r.startDay = tarr[2];
          r.endDay = tarr[3];

          this.revenues.push(r);

        }
      }
    }
    //Show the panel after getting the table
    this.isPanelVisible = true;
  };


}
