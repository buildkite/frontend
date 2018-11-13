// @flow

import Relay from 'react-relay/compat';

export const query = () => Relay.QL`
  query {
    apiAccessTokenCode(code: $code)
  }
`;
