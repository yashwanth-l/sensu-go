import React from "react";

import AppLayout from "/lib/component/AppLayout";
import NotFound from "/client/component/partial/NotFound";

class NotFoundView extends React.PureComponent {
  render() {
    return <AppLayout content={<NotFound />} />;
  }
}

export default NotFoundView;
