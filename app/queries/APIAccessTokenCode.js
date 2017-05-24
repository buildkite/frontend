import Relay from 'react-relay/classic';

export const query = () => Relay.QL`
  query {
    apiAccessTokenCode(code: $code)
  }
`;
