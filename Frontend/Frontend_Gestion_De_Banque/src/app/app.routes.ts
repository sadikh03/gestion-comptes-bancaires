import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ClientList } from './features/clientComponents/client-list/client-list';
import { CreateClient } from './features/clientComponents/create-client/create-client';
import { AccountList } from './features/accountComponents/account-list/account-list';
import { CreateAccount } from './features/accountComponents/create-account/create-account';
import { OperationList } from './features/operationComponents/operation-list/operation-list';
import { CreateOperation } from './features/operationComponents/create-operation/create-operation';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full' } ,
    {path : "home" , component : Home} ,
    {path : "clients" , component : ClientList} ,
    {path : "accounts" , component : AccountList} ,
    {path : "accounts/:id" , component : AccountList} ,
    {path : "operations" , component : OperationList} ,
    {path : "operations/:accountNumber/history" , component : OperationList} ,
    {path : "operations/create" , component : CreateOperation} ,
    {path : "clients/create" , component : CreateClient} ,
    {path : "accounts/:id/create" , component : CreateAccount} ,
    {path : "accounts/create/new" , component : CreateAccount} ,
];
