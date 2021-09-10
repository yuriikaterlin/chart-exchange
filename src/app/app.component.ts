import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ApiService } from './api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chart: Chart;

  constructor(
    private apiService: ApiService
    )
    {
    this.chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Currency exchange'
      },
      xAxis: {
        title: {
          text: 'Date'
        }
     },
     yAxis: {
        title: {
          text: 'UAH'
        }
     },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Line 1',
          type: 'line',
          data: [[2, 26], [1, 29]]
        }
      ]
    });
  }

  add() {

    this.apiService.getData().subscribe((data:any) => {
      console.log(data);
    });

    this.chart.removeSeries(this.chart.ref.series.length - 1);

    this.chart.addSeries({
      name: 'Line 11',
      type: 'line',
      data: [
        [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
        [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
        [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
        [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
        [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
        [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
      ]}, true, true);
  }
}
