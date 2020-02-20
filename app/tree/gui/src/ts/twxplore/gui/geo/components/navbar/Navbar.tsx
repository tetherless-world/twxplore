import {ActiveNavbarItem} from 'twxplore/gui/geo/components/navbar/ActiveNavbarItem';
import {ActiveSidebarItem} from 'twxplore/gui/geo/components/sidebar/ActiveSidebarItem';
import {Hrefs} from 'twxplore/gui/geo/Hrefs';
import * as React from 'react';
import { compose } from 'redux'
import {connect, MapDispatchToProps} from 'react-redux';
import {Link, RouteComponentProps, withRouter} from 'react-router-dom';
import {Form, FormGroup, Input, Nav, Navbar as BootstrapNavbar, NavbarBrand, NavItem, NavLink,} from 'reactstrap';
import { Dispatch } from 'react';

const mapStateToProps = (state:any) => state;
const mapDispatchToProps = (dispatch:Dispatch<any>) => {
  return {
    changeTool: (tool: ActiveSidebarItem) => dispatch({ type: 'ActiveTool', activeTool: tool})
  }
};

interface Props {
    activeNavItem?: ActiveNavbarItem;
    activeSideItem?: ActiveSidebarItem;
    dispatch: ReturnType<typeof mapDispatchToProps>

}

const NavbarImpl: React.FunctionComponent<Props> = ({activeNavItem, activeSideItem, dispatch}) => {
  const handleClick = (toolType:ActiveSidebarItem) => {
    dispatch.changeTool(toolType)
  }
  
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
                          onClick={() => handleClick(ActiveSidebarItem.Select)}
                        >
                          Select
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
        </div>);
}

export const Navbar = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(NavbarImpl);
