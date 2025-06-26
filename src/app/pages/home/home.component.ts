import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SerieService } from '../../../../back-end/service/SerieService';
import { pb } from '../../../../back-end/service/PocketBaseService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [SerieService],
})
export class HomeComponent {
  private router: Router;
  service: SerieService;

  series: any[] = [];
  errorMessage: string = '';

  constructor(router: Router, service: SerieService) {
    this.service = service;
    this.router = router;
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
          this.series = result.items;
        }).catch((error: any) => {
          console.error('Error loading series:', error);
          this.errorMessage = 'Error loading series. Please try again later.';
        });
    } else {
      this.errorMessage = 'User not authenticated. Please log in.';
    }
  }
}
