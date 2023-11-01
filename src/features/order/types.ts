import { RouterOutput } from '@/server/api/root';

export type OrderItem = RouterOutput['sale']['orderById'][number];
