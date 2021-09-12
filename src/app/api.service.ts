import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 domain: string = "https://bank.gov.ua/"

  constructor(private _http: HttpClient){ }

  getData(currency: string, currentDate: string) {
    return this._http.get(`${this.domain}NBUStatService/v1/statdirectory/exchange?valcode=${currency}&date=${currentDate}&json`);
  }

  getCurrencyList() {
    return this._http.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json');
  }
}
