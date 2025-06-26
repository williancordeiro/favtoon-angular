import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SerieService } from '../../../../back-end/service/SerieService';
import { pb } from '../../../../back-end/service/PocketBaseService';

@Component({
  selector: 'app-serie',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './serie.component.html',
  styleUrl: './serie.component.scss',
  providers: [SerieService]
})
export class SerieComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  serieForm!: FormGroup;
  serie: any = {
    title: '',
    synopsis: '',
    image: '',
    year: '',
    genre: '',
    seasons: ''
  };
  
  isEditing = false;
  selectedFile: File | null = null;
  imagePreviewUrl: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serieService: SerieService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm() {
    this.serieForm = this.fb.group({
      title: [{value: '', disabled: true}, [Validators.required]],
      year: [{value: '', disabled: true}, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      genre: [{value: '', disabled: true}, [Validators.required]],
      seasons: [{value: '', disabled: true}, [Validators.required, Validators.min(1)]],
      synopsis: [{value: '', disabled: true}]
    });
  }

  ngOnInit() {
    this.loadSerie();
  }

  loadSerie() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.findSerieBySlug(slug);
    }
  }

  findSerieBySlug(slug: string) {
    const userId = pb.authStore.model?.id;
    if (userId) {
      this.serieService.getSeriesByUserId(userId)
        .then((result: any) => {
          const series = result.items;
          const foundSerie = series.find((s: any) => this.slugify(s.title) === slug);
          if (foundSerie) {
            this.serie = { ...foundSerie };
            this.imagePreviewUrl = this.serieService.getImageSerie(foundSerie);
            // Atualizar o formulário com os dados da série
            this.serieForm.patchValue({
              title: foundSerie.title,
              year: foundSerie.year,
              genre: foundSerie.genre,
              seasons: foundSerie.seasons,
              synopsis: foundSerie.synopsis
            });
          } else {
            this.errorMessage = 'Serie not found.';
          }
        })
        .catch((error: any) => {
          console.error('Error loading serie:', error);
          this.errorMessage = 'Error loading serie.';
        });
    }
  }

  slugify(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.clearMessages();
    
    if (this.isEditing) {
      // Habilitar todos os campos para edição
      this.serieForm.enable();
    } else {
      // Desabilitar todos os campos e restaurar valores originais
      this.serieForm.disable();
      // Restaurar valores originais se cancelar
      this.serieForm.patchValue({
        title: this.serie.title,
        year: this.serie.year,
        genre: this.serie.genre,
        seasons: this.serie.seasons,
        synopsis: this.serie.synopsis
      });
      this.selectedFile = null;
      this.imagePreviewUrl = this.serieService.getImageSerie(this.serie);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    if (this.isEditing) {
      this.fileInput.nativeElement.click();
    }
  }

  async saveSerie() {
    try {
      this.clearMessages();
      
      if (!this.serieForm.valid) {
        this.errorMessage = 'Please fill in all required fields correctly.';
        return;
      }
      
      const formValues = this.serieForm.value;
      const updateData: any = {
        title: formValues.title,
        synopsis: formValues.synopsis,
        year: formValues.year,
        genre: formValues.genre,
        seasons: formValues.seasons
      };

      if (this.selectedFile) {
        updateData.image = this.selectedFile;
      }

      await this.serieService.updateSerie(this.serie.id, updateData);
      
      this.successMessage = 'Serie updated successfully!';
      this.isEditing = false;
      this.selectedFile = null;
      
      // Desabilitar o formulário após salvar
      this.serieForm.disable();
      
      setTimeout(() => {
        this.loadSerie();
        this.clearMessages();
      }, 2000);
      
    } catch (error) {
      console.error('Error updating serie:', error);
      this.errorMessage = 'Error saving serie. Please try again.';
    }
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack() {
    this.router.navigate(['/index/home']);
  }
}
