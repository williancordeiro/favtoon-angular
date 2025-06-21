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
  private service: SerieService;

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

  loadSeries() {
    const userId = pb.authStore.model?.id;
    if (userId) {
      this.service.getSeriesByUserId(userId)
        .then((result: any) => {
          this.series = result.items;
        }).catch((error: any) => {
          console.error('Error loading series:', error);
          this.errorMessage = 'Erro ao carregar séries. Por favor, tente novamente mais tarde.';
        });
    } else {
      this.errorMessage = 'Usuário não autenticado.';
    }
  }
}
