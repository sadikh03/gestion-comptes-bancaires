import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ClientInterface } from '../../../core/Models/Client';
import { Client } from '../client/client';
import {  NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { clientService } from '../../../core/services/client/client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-list',
  imports: [
    FormsModule , Client  , NgIf , NgFor  
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css',
})
export class ClientList implements OnInit {

  @Output() createClient = new EventEmitter<void>();
  @Output() manageAccounts = new EventEmitter<ClientInterface>();

  clients$ !: Observable<ClientInterface[]> 
  searchTerm = '';
  filteredClients: ClientInterface[] = [];

  constructor(private clientService: clientService ,
    private route : Router
  ) {}

  ngOnInit() {
    // Récupération des clients depuis le service
    this.clients$ = this.clientService.getClients();
    
    // Abonnement pour filtrer les clients
    this.clients$.subscribe(clients => {
      this.filteredClients = clients;
    });
  }

  onSearch() {
    this.clients$.subscribe(clients => {
      if (!this.searchTerm.trim()) {
        this.filteredClients = [...clients];
        return;
      }

      this.filteredClients = clients.filter(client =>
        client.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.phoneNumbers.includes(this.searchTerm) ||
        client.address.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  onManageAccounts(client: ClientInterface) {
    this.manageAccounts.emit(client);
  }

  onNewClient():void{
    this.route.navigateByUrl("/clients/create")
  }
}
