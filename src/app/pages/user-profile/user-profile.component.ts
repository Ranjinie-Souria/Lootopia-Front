import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../model/user';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, CommonModule, BtnComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  editForm!: FormGroup<any>;
isEditing: any;
cancelEdit() {
throw new Error('Method not implemented.');
}
onSubmit() {
throw new Error('Method not implemented.');
}
toggleEdit() {
throw new Error('Method not implemented.');
}
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  user$!: Observable<User | null>;

  ngOnInit() {
    this.user$ = this.userService.loadCurrentUserFromToken();
  }
}
