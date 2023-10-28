import { type StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { CartSlice, createCartSlice } from './cart/cart';

export type AppState = CartSlice; // Updated AppState type

export type AppSliceCreator<T> = StateCreator<
  AppState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  T
>;

export const useAppStore = create<AppState>()(
  immer(
    devtools((...a) => ({
      ...createCartSlice(...a),
    })),
  ),
);
