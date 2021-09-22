import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency, Api } from './api.model';
import { Observable, from } from 'rxjs';
import {  map, scan, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api: Api = {
    New: `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json`,
    Currency: `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange`,
  };

  constructor(private _http: HttpClient){ }

  getData(currency: string, currentDate: string): Observable<Currency[]> {
    return this._http.get<Currency[]>(
      `${this.api.Currency}?valcode=${currency}&date=${currentDate}&json`
      );
  }

  getCurrencyList(): Observable<Currency[]> {
    return this._http.get<Currency[]>(this.api.New)
  }

  handleData(range: Array<string>, currency: string): Observable<Currency[]> {
    return from(range)
       .pipe(
         concatMap(item => {
           return this.getData(currency, item);
         }),
         map(
           (data: any) =>
             data.map((item: any) => {
               return {
                 rate: item.rate,
                 exchangedate: item.exchangedate,
               };
             }),
         ),
         scan((acc: Array<Currency>, item: Array<Currency>) => {
           return [...acc, ...item];
         }, [])
       )
   }
 }
