import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {EmpleadoResponse} from "../interfaces/empleado-response";
import {EmpleadoRequest} from "../interfaces/empleado-request";

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private url = `${environment.urlApi}/empleados`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<EmpleadoResponse[]> {
    return this.http.get<EmpleadoResponse[]>(`${this.url}`);
  }

  get(codigo: string): Observable<EmpleadoResponse> {
    return this.http.get<EmpleadoResponse>(`${this.url}/${codigo}`);
  }

  post(request: EmpleadoRequest): Observable<EmpleadoResponse> {
    return this.http.post<EmpleadoResponse>(`${this.url}`, request);
  }

  put(codigo: string, request: EmpleadoRequest): Observable<EmpleadoResponse> {
    return this.http.put<EmpleadoResponse>(`${this.url}/${codigo}`, request);
  }

  delete(codigo: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/${codigo}`);
  }

  search(query: string): Observable<EmpleadoResponse[]> {
    return this.http.get<EmpleadoResponse[]>(`${this.url}/buscar/${query}`);
  }

}
