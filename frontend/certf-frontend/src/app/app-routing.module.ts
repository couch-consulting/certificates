import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentCardsComponent } from './content-cards/content-cards.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'certificates', component: ContentCardsComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
