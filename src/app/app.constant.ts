import { ImportMethod } from '@evley/importer';

export const CONSTANTS: Constants = {
  appId: 'BOB',
  importMethods: [ImportMethod.CSV],
  projectLink: 'https://github.com/evley/bob',
  templateLink: 'https://github.com/evley/bob/tree/master/src/assets/template',
  headers: {
    id: 'id',
    calories: 'calories',
    water: 'water',
    added: 'added',
    expiry: 'expiry',
    location: 'location',
    type: 'type'
  }
};

export interface Constants {
  appId: string;
  importMethods: Array<keyof typeof ImportMethod>;
  projectLink: string;
  templateLink: string;
  headers: {
    id: string;
    calories: string;
    water: string;
    added: string;
    expiry: string;
    location: string;
    type: string;
  };
}
