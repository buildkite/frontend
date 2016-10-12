import Relay from 'react-relay';

export const query = () => Relay.QL`
  query {
    apiAccessTokenCode(code: $code)
  }
`;

export default { query };
