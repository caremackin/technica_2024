import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, FormControl, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { KeywordService} from '../services/keyword.service'
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { WritableSignal } from '@angular/core';

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
    CommonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './gist.component.html',
  styleUrl: './gist.component.css'
})
export class GistComponent {

  constructor(private fb: FormBuilder, private router: Router, private genService: KeywordService, private sanitizer: DomSanitizer){

  }

}
