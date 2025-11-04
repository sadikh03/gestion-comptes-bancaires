import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environnement } from '../../../../environnements/environnement';
import { OperationInterface } from '../../Models/Operation';

@Injectable({
  providedIn: 'root',
})
export class operationService {
  constructor(private http : HttpClient){}

  /**
   * Effectuer un versement
   * @param operation 
   * @returns 
   */
  makeATransfer(operation : OperationInterface) : Observable<boolean>{
    return this.http.post<boolean>(`${environnement.apiUrl}/${environnement.prefix}/operations/virement` , operation);
  }

  /**
   * effectuer un retrait
   * @param operation 
   * @returns 
   */
  makeAWithdrawal(operation : OperationInterface) : Observable<boolean>{
    return this.http.post<boolean>(`${environnement.apiUrl}/${environnement.prefix}/operations/retrait` , operation);
  }

  /**
   * Effectuer un depot
   * @param operation 
   * @returns 
   */
  makeADeposit(operation : OperationInterface) : Observable<boolean>{
    return this.http.post<boolean>(`${environnement.apiUrl}/${environnement.prefix}/operations/depot` , operation);
  }

  getAllOperations() : Observable<OperationInterface[]> {
    return this.http.get<OperationInterface[]>(`${environnement.apiUrl}/${environnement.prefix}/operations`)
  }
}
