import { type StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createUiSlice, type UiSlice } from './ui/slice';
import { CartSlice, createCartSlice } from './cart/cart';

export type AppState = UiSlice & CartSlice; // Updated AppState type

export type AppSliceCreator<T> = StateCreator<
  AppState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  T
>;

export const useAppStore = create<AppState>()(
  immer(
    devtools((...a) => ({
      ...createUiSlice(...a),
      ...createCartSlice(...a),
    })),
  ),
);
