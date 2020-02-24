import * as React from 'react';
import {Frame} from "twxplore/gui/geo/components/frame/Frame";
import {ActiveNavbarItem} from "twxplore/gui/geo/components/navbar/ActiveNavbarItem";
import {TreesList} from "twxplore/gui/geo/components/trees/TreesList";

export const Home: React.FunctionComponent<{}> = () => (
    <Frame
        activeNavItem={ActiveNavbarItem.Home}
        documentTitle="Home"
        cardTitle="Features"
    >
        <TreesList/>
    </Frame>);
