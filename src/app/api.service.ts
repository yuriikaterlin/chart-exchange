import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 domain: string = "https://bank.gov.ua/"

  constructor(private _http: HttpClient){ }

  getData() {
      return this._http.get(`${this.domain}NBUStatService/v1/statdirectory/exchange?valcode=USD&date=20210808&json`);
  }
}
