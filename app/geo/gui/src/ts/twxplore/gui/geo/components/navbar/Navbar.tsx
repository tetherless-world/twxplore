import {ActiveNavbarItem} from "twxplore/gui/geo/components/navbar/ActiveNavbarItem";
import {Hrefs} from "twxplore/gui/geo/Hrefs";
import * as React from "react";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {
  Nav,
  Navbar as BootstrapNavbar,
  NavbarBrand,
  NavItem,
  NavLink,
} from "reactstrap";

interface Props extends RouteComponentProps {
  activeNavItem?: ActiveNavbarItem;
}

const Navbar: React.FunctionComponent<Props> = ({activeNavItem}) => {
  return (
    <div>
      <BootstrapNavbar className="py-0" color="light" light expand="md">
        <NavbarBrand href={Hrefs.home}>twxplore</NavbarBrand>
        <Nav className="pb-2 pr-4">
          <NavItem active={activeNavItem === ActiveNavbarItem.Home}>
            <NavLink
              active={activeNavItem === ActiveNavbarItem.Home}
              tag={Link}
              to={Hrefs.home}
            >
              Home
            </NavLink>
          </NavItem>
          <NavItem active={activeNavItem === ActiveNavbarItem.Map}>
            <NavLink
              active={activeNavItem === ActiveNavbarItem.Map}
              tag={Link}
              to={Hrefs.map}
            >
              Map
            </NavLink>
          </NavItem>
          <NavItem active={activeNavItem === ActiveNavbarItem.Selection}>
            <NavLink
              active={activeNavItem === ActiveNavbarItem.Selection}
              tag={Link}
              to={Hrefs.selection}
            >
              Selection
            </NavLink>
          </NavItem>
        </Nav>
      </BootstrapNavbar>
    </div>
  );
};

export default withRouter(Navbar);
