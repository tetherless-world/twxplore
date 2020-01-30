import { ActiveSidebarItem } from "../components/sidebar/ActiveSidebarItem";

export const CHANGE_TOOL = 'CHANGE_TOOL'

export interface ChangeToolAction {
  type: typeof CHANGE_TOOL
  tool: ActiveSidebarItem
}

export interface ChangeToolState {
  active_tool: ActiveSidebarItem
}

export type ChangeToolTypes = ChangeToolAction