import { ActiveSidebarItem } from "../components/sidebar/ActiveSidebarItem"
import { ChangeToolTypes } from "../types/geoTypes"

export const changeTool = (tool: ActiveSidebarItem): ChangeToolTypes => {
  return {
    type: 'CHANGE_TOOL',
    tool
  }
}
