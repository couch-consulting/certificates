import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// Import any needed component modules here
import {
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatIconModule
} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule,MatIconModule],
  exports: [MatButtonModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule,MatIconModule]
})
export class MaterialModule {
}
