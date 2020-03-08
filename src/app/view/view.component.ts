import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CONSTANTS } from '../app.constant';
import { AppService } from '../app.service';
import { DataListItem } from './+data-list/data-list-item.interface';
import { Group } from './group.interface';

enum GroupType {
  LOCATION = 'location',
  TYPE = 'type',
  DATE = 'date'
}

const groupTypeIcon = {
  [GroupType.LOCATION]: 'location_on',
  [GroupType.TYPE]: 'category',
  [GroupType.DATE]: 'date_range'
};

const numberList = [CONSTANTS.headers.id, CONSTANTS.headers.calories, CONSTANTS.headers.water];
const dateList = [CONSTANTS.headers.added, CONSTANTS.headers.expiry];

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

  public onGroupTypeChange(type: GroupType): void {
    this.selectedGroupType = type;
    this._resetGroups();
    this._groupBy(type);
  }

  public groupTypeIcon(type: GroupType): string {
    return groupTypeIcon[type];
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
      [GroupType.DATE]: () => console.log('### date')
    }[type].call(this);
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
      .filter((item) => !!item.name);
  }

  private _handleItemValue(header: string, value: string): string | number | Date {
    const isInList = (list: string[]) => list.indexOf(header) > -1;

    if (value) {
      if (isInList(dateList)) {
        return value ? new Date(value) : undefined;
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
