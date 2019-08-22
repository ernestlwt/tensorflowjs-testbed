import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MnistClassifierComponent } from './components/mnist-classifier/mnist-classifier.component';
import { ImageClassifierComponent } from './components/image-classifier/image-classifier.component';
import { VideoClassifierComponent } from './components/video-classifier/video-classifier.component';
import { WebcamClassifierComponent } from './components/webcam-classifier/webcam-classifier.component';
import { VideoStreamingComponent } from './components/video-streaming/video-streaming.component';

const routes: Routes = [
  { path: '', redirectTo: '/mnist', pathMatch: 'full' },
  { path: 'mnist', component: MnistClassifierComponent },
  { path: 'image', component: ImageClassifierComponent },
  { path: 'video', component: VideoClassifierComponent },
  { path: 'webcam', component: WebcamClassifierComponent },
  { path: 'streaming', component: VideoStreamingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
