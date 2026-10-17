import {GROUP_TYPES} from '../src/group-catalog.js';
export const RAILWAY_ASSETS=[...GROUP_TYPES.map(t=>({id:'railway-'+t.id,key:t.id})),...['locomotive','carriage','station','track','gate'].map(key=>({id:'railway-'+key,key}))];
