import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.url}/tasks`;

  constructor(private httpClient:HttpClient) { }

  fetchTasks(paramsObj?: any): Observable<any> {
    let params = new HttpParams();
    if (paramsObj) {
    Object.keys(paramsObj).forEach(key => {
        let value = paramsObj[key];

        if (key === 'dateRange' && Array.isArray(value) && value.length === 2) {
          params = params.append('dueDateFrom', value[0]);
          params = params.append('dueDateTo', value[1]);
          return;
        }

        if(key === 'sortingParams') {
          params = params.append('sortBy', value[0]);
          params = params.append('sortOrder', value[1]);
          return;
        }

        if (key === 'status' || key === 'type') {
          if (Array.isArray(value)) {
            value = value.map((v: any) => isNaN(Number(v)) ? v : Number(v));
          } else if (!isNaN(Number(value))) {
            value = Number(value);
          }
        }
        if (Array.isArray(value)) {
          value.forEach((v: string) => {
            params = params.append(key, v);
          });
        } else if (value !== undefined && value !== null) {
          params = params.append(key, value);
        }
      });
    }

    return this.httpClient.get<any>(this.apiUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: params
    });
  }

  addTask(task: any): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, task, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateTask(task: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/${task.id}`, task, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteTask(taskId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${taskId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
