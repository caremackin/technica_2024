import { Component } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, FormControl, Validators, EmailValidator} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { SignUpService } from '../../services/signup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private signUpService: SignUpService, private router: Router){}

  ngOnInit(){
    this.signupForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl("",[
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl("",[
        Validators.required,
        Validators.email
      ]),
      password: new FormControl("",[
        Validators.required,
        Validators.minLength(7)
      ]), 
      confirm_password: new FormControl("",[
        Validators.required,
        Validators.minLength(7)
      ])
    });
  }

  signup(){
    this.addUser()
    this.router.navigate(['/']);
  }
  

  addUser(): void {
    this.signUpService.addUser(this.signupForm.value).subscribe((newUser) => {
      console.log(newUser);
      this.signUpService.addUser(newUser);
    })
    console.log(this.signupForm.value);
    //after submiting and sending user reset all values
    this.signupForm.reset();
    //set the form values to null so they dont error
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.controls[key].setErrors(null)
    });
  }


}
