import gql from "graphql-tag";
import { REACT_APP_JWT_KEY } from "../../../config.js";

const SIGN_IN_MUTATION = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      error {
        message
      }
      data {
        jwt
      }
    }
  }
`;

function login({ client, setValue }) {
  return async ({ email, password }) => {
    const result = await client.mutate({
      mutation: SIGN_IN_MUTATION,
      variables: { email, password }
    });

    if (result.data.signIn.error) {
      throw new Error(result.data.signIn.error.message);
    }

    const { jwt } = result.data.signIn.data;

    setValue(value => ({ ...value, isLoggedIn: true }));

    localStorage.setItem(REACT_APP_JWT_KEY, jwt);
  };
}

export default login;
