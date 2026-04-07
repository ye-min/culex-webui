import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WritingComponent } from './pages/writing/writing.component';
import { PhotosComponent } from './pages/photos/photos.component';
import { AiComponent } from './pages/ai/ai.component';
import { AboutComponent } from './pages/about/about.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { PhotoDetailComponent } from './pages/photo-detail/photo-detail.component';
import { AiDetailComponent } from './pages/ai-detail/ai-detail.component';
import { NavComponent } from './pages/nav/nav.component';

const routes: Routes = [
  { path: '',        component: HomeComponent },
  { path: 'writing', component: WritingComponent },
  { path: 'writing/:id', component: ArticleDetailComponent },
  { path: 'photos',  component: PhotosComponent },
  { path: 'photos/:id', component: PhotoDetailComponent },
  { path: 'ai',      component: AiComponent },
  { path: 'ai/:id', component: AiDetailComponent },
  { path: 'about',   component: AboutComponent },
  { path: 'nav',     component: NavComponent },
  { path: '**',      redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
