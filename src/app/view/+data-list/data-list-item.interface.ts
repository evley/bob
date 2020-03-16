export interface DataListItem {
  id: number;
  name: string;
  quantity: number;
  type: string;
  location: string;
  added: Date;
  expiry: Date;
  checked: Date;
  calories: number;
  water: number;
  selected: boolean;
}
