import * as React from 'react';
import {Frame} from "twxplore/gui/geo/components/frame/Frame";
import {ActiveNavbarItem} from "twxplore/gui/geo/components/navbar/ActiveNavbarItem";
import {TreesList} from "twxplore/gui/geo/components/trees/TreesList";
import PanelParent from '../PanelParent/PanelParent';

export const Home: React.FunctionComponent<{}> = () => (
    <Frame
        activeNavItem={ActiveNavbarItem.Home}
        documentTitle="Home"
        cardTitle="Info Panel"
    >
        <PanelParent/>
    </Frame>);
