import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

import { DataListModule } from './+data-list/data-list.module';
import { ViewRoutingModule } from './view-routing';
import { ViewComponent } from './view.component';

@NgModule({
  imports: [CommonModule, ViewRoutingModule, DataListModule, MatButtonToggleModule, MatIconModule],
  declarations: [ViewComponent],
  providers: []
})
export class ViewModule {}
