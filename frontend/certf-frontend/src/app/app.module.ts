import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule} from '@angular/forms';
import { ContentCardsComponent } from './content-cards/content-cards.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './/app-routing.module';
import {CertfdataService} from './services/certfdata.service';
import { HomeComponent } from './components/home/home.component';
import { SelectedComponent } from './components/selected/selected.component';


@NgModule({
  declarations: [
    AppComponent,
    ContentCardsComponent,
    HomeComponent,
    SelectedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    AppRoutingModule


  ],
  providers: [CertfdataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
