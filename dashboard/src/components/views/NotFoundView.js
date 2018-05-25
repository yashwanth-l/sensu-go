import React from "react";
import NotFoundContent from "/components/partials/NotFound";

class NotFoundView extends React.PureComponent {
  render() {
    return (
      <NotFoundContent
        title="404"
        subtitle="The page you requested isn’t here."
        content={
          <React.Fragment>
            <p>
              If you opened a link, it’s possible that the resource was deleted
              or you no longer have access.
            </p>
            <p>
              <a href="#back" onClick={() => window.history.back()}>
                Go back
              </a>{" "}
              or <a href="/">return home</a>.
            </p>
          </React.Fragment>
        }
      />
    );
  }
}

export default NotFoundView;
