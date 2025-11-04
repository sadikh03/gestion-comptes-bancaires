import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    NgFor , RouterLink
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  navs : any[] = [
    {title: 'acceuil' , path: '/home'},
    {title: 'comptes' , path: '/accounts'},
    {title: 'clients' , path: '/clients'},
    {title: 'operations' , path: '/operations'},
  ];
}
