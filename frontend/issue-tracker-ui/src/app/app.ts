import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Issue Tracker';

  constructor(private router: Router) {}

  navigateHome(): void {
    this.router.navigate(['/issues']);
  }
}
