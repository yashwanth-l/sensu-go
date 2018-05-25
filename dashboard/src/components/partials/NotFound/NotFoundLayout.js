import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";

const Grow = withStyles(() => ({
  root: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}))(({ classes, ...props }) => <div className={classes.root} {...props} />);

const styles = theme => ({
  root: {
    color: theme.palette.text.hint,
    "& a": {
      textDecoration: "underline",
    },
    "& a:visited": {
      color: "inherit",
    },
    "& a:link": {
      color: "inherit",
    },
  },
  container: {
    maxWidth: 1080,
    justifyContent: "center",
  },
  graphic: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 96,
    margin: 0,
  },
});

class NotFoundLayout extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    graphic: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <Grow>
        <Grid container spacing={40} className={this.props.classes.container}>
          <Hidden smDown>
            <Typography
              component={Grid}
              item
              sm={6}
              className={this.props.classes.graphic}
              color="textSecondary"
              variant="headline"
            >
              {this.props.graphic}
            </Typography>
          </Hidden>
          <Grid item xs={12} sm={6}>
            {this.props.children}
          </Grid>
        </Grid>
      </Grow>
    );
  }
}

export default withStyles(styles)(NotFoundLayout);
