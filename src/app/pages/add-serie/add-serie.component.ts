import { Component } from '@angular/core';
import { AddSerieFormComponent } from '../../components/add-serie-form/add-serie-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-serie',
  imports: [AddSerieFormComponent],
  templateUrl: './add-serie.component.html',
  styleUrl: './add-serie.component.scss'
})
export class AddSerieComponent {
  
  constructor(private router: Router) {}
  
  goBack() {
    this.router.navigate(['/index/home']);
  }
}
