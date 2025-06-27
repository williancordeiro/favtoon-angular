import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SerieService } from '../../../../back-end/service/SerieService';
import { pb } from '../../../../back-end/service/PocketBaseService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [SerieService],
})
export class HomeComponent {
  private router: Router;
  service: SerieService;
  searchForm!: FormGroup;

  series: any[] = [];
  allSeries: any[] = [];
  errorMessage: string = '';

  constructor(router: Router, service: SerieService, private fb: FormBuilder) {
    this.service = service;
    this.router = router;
    this.initSearchForm();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });

    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => {
      this.onSearchChange(value);
    });
  }

  handleAdd() {
    this.router.navigate(['/add']);
  }

  ngOnInit() {
    this.loadSeries();
  }

  slugify(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  handleSerie(serie: any) {
    const slug = this.slugify(serie.title);
    this.router.navigate(['/serie', slug]);
  }

  loadSeries() {
    const userId = pb.authStore.model?.id;
    if (userId) {
      this.service.getSeriesByUserId(userId)
        .then((result: any) => {
          this.allSeries = result.items;
          this.series = result.items;
        }).catch((error: any) => {
          console.error('Error loading series:', error);
          this.errorMessage = 'Error loading series. Please try again later.';
        });
    } else {
      this.errorMessage = 'User not authenticated. Please log in.';
    }
  }

  onSearchChange(searchTerm?: string) {
    const term = searchTerm || this.searchForm.get('searchTerm')?.value || '';
    
    if (!term.trim()) {
      this.series = this.allSeries;
    } else {
      const searchLower = term.toLowerCase();
      this.series = this.allSeries.filter(serie => 
        serie.title.toLowerCase().includes(searchLower) ||
        (serie.genre && serie.genre.toLowerCase().includes(searchLower)) ||
        (serie.synopsis && serie.synopsis.toLowerCase().includes(searchLower))
      );
    }
  }

  clearSearch() {
    this.searchForm.patchValue({ searchTerm: '' });
    this.series = this.allSeries;
  }

  get searchTerm(): string {
    return this.searchForm.get('searchTerm')?.value || '';
  }
}
