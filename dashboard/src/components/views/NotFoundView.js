import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { NotFoundLayout } from "/components/partials/NotFound";

const symbols = ["✄···", "🤯", "🐳", "🚀", "🏗", "🚧"];

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
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
  headline: {
    fontSize: 128,
    fontWeight: 100,
  },
  subheading: {
    fontSize: 24,
  },
  [theme.breakpoints.up("md")]: {
    root: {
      textAlign: "left",
    },
  },
});

class NotFoundView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super(props);
    this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
  }

  render() {
    const { classes } = this.props;

    return (
      <NotFoundLayout
        graphic={
          <p>
            <span role="img" aria-label="not-found">
              {this.symbol}
            </span>
          </p>
        }
      >
        <Typography
          className={classes.headline}
          variant="headline"
          color="textSecondary"
        >
          404
        </Typography>
        <Typography
          className={classes.subheading}
          variant="subheading"
          color="inherit"
        >
          The page you requested isn’t here.{" "}
        </Typography>
        <Typography variant="body1" color="inherit">
          If you opened a link, it’s possible that the resource was deleted or
          you no longer have access.
        </Typography>
        <Typography variant="body1" color="inherit">
          <a href="#back" onClick={() => window.history.back()}>
            Go back
          </a>{" "}
          or <a href="/">return home</a>.
        </Typography>
      </NotFoundLayout>
    );
  }
}

export default withStyles(styles)(NotFoundView);
