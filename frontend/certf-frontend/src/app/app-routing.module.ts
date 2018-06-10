import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContentCardsComponent} from './content-cards/content-cards.component';
import {HomeComponent} from './components/home/home.component';
import {SelectedComponent} from './components/selected/selected.component';
import {ChangeComponent} from "./components/mgmt/change/change.component";
import {MgmtComponent} from "./components/mgmt/mgmt.component";

const routes: Routes = [
  { path: 'certificates', component: ContentCardsComponent },
  { path: '', component: HomeComponent },
  { path: 'selected/:templateId', component: SelectedComponent },


  {path: 'management', component: MgmtComponent},
  {path: 'management/:templateId', component: ChangeComponent},


];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
