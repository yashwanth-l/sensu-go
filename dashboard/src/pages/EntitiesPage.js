import React from "react";
import PropTypes from "prop-types";
import { graphql } from "react-relay";

import Paper from "material-ui/Paper";
import AppContent from "../components/AppContent";
import EntitiesContainer from "../components/EntitiesContainer";

class EntitiesPage extends React.Component {
  static propTypes = {
    viewer: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  static query = graphql`
    query EntitiesPageQuery {
      viewer {
        ...EntitiesContainer_viewer
      }
    }
  `;

  render() {
    const { viewer } = this.props;
    return (
      <AppContent>
        <Paper>
          <EntitiesContainer viewer={viewer} />
        </Paper>
      </AppContent>
    );
  }
}

export default EntitiesPage;
