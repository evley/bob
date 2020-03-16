import { ImportMethod } from '@evley/importer';

export const CONSTANTS: Constants = {
  appId: 'BOB',
  importMethods: [ImportMethod.CSV],
  projectLink: 'https://github.com/evley/bob',
  templateLink: 'https://github.com/evley/bob/tree/master/src/assets/template',
  headers: {
    id: 'id',
    name: 'name',
    quantity: 'quantity',
    type: 'type',
    location: 'location',
    added: 'added',
    expiry: 'expiry',
    checked: 'checked',
    calories: 'calories',
    water: 'water'
  }
};

export interface Constants {
  appId: string;
  importMethods: Array<keyof typeof ImportMethod>;
  projectLink: string;
  templateLink: string;
  headers: {
    id: string;
    name: string;
    quantity: string;
    type: string;
    location: string;
    added: string;
    expiry: string;
    checked: string;
    calories: string;
    water: string;
  };
}
