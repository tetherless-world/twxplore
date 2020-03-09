import {ActiveNavbarItem} from "twxplore/gui/tree/components/navbar/ActiveNavbarItem";
import {ActiveSidebarItem} from "twxplore/gui/tree/components/sidebar/ActiveSidebarItem";
import {Hrefs} from "twxplore/gui/tree/Hrefs";
import * as React from "react";
import {Link} from "react-router-dom";
import {
  Form,
  FormGroup,
  Input,
  Nav,
  Navbar as BootstrapNavbar,
  NavbarBrand,
  NavItem,
  NavLink,
} from "reactstrap";

interface Props {
  activeNavItem?: ActiveNavbarItem;
  activeSideItem?: ActiveSidebarItem;
}

export const Navbar: React.FunctionComponent<Props> = ({
  activeNavItem,
  activeSideItem,
}) => {
  return (
    <div>
      <BootstrapNavbar className="py-0 " color="light" light expand="md">
        <NavbarBrand href={Hrefs.home}>Twxplore</NavbarBrand>
        <Nav className="pb-2 pr-4 d-flex align-items-center">
          <NavItem>
            <Form>
              <FormGroup>
                <Input
                  type="search"
                  name="search"
                  id="exampleSearch"
                  placeholder="Feature Search"
                />
              </FormGroup>
            </Form>
          </NavItem>
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
              active={activeSideItem === ActiveSidebarItem.Select}
              tag={Link}
              to={Hrefs.map}
            >
              Map
            </NavLink>
          </NavItem>
          <NavItem active={activeNavItem === ActiveNavbarItem.Map}>
            <NavLink
              active={activeNavItem === ActiveNavbarItem.Map}
              tag={Link}
              to={Hrefs.home}
            >
              Filter
            </NavLink>
          </NavItem>
          <NavItem active={activeNavItem === ActiveNavbarItem.Home}>
            <NavLink
              active={activeNavItem === ActiveNavbarItem.Home}
              tag={Link}
              to={Hrefs.home}
            >
              Features
            </NavLink>
          </NavItem>
        </Nav>
      </BootstrapNavbar>
    </div>
  );
};
