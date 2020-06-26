import React, { useContext } from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "../../contexts/index.js";

function Protected({ exact, path, component: Component }) {
  const { isLoggedIn } = useContext(AuthContext.Context);

  return (
    <Route
      exact={exact}
      path={path}
      render={(...props) => {
        if (!isLoggedIn) {
          props[0].history.push("/no-power");
        }

        // eslint-disable-next-line react/jsx-props-no-spreading
        return <Component {...props} />;
      }}
    />
  );
}

export default Protected;
