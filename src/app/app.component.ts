import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'culex-webui';
  private readonly router = inject(Router);

  get fullscreen(): boolean {
    return this.router.routerState.snapshot.root.firstChild?.data['fullscreen'] === true;
  }
}
