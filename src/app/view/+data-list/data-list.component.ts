import { Component, Input } from '@angular/core';

import { DataListItem } from './data-list-item.interface';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent {
  @Input() public name: string;
  @Input() public items: DataListItem[] = [];
}
