import * as React from "react";
import SelectionPanel from "../selectionPanel/SelectionPanel";
import {Frame} from "../frame/Frame";
import {ActiveNavbarItem} from "../navbar/ActiveNavbarItem";

export const SelectionHome: React.FunctionComponent<{}> = () => (
  <Frame
    activeNavItem={ActiveNavbarItem.Home}
    documentTitle="Selection"
    cardTitle="Selection Panel"
  >
    <SelectionPanel />
  </Frame>
);
