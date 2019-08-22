import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MnistClassifierComponent } from './components/mnist-classifier/mnist-classifier.component';
import { ImageClassifierComponent } from './components/image-classifier/image-classifier.component';
import { VideoClassifierComponent } from './components/video-classifier/video-classifier.component';
import { WebcamClassifierComponent } from './components/webcam-classifier/webcam-classifier.component';

const routes: Routes = [
  { path: '', redirectTo: '/mnist', pathMatch: 'full' },
  { path: 'mnist', component: MnistClassifierComponent },
  { path: 'image', component: ImageClassifierComponent },
  { path: 'video', component: VideoClassifierComponent },
  { path: 'webcam', component: WebcamClassifierComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
