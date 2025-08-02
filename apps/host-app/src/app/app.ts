import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkipLinksComponent } from './shared/components/skip-links/skip-links';

@Component({
  imports: [
    RouterModule,
    SkipLinksComponent
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
}
