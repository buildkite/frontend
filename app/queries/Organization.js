import Relay from 'react-relay';

export const query = () => Relay.QL`
  query {
    organization(slug: $organization)
  }
`;

export default { query };
