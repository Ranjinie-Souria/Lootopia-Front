import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../model/user';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  editForm!: FormGroup<any>;
  isEditing: any;
  defaultImage = 'assets/images/lootie.png';
  tempImage: string | null = null;
  cancelEdit() {
    this.isEditing = false;
    this.editForm.reset();
    this.tempImage = null;
  }
  onSubmit() {
    if (this.editForm.valid) {
      const { id, username, language } = this.editForm.value;
      this.userService
        .updateSelf({
          id,
          username,
          language,
          email: this.userService.getUser()?.email,
        })
        .subscribe({
          next: () => {
            this.isEditing = false;
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            console.error('Error updating user:', err);
          },
        });
    }
  }
  enableEdit() {
    this.isEditing = true;
    this.user$.subscribe((user) => {
      if (user) {
        this.editForm = this.fb.group({
          id: [user.id],
          username: [user.username],
          email: [{ value: user.email, disabled: true }],
          language: [user.language],
          profilePicture: [user.profilePicture || this.defaultImage],
        });
      }
    });
  }
  selectImage(event: any) {
    console.log('selectImage called');
    let fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      console.log('File input found, triggering click');
      fileInput.value = '';
      fileInput.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editForm.patchValue({ profilePicture: e.target.result });
        this.editForm.get('profilePicture')?.updateValueAndValidity();
        this.tempImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  user$!: Observable<User | null>;

  ngOnInit() {
    this.user$ = this.userService.loadCurrentUserFromToken();
    this.isEditing = false;

    this.user$.subscribe((user) => {
      if (user) {
        this.editForm = this.fb.group({
          id: [user.id],
          username: [user.username],
          email: [{ value: user.email, disabled: true }],
          language: [user.language],
          profilePicture: [user.profilePicture || this.defaultImage],
        });
      }
    });
  }
}
