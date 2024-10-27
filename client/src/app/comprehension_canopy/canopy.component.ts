import { Component } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, FormControl, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { KeywordService} from '../services/keyword.service'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-canopy',
  standalone: true,
  imports: [ 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './canopy.component.html',
  styleUrl: './canopy.component.css'
})
export class CanopyComponent {
  textForm!: FormGroup;
  urlList: Array<string>

  constructor(private fb: FormBuilder, private router: Router, private genService: KeywordService){}

  ngOnInit(){
    this.textForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      text: new FormControl("",[
        Validators.required,
        Validators.minLength(10)
      ])
    });
  }

  submit(){
    console.log(this.textForm.value)
    const payload = { text: this.textForm.value.text };
    this.genService.getKeyWords(this.textForm.value.text).subscribe(response => {
      console.log("Keywords:", response.keywords); 
      this.genService.getImageUrls(response.keywords).subscribe(response => {
        console.log("URLS:", response); 
        this.urlList = response.urls
      })
    });
  }
}
