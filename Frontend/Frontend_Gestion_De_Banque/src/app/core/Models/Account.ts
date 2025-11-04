import { ClientInterface } from "./Client";

export interface Account {
    id ?: number ;
    accountNumber ?: string ;
    balance : number ;
    interestRate : number ;
    overdraft : number ;
    client ?: ClientInterface ;
    createAt ?: string ;
    currency : string ;
    status ?: string ;    

}