import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface BookmarkLink {
  title: string;
  url: string;
  desc: string;
}

interface BookmarkCategory {
  category: string;
  links: BookmarkLink[];
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  categories: BookmarkCategory[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<BookmarkCategory[]>('data/bookmarks.json').subscribe(data => {
      this.categories = data;
    });
  }
}
