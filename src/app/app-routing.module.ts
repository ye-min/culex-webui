import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WritingComponent } from './pages/writing/writing.component';
import { PhotosComponent } from './pages/photos/photos.component';
import { AiComponent } from './pages/ai/ai.component';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  { path: '',        component: HomeComponent },
  { path: 'writing', component: WritingComponent },
  { path: 'photos',  component: PhotosComponent },
  { path: 'ai',      component: AiComponent },
  { path: 'about',   component: AboutComponent },
  { path: '**',      redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
