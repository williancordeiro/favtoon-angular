import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  handleAdd() {
    this.router.navigate(['/add']);
  }
}
