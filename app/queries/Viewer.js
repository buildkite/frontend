import Relay from 'react-relay';

export const query = () => Relay.QL`
  query {
    viewer
  }
`;

export default { query };
