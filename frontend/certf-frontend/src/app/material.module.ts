import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// Import any needed component modules here
import {
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatIconModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule,MatIconModule,MatFormFieldModule,MatDatepickerModule, MatNativeDateModule],
  exports: [MatButtonModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule,MatIconModule,MatFormFieldModule,MatDatepickerModule, MatNativeDateModule ]
})
export class MaterialModule {
}
