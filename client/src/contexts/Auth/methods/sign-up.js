import gql from "graphql-tag";
import { REACT_APP_JWT_KEY } from "../../../config.js";

const Mutation = gql`
  mutation signUp($username: String!, $email: String!, $password: String!) {
    signUp(input: { username: $username, email: $email, password: $password }) {
      error {
        message
      }
      data {
        jwt
        user {
          _id
          username
          email
        }
      }
    }
  }
`;

function signUp({ client, setValue }) {
  return async ({ username, email, password }) => {
    const result = await client.mutate({
      mutation: Mutation,
      variables: { username, email, password }
    });

    if (result.data.signUp.error) {
      throw new Error(result.data.signUp.error.message);
    }

    const { jwt, user } = result.data.signUp.data;

    setValue(value => ({ ...value, isLoggedIn: true, jwt, user }));

    localStorage.setItem(REACT_APP_JWT_KEY, jwt);

    return result;
  };
}

export default signUp;
