import React from "react";
import PropTypes from "prop-types";

import ListToolbar from "/client/component/partial/ListToolbar";
import NewMenuItem from "/client/component/partial/ToolbarMenuItems/New";
import ResetMenuItem from "/client/component/partial/ToolbarMenuItems/Reset";
import SearchBox from "/lib/component/SearchBox";
import ToolbarMenu from "/client/component/partial/ToolbarMenu";

class SilencesListToolbar extends React.Component {
  static propTypes = {
    filter: PropTypes.string,
    onChangeQuery: PropTypes.func.isRequired,
    onClickCreate: PropTypes.func.isRequired,
    onClickReset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    filter: "",
  };

  render() {
    return (
      <ListToolbar
        search={
          <SearchBox
            placeholder="Filter silences…"
            initialValue={this.props.filter}
            onSearch={this.props.onChangeQuery}
          />
        }
        toolbarItems={({ collapsed }) => {
          const unlessCollapsed = visiblity =>
            collapsed ? "never" : visiblity;

          return (
            <ToolbarMenu>
              <ToolbarMenu.Item id="new" visible={unlessCollapsed("always")}>
                <NewMenuItem
                  title="New Silence…"
                  onClick={this.props.onClickCreate}
                />
              </ToolbarMenu.Item>
              <ToolbarMenu.Item id="reset" visible={unlessCollapsed("if-room")}>
                <ResetMenuItem onClick={this.props.onClickReset} />
              </ToolbarMenu.Item>
            </ToolbarMenu>
          );
        }}
      />
    );
  }
}

export default SilencesListToolbar;
