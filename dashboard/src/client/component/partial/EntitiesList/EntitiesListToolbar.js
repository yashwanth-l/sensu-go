import React from "react";
import PropTypes from "prop-types";

import ListToolbar from "/client/component/partial/ListToolbar";
import ResetMenuItem from "/client/component/partial/ToolbarMenuItems/Reset";
import SearchBox from "/lib/component/SearchBox";
import ToolbarMenu from "/client/component/partial/ToolbarMenu";

class EntitiesListToolbar extends React.PureComponent {
  static propTypes = {
    query: PropTypes.string,
    onChangeQuery: PropTypes.func.isRequired,
    onClickReset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    query: "",
  };

  render() {
    const { onChangeQuery, onClickReset, query } = this.props;

    return (
      <ListToolbar
        search={
          <SearchBox
            placeholder="Filter entities…"
            initialValue={query}
            onSearch={onChangeQuery}
          />
        }
        toolbarItems={({ collapsed }) => (
          <ToolbarMenu>
            <ToolbarMenu.Item
              id="reset"
              visible={collapsed ? "never" : "if-room"}
            >
              <ResetMenuItem onClick={onClickReset} />
            </ToolbarMenu.Item>
          </ToolbarMenu>
        )}
      />
    );
  }
}

export default EntitiesListToolbar;
