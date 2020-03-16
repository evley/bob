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

  public get addedCount(): string {
    return `${this.items.filter((i) => this.hasAddedDate(i)).length}/${this.items.length}`;
  }

  public hasAddedDate(item: DataListItem): boolean {
    return item.added && item.added instanceof Date;
  }

  public isExpired(item: DataListItem): boolean {
    return this._hasExpiryDate(item) && item.expiry <= new Date();
  }

  public isUnchecked(item: DataListItem): boolean {
    return this._hasCheckedDate(item) && this._todaySubtractDays(-90) < item.checked;
  }

  public isExpiring(item: DataListItem): boolean {
    return this._hasExpiryDate(item) && this._todaySubtractDays(-90) > item.expiry;
  }

  public hasCalories(item: DataListItem): boolean {
    return item.calories && item.calories > 0;
  }

  public hasWater(item: DataListItem): boolean {
    return item.water && item.water > 0;
  }

  public getIcon(item: DataListItem): string {
    return item.water > item.calories ? 'mdi-cup-water' : 'mdi-food-apple';
  }

  private _hasExpiryDate(item: DataListItem): boolean {
    return item.expiry && item.expiry instanceof Date;
  }

  private _hasCheckedDate(item: DataListItem): boolean {
    return item.checked && item.checked instanceof Date;
  }

  private _todaySubtractDays(days: number): Date {
    return new Date(new Date().setDate(new Date().getDate() - days));
  }
}