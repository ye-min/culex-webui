import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { HomeComponent } from './pages/home/home.component';
import { WritingComponent } from './pages/writing/writing.component';
import { PhotoComponent } from './pages/photo/photo.component';
import { AiComponent } from './pages/ai/ai.component';
import { AboutComponent } from './pages/about/about.component';
import { WritingDetailComponent } from './pages/writing-detail/writing-detail.component';
import { PhotoDetailComponent } from './pages/photo-detail/photo-detail.component';
import { AiDetailComponent } from './pages/ai-detail/ai-detail.component';
import { NavComponent } from './pages/nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WritingComponent,
    PhotoComponent,
    AiComponent,
    AboutComponent,
    WritingDetailComponent,
    PhotoDetailComponent,
    AiDetailComponent,
    NavComponent
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
