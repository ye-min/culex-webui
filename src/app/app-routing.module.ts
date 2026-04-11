import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WritingComponent } from './pages/writing/writing.component';
import { PhotoComponent } from './pages/photo/photo.component';
import { AiComponent } from './pages/ai/ai.component';
import { AboutComponent } from './pages/about/about.component';
import { WritingDetailComponent } from './pages/writing-detail/writing-detail.component';
import { PhotoDetailComponent } from './pages/photo-detail/photo-detail.component';
import { AiDetailComponent } from './pages/ai-detail/ai-detail.component';
import { NavComponent } from './pages/nav/nav.component';
import { ToolsComponent } from './pages/tools/tools.component';
import { PdfConverterComponent } from './pages/pdf-converter/pdf-converter.component';
import { PdfMergerComponent } from './pages/pdf-merger/pdf-merger.component';
import { IpInfoComponent } from './pages/ip-info/ip-info.component';
import { TimestampComponent } from './pages/timestamp/timestamp.component';
import { HashCalcComponent } from './pages/hash-calc/hash-calc.component';

const routes: Routes = [
  { path: '',        component: HomeComponent },
  { path: 'writing', component: WritingComponent },
  { path: 'writing/:id', component: WritingDetailComponent },
  { path: 'photo',  component: PhotoComponent },
  { path: 'photo/:id', component: PhotoDetailComponent },
  { path: 'ai',      component: AiComponent },
  { path: 'ai/:id', component: AiDetailComponent },
  { path: 'about',   component: AboutComponent },
  { path: 'nav',           component: NavComponent },
  { path: 'tools',         component: ToolsComponent },
  { path: 'pdf-converter', component: PdfConverterComponent },
  { path: 'pdf-merger',    component: PdfMergerComponent },
  { path: 'ip-info',       component: IpInfoComponent },
  { path: 'timestamp',     component: TimestampComponent },
  { path: 'hash-calc',     component: HashCalcComponent },
  { path: '**',            redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
