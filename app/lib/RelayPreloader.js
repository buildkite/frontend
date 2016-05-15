import Relay from 'react-relay';

const QUERIES = {
  'organization/pipelines/index': Relay.QL`
    query ($slug: ID!) {
      organization(slug: $slug) {
        ${require("../components/organization/Pipelines/index").default.getFragment('organization')}
      }
    }
  `
}

class RelayPreloader {
  preload(id, variables, payload) {
    let query = Relay.createQuery(QUERIES[id], variables);

    Relay.Store.getStoreData().handleQueryPayload(query, payload);
  }
}

export default new RelayPreloader();
