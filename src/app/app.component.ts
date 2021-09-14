import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from './api.service';

export interface PeriodicElement {
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chart: any;
  currencyList: any = []
  chartData: any = [];
  tableData: any = [];

  displayedColumns: string[] = ['txt', 'rate', 'cc', 'exchangedate'];
  dataSource = ELEMENT_DATA;

  reactiveForm = new FormGroup({
    startDate: new FormControl('2021-09-01'),
    endDate: new FormControl('2021-09-08'),
    currency: new FormControl('USD'),
    mode: new FormControl('1')
  })

  ngOnInit() {

    this.apiService.getCurrencyList().subscribe((data:any) => {
        data.forEach((elem: { cc: any; }) => {
          this.currencyList.push(elem.cc)
        })
    });

    this.getChartData()
    this.reactiveForm.valueChanges.subscribe(selectedValue => {
      this.getChartData()
    })
  }

  getChartData () {
    this.chartData = [];
    this.tableData = [];
    this.dataSource = ELEMENT_DATA;
    let start = Date.parse(this.reactiveForm.get('startDate')?.value)/1000;
    let end = Date.parse(this.reactiveForm.get('endDate')?.value)/1000;

    for (start; start <= end; start = start + 86400) {
      let arr = [];
      let dateString = new Date(start * 1000).toLocaleDateString("en-US",{ year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');
      arr.push(dateString[2]);
      arr.push(dateString[0]);
      arr.push(dateString[1]);
      let dateStr = arr.join('');
      // @ts-ignore
      this.apiService.getData(this.reactiveForm.get("currency").value, dateStr).subscribe((data:any) => {
        console.log(data[0])
        this.dataSource.push(data[0])
        this.chartData.push([Date.UTC(parseInt(dateString[2]), parseInt(dateString[0]) - 1,  parseInt(dateString[1])), data[0].rate])
        this.createChart()
      });
    }
  }

    constructor(
    private apiService: ApiService
    )
    {

  }

  createChart () {
    // @ts-ignore
    console.log(this.chartData)
    this.chart = new Chart({
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%e. %b',
          year: '%b'
        },
        title: {
          text: 'Date'
        }
      },
      // @ts-ignore
      yAxis: {
        title: {
          // @ts-ignore
          text: this.reactiveForm.get("currency").value
        }
      },
      series: [
        {
          name: `UAH to ${this.reactiveForm.get('currency')?.value}`,
          type: 'line',
          data: this.chartData
        }
      ]
    });
  }
}
