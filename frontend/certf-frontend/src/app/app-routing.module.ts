import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentCardsComponent } from './content-cards/content-cards.component';
import { HomeComponent } from './components/home/home.component';
import { SelectedComponent } from './components/selected/selected.component';

const routes: Routes = [
  { path: 'certificates', component: ContentCardsComponent },
  { path: '', component: HomeComponent },
  { path: 'selected/:templateId', component: SelectedComponent },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
