import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SerieService } from '../../../../back-end/service/SerieService';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { pb } from '../../../../back-end/service/PocketBaseService';

@Component({
  selector: 'app-add-serie-form',
  imports: [ ReactiveFormsModule, CommonModule, NgClass ],
  templateUrl: './add-serie-form.component.html',
  styleUrl: './add-serie-form.component.scss',
  providers: [SerieService]
})
export class AddSerieFormComponent {

  form: FormGroup;
  errorMessage: string = '';
  svgContent: string = '';
  imagePreview: string | null = null;
  private fb: FormBuilder;
  private service: SerieService;
  private router: Router;
  private sanitizer: DomSanitizer;
  currentYear: number = new Date().getFullYear();
  years: number[] = [];
  selectedImage: File | null = null;

  constructor(fb: FormBuilder, service: SerieService, router: Router, sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
    this.fb = fb;
    this.service = service;
    this.router = router;
    this.form = this.fb.group({
      image: [null],
      title: ['', Validators.required],
      year: [this.currentYear, Validators.required],
      genre: ['', Validators.required],
      seasons: [null, Validators.required],
      synopsis: ['', Validators.required],
    });
  }

  ngOnInit() {
    for (let i = 1900; i <= this.currentYear; i++) {
      this.years.push(i);
    }
  }

  onFileSelected(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          // 16:9 = 1.777...
          if (Math.abs(aspectRatio - 16 / 9) > 0.01) {
            this.errorMessage = 'Only images with 16:9 aspect ratio are allowed.';
            this.selectedImage = null;
            this.imagePreview = null;
            this.form.patchValue({ image: null });
            this.form.get('image')?.updateValueAndValidity();
          } else {
            this.errorMessage = '';
            this.selectedImage = file;
            this.imagePreview = e.target.result;
            this.form.patchValue({ image: file });
            this.form.get('image')?.updateValueAndValidity();
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedImage = null;
      this.imagePreview = null;
      this.form.patchValue({ image: null });
      this.form.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    const { image, title, year, genre, seasons, synopsis } = this.form.value;

    const userId = pb.authStore.model?.id;

    if (!userId) {
      this.errorMessage = 'You must be logged in to add a series.';
      return;
    }

    const formData = new FormData();

    const sendForm = () => {
      formData.append('title', title);
      formData.append('year', year.toString());
      formData.append('genre', genre);
      formData.append('seasons', seasons.toString());
      formData.append('synopsis', synopsis);
      formData.append('user_id', userId);

      this.service.createSerie(formData).then(() => {
        this.router.navigate(['/index/home']);
      }).catch((error: any) => {
        this.errorMessage = 'An error occurred while adding the series.';
        console.error('Add Serie error:', error);
      });
    }

    

    if (!image) {
      fetch('assets/images/default.png')
        .then(response => response.blob())
        .then(blob => {
          const defaultImageFile = new File([blob], 'default.png', { type: 'image/png' });
          formData.append('image', defaultImageFile);
          sendForm();
        }
      ).catch((error) => {
        this.errorMessage = 'An error occurred while loading the default image.';
        console.error('Default image error:', error);
      });
    } else {
      formData.append('image', image);
      sendForm();
    }
  }
}
