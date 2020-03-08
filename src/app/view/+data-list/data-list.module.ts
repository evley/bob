import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { DataListComponent } from './data-list.component';

@NgModule({
  declarations: [DataListComponent],
  imports: [CommonModule, MatListModule],
  exports: [DataListComponent],
  providers: []
})
export class DataListModule {}
