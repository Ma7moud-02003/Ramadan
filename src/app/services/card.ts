import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { apis } from '../environments/apis.env';

@Injectable({
  providedIn: 'root',
})
export class Crad {
private http=inject(HttpClient);
max=1000;
numOfAyah=signal<number>(Math.floor(Math.random()*this.max))

 
getAyah()
{
  return  this.http.get(`${apis.ayahApi}/${this.numOfAyah()}`);
}
}
