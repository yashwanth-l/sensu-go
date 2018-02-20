import React from "react";
import PropTypes from "prop-types";

import { withRouter, routerShape } from "found";
import reduce from "lodash/reduce";
import uniq from "lodash/uniq";
import get from "lodash/get";
import { createFragmentContainer, graphql } from "react-relay";
import { withStyles } from "material-ui/styles";

import checkboxIcon from "material-ui/Checkbox";

import EntitiesListItem from "./EntitiesListItem";
import EntitiesContainerMenu from "./EntitiesContainerMenu";

const styles = theme => ({
  eventsContainer: {
    border: "1px solid",
    borderRadius: 2,
    borderColor: theme.palette.divider,
    marginTop: 16,
    marginBottom: 16,
  },
  tableHeader: {
    padding: "20px 0 16px",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    // TODO revist with typography
    display: "flex",
    alignItems: "center",
  },
  tableHeaderButton: {
    marginLeft: 16,
    display: "flex",
  },
  checkbox: {
    marginTop: -4,
    width: 24,
    height: 24,
    color: theme.palette.primary.contrastText,
  },
});

class EntitiesContainer extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    viewer: PropTypes.shape({ entities: PropTypes.object }).isRequired,
    router: routerShape.isRequired,
    Checkbox: PropTypes.func.isRequired,
  };

  static defaultProps = {
    Checkbox: checkboxIcon,
  };

  state = {
    filters: [],
  };

  // TODO revist this later
  requeryEntity = newValue => {
    this.props.router.push(
      `${window.location.pathname}?filter=event.Entity.ID=='${newValue}'`,
    );
  };
  requeryCheck = newValue => {
    this.props.router.push(
      `${window.location.pathname}?filter=event.Check.Name=='${newValue}'`,
    );
  };
  requeryStatus = newValue => {
    this.props.router.push(
      `${window.location.pathname}?filter=event.Check.Status==${newValue}`,
    );
  };

  render() {
    const { classes, viewer, Checkbox } = this.props;

    const entities = get(viewer, "entities.edges", []);
    const subscriptions = reduce(
      entities,
      (memo, edge) => uniq([...memo, ...edge.node.subscriptions]),
      [],
    );
    const statuses = [0, 1, 2, 3];

    return (
      <div className={classes.eventsContainer}>
        <div className={classes.tableHeader}>
          <span className={classes.tableHeaderButton}>
            <Checkbox color="secondary" className={classes.checkbox} />
          </span>
          <EntitiesContainerMenu
            onSelectValue={this.requeryEntity}
            label="Subscriptions"
            contents={subscriptions}
          />
          <EntitiesContainerMenu
            onSelectValue={this.requeryStatus}
            label="Status"
            contents={statuses}
            icons
          />
        </div>
        {entities.map(entity => (
          <EntitiesListItem key={entity.node.id} entity={entity.node} />
        ))}
      </div>
    );
  }
}

export default createFragmentContainer(
  withStyles(styles)(withRouter(EntitiesContainer)),
  graphql`
    fragment EntitiesContainer_viewer on Viewer {
      entities(first: 1000) {
        edges {
          node {
            id
            subscriptions
            ...EntitiesListItem_entity
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `,
);
