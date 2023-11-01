import { RouterOutput } from '@/server/api/root';

export type OrderItem = RouterOutput['order']['orderByCustomerId'][number];
