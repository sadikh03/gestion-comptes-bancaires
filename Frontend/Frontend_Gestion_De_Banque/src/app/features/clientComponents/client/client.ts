import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientInterface } from '../../../core/Models/Client';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-client',
  imports: [RouterLink],
  templateUrl: './client.html',
  styleUrl: './client.css',
})
export class Client {


  @Input() client!: ClientInterface;

  @Output() manageAccounts = new EventEmitter<ClientInterface>();

  onManageAccounts() {
    this.manageAccounts.emit(this.client);
  }

}
