export type * from "./prospect";
export type * from "./scan";
export type * from "./risk";

export type ScreenId = 1 | 2 | 3 | 4 | 5 | 6;

export interface AppState {
  currentScreen: ScreenId;
  fullscreen: boolean;
  shortcutsVisible: boolean;
}
