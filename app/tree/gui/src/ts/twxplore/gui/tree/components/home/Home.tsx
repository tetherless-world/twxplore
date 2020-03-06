import * as React from "react";
import {Frame} from "twxplore/gui/tree/components/frame/Frame";
import {ActiveNavbarItem} from "twxplore/gui/tree/components/navbar/ActiveNavbarItem";
import {PanelParent} from "../PanelParent/PanelParent";

export const Home: React.FunctionComponent<{}> = () => (
  <Frame
    activeNavItem={ActiveNavbarItem.Home}
    documentTitle="Home"
    cardTitle="Info Panel"
  >
    <PanelParent />
  </Frame>
);
