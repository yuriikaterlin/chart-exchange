import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from './api.service';
import { range } from 'rxjs';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';

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
  dataSource: any = [];
  displayedColumns: string[] = ['txt', 'rate', 'cc', 'exchangedate'];
  //dataSource = ELEMENT_DATA;

  lineChartLegend = true;
  lineChartType: any = 'line';
  lineChartPlugins = [];
  lineChartOptions = {
    responsive: true,
  };
  lineChartData:ChartDataSets[] = [];
  lineChartLabels: Label[] = [];
  
  displayChart:  boolean | any;
  displayTable: boolean | any;
  

  reactiveForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    currency: new FormControl('USD'),
    mode: new FormControl('1')
  })


  handleTable() {
    this.displayTable = true;
    this.displayChart = false;
   }
 
   handleChart() {
     this.displayTable = false;
     this.displayChart = true;
   }

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

  getTableData() {
    
  }

  getChartData () {
    this.chartData = [];
    let start = Date.parse(this.reactiveForm.get('startDate')?.value)/1000;
    let end = Date.parse(this.reactiveForm.get('endDate')?.value)/1000;
    let dateStr = [];

    for (start; start <= end; start = start + 86400) {
      let arr = [];
      let dateString = new Date(start * 1000).toLocaleDateString("en-US",{ year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');
      arr.push(dateString[2]);
      arr.push(dateString[0]);
      arr.push(dateString[1]);
      dateStr.push(arr.join(''));
      //this.chartData.push([Date.UTC(parseInt(dateString[2]), parseInt(dateString[0]) - 1,  parseInt(dateString[1])), ])
    }
        this.apiService.handleData(dateStr, this.reactiveForm.get("currency")?.value)
    .subscribe(
      (data:any) => {
        this.dataSource = data  
        this.createChart()
      }
    );
      // @ts-ignore
      // this.apiService.getData(this.reactiveForm.get("currency").value, dateStr).subscribe((data:any) => {
      //   console.log(data[0])
      //   this.dataSource.push(data[0])
      //   this.chartData.push([Date.UTC(parseInt(dateString[2]), parseInt(dateString[0]) - 1,  parseInt(dateString[1])), data[0].rate])
      //   this.createChart()
      // });
    
  }

    constructor(
    private apiService: ApiService
    )
    {

  }

  createChart () {
    //let rate = this.dataSource.map((item: any) => item.rate);
      this.lineChartData = [
      { data: this.dataSource.map((item: any) => item.rate), label: this.reactiveForm.get("currency")?.value },
      ]; 
      this.lineChartLabels  = this.dataSource.map((item: any) => item.exchangedate);



    //let exchangedate = this.dataSource.map((item: any) => item.exchangedate);
    

    //console.log('rate', rate)
    //console.log('exchage', exchangedate);  
    // @ts-ignore
  //  console.log('chardata',this.chartData)
  //   this.chart = new Chart({
  //     title:
  //         {
  //         text: 'Currency Exchange'
  //         },
  //     xAxis: {
  //       type: 'datetime',
  //       title: {
  //         text: 'Date'
  //       }
  //     },
  //     // @ts-ignore
  //     yAxis: {
  //       title: {
  //         // @ts-ignore
  //         text: this.reactiveForm.get("currency").value
  //       }
  //     },
  //     series: [
  //       {
  //         name: `UAH to ${this.reactiveForm.get('currency')?.value}`,
  //         type: 'line',
  //         data: rate
  //       }
  //     ]
  //   });
  }
}
