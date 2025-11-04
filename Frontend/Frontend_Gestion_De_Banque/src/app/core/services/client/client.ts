import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environnement } from '../../../../environnements/environnement';
import { ClientInterface } from '../../Models/Client';

@Injectable({
  providedIn: 'root',
})
export class clientService {
  constructor(private http : HttpClient){}

  /**
   * recupeartion de la liste des clients
   * @returns observable<Client[]> 
   */
  getClients() : Observable<ClientInterface[]> {
    return this.http.get<ClientInterface[]>(`${environnement.apiUrl}/${environnement.prefix}/clients`);
  }

  /**
   * creation d'un client
   * @returns 
   */
  postClient(client : ClientInterface): Observable<ClientInterface> {
    return this.http.post<ClientInterface>(`${environnement.apiUrl}/${environnement.prefix}/clients` , client) ;
  }

  /**
   * Recupeartion d'un client
   * @param clientId 
   * @returns 
   */
  getOneClient(clientId : number) : Observable<ClientInterface> {
    return this.http.get<ClientInterface>(`${environnement.apiUrl}/${environnement.prefix}/clients/${clientId}`) ;
  }
}
