import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { HomeComponent } from './pages/home/home.component';
import { WritingComponent } from './pages/writing/writing.component';
import { PhotosComponent } from './pages/photos/photos.component';
import { AiComponent } from './pages/ai/ai.component';
import { AboutComponent } from './pages/about/about.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { PhotoDetailComponent } from './pages/photo-detail/photo-detail.component';
import { AiDetailComponent } from './pages/ai-detail/ai-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WritingComponent,
    PhotosComponent,
    AiComponent,
    AboutComponent,
    ArticleDetailComponent,
    PhotoDetailComponent,
    AiDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
