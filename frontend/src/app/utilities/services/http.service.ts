import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  API_URL = 'http://localhost:3000/';

  constructor(private _httpClient: HttpClient) {}

  login(data: any): Observable<any> {
    const href = this.API_URL + 'user/login';

    return this._httpClient.post<any>(href, data, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    });
  }

  getUsers(): Observable<any> {
    const href = this.API_URL + 'user';

    return this._httpClient.get<any>(href, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token') || '',
      },
    });
  }


}
