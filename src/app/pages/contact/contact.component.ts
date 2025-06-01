import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import { BtnComponent } from "../../shared/components/btn/btn.component";

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule, BtnComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  form!: FormGroup;
  submitError: string | null = null;
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      subject: ['', Validators.required],
      text: ['', Validators.required],
      type: ['SPONSOR_ACCOUNT', Validators.required],
    });
  }

  sendContact(): void {
    if (this.form.invalid) return;

    this.submitError = null;
    this.submitSuccess = false;

    this.contactService.createContactInquiry(this.form.value).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.form.reset({ type: 'SPONSOR_ACCOUNT' });
      },
      error: (err) => {
        this.submitError = err.error?.message || 'Failed to send your message.';
      },
    });
  }
}
