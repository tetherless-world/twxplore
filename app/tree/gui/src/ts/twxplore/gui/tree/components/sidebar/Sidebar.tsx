import './Sidebar.scss';

import * as React from "react";
import Sidebar from "react-sidebar";
import {Select} from "./Select"
import { ActiveSidebarItem } from './ActiveSidebarItem'
import { Button } from 'reactstrap';
 
type State = {
  sidebarOpen: boolean
}

type Props = {
  activeTool?: ActiveSidebarItem
}

class EditHud extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      sidebarOpen: true,
    };
 
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }
 
  onSetSidebarOpen(open:boolean) {
    this.setState({ sidebarOpen: open });
  }

  toggleSidebar() {
    this.onSetSidebarOpen(!this.state.sidebarOpen)
  }
 
  render() {
    return (
      <Sidebar
        sidebar={
        <>
          {this.props.activeTool === ActiveSidebarItem.Select && <Select/>}
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </>
      }
        sidebarClassName="sidebar"
        overlayClassName="overlay"
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
        pullRight={true}
        shadow={false}
      >
      <Button color="primary" onClick={() => this.toggleSidebar()}>Toggle Sidebar</Button>{' '}
      </Sidebar>
    );
  }
}
 
export default EditHud;