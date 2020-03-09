import * as React from "react";
import {Frame} from "twxplore/gui/tree/components/frame/Frame";
import {ActiveNavbarItem} from "twxplore/gui/tree/components/navbar/ActiveNavbarItem";
import SelectionPanel from "../selectionPanel/SelectionPanel";

export const SelectionHome: React.FunctionComponent<{}> = () => (
  <Frame
    activeNavItem={ActiveNavbarItem.Home}
    documentTitle="Selection"
    cardTitle="Selection Panel"
  >
    <SelectionPanel />
  </Frame>
);
