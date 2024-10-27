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
  templateUrl: './canopy.component.html',
  styleUrl: './canopy.component.css'
})
export class CanopyComponent {
  textForm!: FormGroup;
  urlList: Array<any>
  videoIds: Array<string>
  text_keywords: Array<string>
  showResourseSection: Boolean = false

  constructor(private fb: FormBuilder, private router: Router, private genService: KeywordService, private sanitizer: DomSanitizer){

  }

  ngOnInit(){
    this.textForm = this.createFormGroup();
  }

  readonly reactiveKeywords = signal([]); 
  readonly formControl = new FormControl(['angular']);

  announcer = inject(LiveAnnouncer);

  removeReactiveKeyword(keyword: string) {
    this.reactiveKeywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword} from reactive form`);
      return [...keywords];
    });
  }

  addReactiveKeyword(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.reactiveKeywords.update(keywords => [...keywords, value]);
      this.announcer.announce(`added ${value} to reactive form`);
    }

    event.chipInput!.clear();
    this.getKeywords()
  }

  addReactiveKeywords(keywords: string[]) {
    if (keywords && keywords.length > 0) {
      this.reactiveKeywords.update(existingKeywords => [...existingKeywords, ...keywords]);
      
      keywords.forEach(keyword => {
        this.announcer.announce(`added ${keyword} to reactive form`);
      });
    }
    this.getKeywords()
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl("",[
        Validators.required,
        Validators.minLength(10)
      ]),
      text: new FormControl("",[
        Validators.required,
        Validators.minLength(10)
      ])
    })
  }

  submit(){
    console.log(this.textForm.value.title)
    this.genService.getKeyWords(this.textForm.value.text).subscribe(response => {
      console.log("Keywords:", response.keywords); 
      response.keywords.push(this.textForm.value.title)
      this.addReactiveKeywords(response.keywords);
    });
  }

  getSanitizedUrl(videoId: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  generateImages(){
    this.getKeywords();
    console.log("KEYWORDS:")
    console.log(this.text_keywords)
    console.log(this.reactiveKeywords)
  
    this.genService.getImageUrls(this.text_keywords).subscribe(response => {
      console.log("URLS:", response); 
      this.urlList = response.urls
    })

    this.genService.getYouTubeVideos(this.text_keywords).subscribe(response => {
      console.log(response)

      this.videoIds = response.map(video => video.videoId)
  })

    this.showResourseSection = true;
  }

  getKeywords(){
    this.reactiveKeywords.update(keywords => {
      this.text_keywords = [...keywords]
      return [...keywords];
    });
  }

  reGenerate(word: string, url:string){
    console.log(`REGENERATE" ${word}`)
    
    const word_index = this.urlList.findIndex(item => item[0] === word);
    if (word_index === -1) {
      console.error("Word not found in urlList:", word);
      return; 
  }
    this.genService.reGenImage(word).subscribe(response => {
      console.log("URL:", response); 
      this.urlList[word_index][1] = response.image_url;
    })
  }
}
