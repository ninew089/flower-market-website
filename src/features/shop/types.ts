import type * as z from 'zod';
import { shopItems } from './helpers/validators';
import { RouterOutput } from '@/server/api/root';

export type ShopItemInput = z.infer<typeof shopItems>;
export type ShopStaticItem =
  RouterOutput['item']['byUserIdWithStatic']['listItems'][number];
export type CustomerOrder = RouterOutput['order']['orderByShopId'][number];
