import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, FormControl, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { KeywordService } from '../services/keyword.service';
import { CommonModule } from '@angular/common';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



/**
 * @title Dialog with header, scrollable content and actions
 */

@Component({
  selector: 'pdf-dialog',
  templateUrl: 'dialog.component.html',
  standalone: true,
  imports: [MatDialogModule,
     MatButtonModule, 
     MatSlideToggleModule,
     MatInputModule,
     FormsModule,
     CommonModule
    ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
    isChecked = false;
    translatedValues: Array<string>
    keywords: any
    urls: any
    translations:any
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, private genService: KeywordService
     ) { }
     
     ngOnInit() {
        console.log(this.data)
        this.keywords = this.data.urls.map((element) => element[0]);
        this.urls = this.data.urls.map((element) => element[1]);
        this.genService.translate(this.keywords ).subscribe(response => {
            console.log("translation:", response); 
            this.translations = response.translation
        })
      
     }

     generatePDF() {
        if(this.isChecked){
            const docDefinition = {
                content: [
                  { text: 'Vocabulary PDF', style: 'header' },
                  { text: 'Keywords:', style: 'subheader' },
                  ...this.keywords.map((keyword, index) => ({
                    text: `${keyword} - ${this.translations[index] || ''}`,
                    style: 'listItem',
                  })),
                ],
                styles: {
                  header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10], 
                  },
                  subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5],
                  },
                  listItem: {
                    fontSize: 12,
                    margin: [0, 5, 0, 5],
                  },
                },
              };
            pdfMake.createPdf(docDefinition).download('vocab.pdf');
        }  else {
            const docDefinition = {
                content: [
                  { text: 'Vocabulary PDF', style: 'header' },
                  { text: 'Keywords:', style: 'subheader' },
                  ...this.keywords.map((keyword) => ({
                    text: keyword,
                    style: 'listItem',
                  })),
                ],
                styles: {
                  header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10], 
                  },
                  subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5],
                  },
                  listItem: {
                    fontSize: 12,
                    margin: [0, 5, 0, 5],
                  },
                },
              };

            pdfMake.createPdf(docDefinition).download('vocab.pdf');
        }

      }
      
    }