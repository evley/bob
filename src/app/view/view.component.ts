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
  ADDED = 'added',
  CALORIES = 'calories',
  WATER = 'water'
}

const groupTypeIcon = {
  [GroupType.LOCATION]: 'mdi-map-marker',
  [GroupType.TYPE]: 'mdi-shape',
  [GroupType.EXPIRY]: 'mdi-calendar-range',
  [GroupType.CHECKED]: 'mdi-check-all',
  [GroupType.ADDED]: 'mdi-cart-plus',
  [GroupType.CALORIES]: 'mdi-food-apple',
  [GroupType.WATER]: 'mdi-cup-water'
};

const groupTypeTitle = {
  [GroupType.LOCATION]: 'Group by Location',
  [GroupType.TYPE]: 'Group by Type',
  [GroupType.EXPIRY]: 'Group by Expiry Date',
  [GroupType.CHECKED]: 'Group by Checked Date',
  [GroupType.ADDED]: 'Group by Added Date',
  [GroupType.CALORIES]: 'Group Calories (kcal) by Location',
  [GroupType.WATER]: 'Group Water (ml) by Location'
};

const numberList = [
  CONSTANTS.headers.id,
  CONSTANTS.headers.quantity,
  CONSTANTS.headers.calories,
  CONSTANTS.headers.water
];
const dateList = [CONSTANTS.headers.added, CONSTANTS.headers.expiry, CONSTANTS.headers.checked];

const localStorageGroupType = `${CONSTANTS.appId}.groupType`;

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  public groupTypes = Object.values(GroupType);
  public selectedGroupType = undefined;
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
    this._setLocalStorageGroupTypeSelected(type);
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
      [GroupType.LOCATION]: () => this._groupByProp(this._items, CONSTANTS.headers.location),
      [GroupType.TYPE]: () => this._groupByProp(this._items, CONSTANTS.headers.type),
      [GroupType.EXPIRY]: () => this._groupByDate(this._items, CONSTANTS.headers.expiry),
      [GroupType.CHECKED]: () => this._groupByDate(this._items, CONSTANTS.headers.checked),
      [GroupType.ADDED]: () => this._groupByDate(this._items, CONSTANTS.headers.added),
      [GroupType.CALORIES]: () =>
        this._filterPropAndGroupByProp(
          this._items,
          CONSTANTS.headers.calories,
          CONSTANTS.headers.location
        ),
      [GroupType.WATER]: () =>
        this._filterPropAndGroupByProp(
          this._items,
          CONSTANTS.headers.water,
          CONSTANTS.headers.location
        )
    }[type].call(this);
  }

  private _filterPropAndGroupByProp(
    items: DataListItem[],
    filterProp: string,
    groupProp: string
  ): void {
    const itemsWithinExpiryWithProp = this._items.filter(
      (item) => item.expiry > new Date() && item[filterProp] && item[filterProp] > 0
    );
    this._groupByProp(itemsWithinExpiryWithProp, groupProp);
  }

  private _groupByDate(items: DataListItem[], dateProp: string): void {
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

    items.forEach((item) => {
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

  private _groupByProp(items: DataListItem[], prop: string): void {
    const groupMap = {};
    items.forEach((item) =>
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
    const groupType = this._getLocalStorageGroupTypeSelected()
      ? this._getLocalStorageGroupTypeSelected()
      : Object.values(GroupType)[0];
    this.onGroupTypeChange(groupType);
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

  private _getLocalStorageGroupTypeSelected(): GroupType {
    return window.localStorage.getItem(localStorageGroupType) as GroupType;
  }

  private _setLocalStorageGroupTypeSelected(type: GroupType): void {
    window.localStorage.setItem(localStorageGroupType, type);
  }
}
