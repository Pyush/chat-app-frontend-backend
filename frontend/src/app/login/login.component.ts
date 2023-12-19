import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { HttpService } from '../utilities/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.httpService
      .login(this.loginForm.getRawValue())
      .pipe(first())
      .subscribe({
        complete: () => {
          console.log('done');
        },
        error: (error) => {
          console.log(error);
        },
        next: (res) => {
          if (res) {
            localStorage.setItem(
              'userEmail',
              this.loginForm.getRawValue().email
            );
            localStorage.setItem('token', res.access_token);
            this.router.navigate(['/users']);
          }
        },
      });
  }
}
