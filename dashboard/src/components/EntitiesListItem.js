import React from "react";
import PropTypes from "prop-types";

import { createFragmentContainer, graphql } from "react-relay";
import moment from "moment";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";

import Checkbox from "material-ui/Checkbox";
import chevronIcon from "material-ui-icons/ChevronRight";

import EventStatus from "./EventStatus";

const styles = theme => ({
  row: {
    display: "flex",
    width: "100%",
    borderBottomColor: theme.palette.divider,
    borderBottom: "1px solid",
    // TODO revist with typography
    fontFamily: "SF Pro Text",
  },
  checkbox: {
    display: "inline-block",
    verticalAlign: "top",
    marginLeft: 4,
  },
  status: {
    display: "inline-block",
    verticalAlign: "top",
    padding: "14px 0",
  },
  content: {
    width: "100%",
    display: "inline-block",
    padding: 14,
  },
  command: { fontSize: "0.8125rem" },
  chevron: {
    verticalAlign: "top",
    marginTop: -2,
    color: theme.palette.primary.light,
  },
  timeHolder: {
    width: "100%",
    display: "flex",
    fontSize: "0.8125rem",
    margin: "4px 0 6px",
  },
  pipe: { marginTop: -4 },
});

class EntitiesListItem extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    Chevron: PropTypes.func.isRequired,
    entity: PropTypes.shape({
      name: "",
      subscriptions: "",
      lastSeen: "",
      timestamp: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    Chevron: chevronIcon,
  };

  render() {
    const { classes, Chevron, entity, ...other } = this.props;
    const lastSeen = moment(entity.lastSeen).fromNow();

    return (
      <div className={classes.row}>
        <div className={classes.checkbox}>
          <Checkbox />
        </div>
        <div className={classes.status}>
          <EventStatus status={entity.status} />
        </div>
        <div className={classes.content}>
          <span className={classes.caption}>{entity.name}</span>
          <div {...other} />
          <div className={classes.timeHolder}>
            Last ran<span className={classes.time}>&nbsp;{lastSeen}.</span>&nbsp;With
            an exit status of&nbsp;<span className={classes.time}>
              {entity.status}.
            </span>
          </div>
          <Typography type="caption" className={classes.command}>
            {""}
          </Typography>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  withStyles(styles)(EntitiesListItem),
  graphql`
    fragment EntitiesListItem_entity on Entity {
      name
      subscriptions
      lastSeen
      system {
        platform
        network {
          interfaces {
            addresses
          }
        }
      }
    }
  `,
);
