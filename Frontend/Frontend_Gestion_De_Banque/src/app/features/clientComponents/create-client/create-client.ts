import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { clientService } from '../../../core/services/client/client';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-create-client',
  imports: [
    ReactiveFormsModule , DatePipe , NgIf , RouterLink 
  ],
  templateUrl: './create-client.html',
  styleUrl: './create-client.css',
})
export class CreateClient implements OnInit{
  clientForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: clientService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumbers: ['', Validators.required],
      address: ['', Validators.required],
      birthday: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      
      this.clientService.postClient(this.clientForm.value).subscribe({
        next: (client) => {
          this.isLoading = false;
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur lors de la création:', error);
          // Gérer l'erreur (message à l'utilisateur)
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.clientForm.controls).forEach(key => {
        this.clientForm.get(key)?.markAsTouched();
      });
    }
  }
}
