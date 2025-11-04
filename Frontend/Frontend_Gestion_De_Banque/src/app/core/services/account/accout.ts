import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environnement } from '../../../../environnements/environnement';
import { Account } from '../../Models/Account';

@Injectable({
  providedIn: 'root',
})
export class Accout {
  constructor(private http : HttpClient){}

  /**
   * creation d'un compte
   * @param account 
   * @returns 
   */
  postCompte(account : Account):Observable<Account>{
    return this.http.post<Account>(`${environnement.apiUrl}/${environnement.prefix}/comptes` , account) ;
  }

  /**
   * ecuperation de tous les comptes
   * @param type 
   * @returns 
   */
  getAccounts() : Observable<Account[]>{
    return this.http.get<Account[]>(`${environnement.apiUrl}/${environnement.prefix}/comptes`) ;
  }

  /**
   * ecuperation de tous les comptes
   * @param type 
   * @returns 
   */
  getAccountsByClient(id : number) : Observable<Account[]>{
    return this.http.get<Account[]>(`${environnement.apiUrl}/${environnement.prefix}/comptes/${id}`) ;
  }

  /**
   * Recuperation d'un compte par numero de compte et le type de compte 
   * @param accountNumber 
   * @param type 
   * @returns 
   */
  getOneAccountByAccountNumber(accountNumber : string , type : string) : Observable<Accout>{
    return this.http.get<Accout>(`${environnement.apiUrl}/${environnement.prefix}/comptes/${accountNumber}/${type}`) ;
  }

  /**
   * Activation ou suspension de compte
   * @param accountNumber 
   * @returns 
  */
  updateAccountStatus(accountNumber : string | undefined ) : Observable<boolean>{
    return this.http.get<boolean>(`${environnement.apiUrl}/${environnement.prefix}/comptes/status/${accountNumber}`) ;
  }
}
