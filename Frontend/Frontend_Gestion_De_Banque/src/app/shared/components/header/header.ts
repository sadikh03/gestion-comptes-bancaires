import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink  , NgFor
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  navs : any[] = [
    {title: 'acceuil' , path: '/home'},
    {title: 'comptes' , path: '/accounts'},
    {title: 'clients' , path: '/clients'},
    {title: 'operations' , path: '/operations'},
  ];
}
