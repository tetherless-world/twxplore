import * as React from "react";
import {Frame} from "../frame/Frame";
import {ActiveNavbarItem} from "../navbar/ActiveNavbarItem";
import {SelectionPanel} from "../selectionPanel/SelectionPanel";

export const SelectionHome: React.FunctionComponent<{}> = () => (
  <Frame
    activeNavItem={ActiveNavbarItem.Home}
    documentTitle="Selection"
    cardTitle="Selection Panel"
  >
    <SelectionPanel />
  </Frame>
);
