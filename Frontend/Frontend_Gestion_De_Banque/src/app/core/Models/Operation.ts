import { Account } from "./Account";

export interface OperationInterface {
    account ?: Account ;
    id ?: number ;
    amount : number
    opereationNumber ?: string ;
    operationDate ?: string ;
    operationType ?: string ;
    sourceAccountNumber : string ;
    destinationAccountNumber ?: string ;
}