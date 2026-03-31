import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navLinks = [
    { label: 'Writing', path: '/writing' },
    { label: 'Photos',  path: '/photos' },
    { label: 'AI',      path: '/ai' },
    { label: 'About',   path: '/about' }
  ];
}
