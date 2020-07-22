import React, { useState, useEffect, useContext } from "react";
import gql from "graphql-tag";
import { Context as GraphQL } from "../GraphQL/index.js";
import { Context as Toast } from "../Toast/index.js";

const Context = React.createContext();

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription notification {
    notification {
      _id
    }
  }
`;

function Provider(props) {
  const { client } = useContext(GraphQL);
  const { addToast } = useContext(Toast);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const subscription = client
      .subscribe({
        query: NOTIFICATION_SUBSCRIPTION
      })
      .subscribe(() => {
        const toast = {
          message: `New Notification`,
          variant: "info"
        };

        addToast(toast);

        setNotificationCount(c => c + 1);
      });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <Context.Provider value={{ setNotificationCount, notificationCount }}>
      {props.children}
    </Context.Provider>
  );
}

export { Context, Provider };
