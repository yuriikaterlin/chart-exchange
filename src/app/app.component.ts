import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from './api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chart: any;
  currencyList: any = []
  chartData: any = [];
  chartxAxis: any = [];

  reactiveForm = new FormGroup({
    startDate: new FormControl('2021-09-01'),
    endDate: new FormControl('2021-09-08'),
    currency: new FormControl('USD'),
  })

  ngOnInit() {

    this.apiService.getCurrencyList().subscribe((data:any) => {
        data.forEach((elem: { cc: any; }) => {
          console.log(elem)
          this.currencyList.push(elem.cc)
        })
      console.log(data)
    });

    this.getChartData()
    this.reactiveForm.valueChanges.subscribe(selectedValue => {
      console.log('form value changed')
      console.log(selectedValue)
      this.getChartData()
    })
  }

  getChartData () {
    this.chartData = [];
    let currencyArray = [];
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
        this.chartData.push(data[0].rate)
        this.chartxAxis.push(data[0].exchangedate)
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
    console.log(this.chartxAxis)
    // @ts-ignore
    this.chart = new Chart({
      xAxis: {
        // @ts-ignore
        data: this.chartxAxis,
        silent: false,
        splitLine: {
          show: false,
        },
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
