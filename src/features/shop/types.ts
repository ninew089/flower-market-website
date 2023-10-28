import type * as z from "zod";
import { shopItems } from "./helpers/validators";



export type ShopItemInput = z.infer<typeof shopItems>;
