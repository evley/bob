import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CONSTANTS } from '../app.constant';
import { AppService } from '../app.service';
import { DataListItem } from './+data-list/data-list-item.interface';
import { Group } from './group.interface';

enum GroupType {
  LOCATION = 'location',
  TYPE = 'type',
  EXPIRY = 'expiry',
  CHECKED = 'checked',
  ADDED = 'added'
}

const groupTypeIcon = {
  [GroupType.LOCATION]: 'location_on',
  [GroupType.TYPE]: 'category',
  [GroupType.EXPIRY]: 'date_range',
  [GroupType.CHECKED]: 'check_circle',
  [GroupType.ADDED]: 'add_shopping_cart'
};

const groupTypeTitle = {
  [GroupType.LOCATION]: 'Group by Location',
  [GroupType.TYPE]: 'Group by Type',
  [GroupType.EXPIRY]: 'Group by Expiry Date',
  [GroupType.CHECKED]: 'Group by Checked Date',
  [GroupType.ADDED]: 'Group by Added Date'
};

const numberList = [
  CONSTANTS.headers.id,
  CONSTANTS.headers.quantity,
  CONSTANTS.headers.calories,
  CONSTANTS.headers.water
];
const dateList = [CONSTANTS.headers.added, CONSTANTS.headers.expiry, CONSTANTS.headers.checked];

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  public groupTypes = Object.values(GroupType);
  public selectedGroupType = Object.values(GroupType)[0];
  public groups: Group[] = [];
  private _items: DataListItem[] = [];

  constructor(private _router: Router, private _appService: AppService) {
    this._appService.refreshData$.subscribe(() => this._setData());
  }

  public ngOnInit(): void {
    if (this._hasData()) {
      this._setData();
    } else {
      this._goToDefault();
    }
  }

  public get hasItems(): boolean {
    return this._items.length > 0;
  }

  public hasGroupItems(group: Group): boolean {
    return group.items.length > 0;
  }

  public onGroupTypeChange(type: GroupType): void {
    this.selectedGroupType = type;
    this._resetGroups();
    this._groupBy(type);
  }

  public groupTypeIcon(type: GroupType): string {
    return groupTypeIcon[type];
  }

  public groupTypeTitle(type: GroupType): string {
    return groupTypeTitle[type];
  }

  public isGroupTypeChecked(type: GroupType): boolean {
    return this.selectedGroupType === type;
  }

  private _resetGroups(): void {
    this.groups = [];
  }

  private _groupBy(type: GroupType): void {
    return {
      [GroupType.LOCATION]: () => this._groupByProp(CONSTANTS.headers.location),
      [GroupType.TYPE]: () => this._groupByProp(CONSTANTS.headers.type),
      [GroupType.EXPIRY]: () => this._groupByDate(CONSTANTS.headers.expiry),
      [GroupType.CHECKED]: () => this._groupByDate(CONSTANTS.headers.checked),
      [GroupType.ADDED]: () => this._groupByDate(CONSTANTS.headers.added)
    }[type].call(this);
  }

  private _groupByDate(dateProp: string): void {
    enum dateGroup {
      'EXPIRED' = 'Expired',
      '3_DAYS' = '3 Days',
      '3_WEEKS' = '3 Weeks',
      '3_MONTHS' = '3 Months+'
    }
    const groupMap = {};
    const prefix = `${dateProp} within `;
    const isKeyExpired = (key: string) => key === dateGroup.EXPIRED;
    Object.values(dateGroup).map((key) => (groupMap[key] = []));

    this._items.forEach((item) => {
      if (this._hasDate(dateProp, item)) {
        if (this._isExpired(item)) {
          groupMap[dateGroup.EXPIRED].push(item);
        } else if (this._isDateWithinDays(dateProp, item, 3)) {
          groupMap[dateGroup['3_DAYS']].push(item);
        } else if (this._isDateWithinDays(dateProp, item, 21)) {
          groupMap[dateGroup['3_WEEKS']].push(item);
        } else {
          groupMap[dateGroup['3_MONTHS']].push(item);
        }
      }
    });
    this.groups = Object.keys(groupMap).reduce(
      (groups, key) => [
        ...groups,
        { name: `${isKeyExpired(key) ? key : prefix + key}`, items: groupMap[key] }
      ],
      []
    );
  }

  private _isDateWithinDays(dateProp: string, item: DataListItem, days: number): boolean {
    return item[dateProp] <= this._todaySubtractDays(-days);
  }

  private _todaySubtractDays(days: number): Date {
    return new Date(new Date().setDate(new Date().getDate() - days));
  }

  private _isExpired(item: DataListItem): boolean {
    return item.expiry <= new Date();
  }

  private _hasDate(dateProp: string, item: DataListItem): boolean {
    return item[dateProp] && item[dateProp] instanceof Date;
  }

  private _groupByProp(prop: string): void {
    const groupMap = {};
    this._items.forEach((item) =>
      groupMap[item[prop]] ? groupMap[item[prop]].push(item) : (groupMap[item[prop]] = [item])
    );
    this.groups = Object.keys(groupMap).reduce(
      (groups, key) => [...groups, { name: key, items: groupMap[key] }],
      []
    );
  }

  private _hasData(): boolean {
    return Boolean(this._getData());
  }

  private _setData(): void {
    const data = this._getData();
    this._items = this._buildDataItems(data);
    this.onGroupTypeChange(this.selectedGroupType);
  }

  private _getData(): object[] {
    return JSON.parse(window.localStorage.getItem(CONSTANTS.appId));
  }

  private _buildDataItems(data: object[]): DataListItem[] {
    const headers = Object.keys(data[0]).map((header) => header.toLowerCase());
    return data
      .map((value) => {
        const item = {} as DataListItem;
        headers.map((header) => (item[header] = this._handleItemValue(header, value[header])));
        return item;
      })
      .filter((item) => !!item.name)
      .sort((a, b) => Number(b.expiry) - Number(a.expiry))
      .reverse();
  }

  private _handleItemValue(header: string, value: string): string | number | Date {
    const isInList = (list: string[]) => list.indexOf(header) > -1;

    if (value) {
      if (isInList(dateList)) {
        return value ? new Date(Date.parse(value)) : undefined;
      } else if (isInList(numberList)) {
        return value ? Number(value.replace(',', '')) : 0;
      } else {
        return value;
      }
    }
  }

  private _goToDefault(): void {
    this._router.navigate(['/']);
  }
}
