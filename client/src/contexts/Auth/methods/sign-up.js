import gql from "graphql-tag";
import { REACT_APP_JWT_KEY } from "../../../config.js";

const SIGNUP_MUTATION = gql`
  mutation signUp(
    $username: String!
    $email: String!
    $password: String!
    $profilePic: Upload
  ) {
    signUp(
      input: {
        username: $username
        email: $email
        password: $password
        profilePic: $profilePic
      }
    ) {
      error {
        message
      }
      data {
        jwt
      }
    }
  }
`;

function signUp({ client, setValue }) {
  return async ({ username, email, password, profilePic }) => {
    const result = await client.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password, profilePic }
    });

    if (result.data.signUp.error) {
      throw new Error(result.data.signUp.error.message);
    }

    const { jwt } = result.data.signUp.data;

    setValue(value => ({ ...value, isLoggedIn: true }));

    localStorage.setItem(REACT_APP_JWT_KEY, jwt);

    return result;
  };
}

export default signUp;
