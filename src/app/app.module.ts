import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MnistClassifierComponent } from './components/mnist-classifier/mnist-classifier.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImageClassifierComponent } from './components/image-classifier/image-classifier.component';
import { VideoClassifierComponent } from './components/video-classifier/video-classifier.component';
import { WebcamClassifierComponent } from './components/webcam-classifier/webcam-classifier.component';

@NgModule({
  declarations: [
    AppComponent,
    MnistClassifierComponent,
    HeaderComponent,
    FooterComponent,
    ImageClassifierComponent,
    VideoClassifierComponent,
    WebcamClassifierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
