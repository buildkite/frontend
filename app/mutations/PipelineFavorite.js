import Relay from 'react-relay';

class PipelineFavorite extends Relay.Mutation {
  static fragments = {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        pipelineFavorite
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on PipelineFavoritePayload {
        pipeline {
          favorite
        }
      }
    `;
  }

  getOptimisticResponse() {
    return {
      pipeline: {
        id: this.props.pipeline.id,
        favorite: this.props.favorite
      }
    };
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        pipeline: this.props.pipeline.id
      }
    }];
  }

  getVariables() {
    return { id: this.props.pipeline.id, favorite: this.props.favorite };
  }
}

export default PipelineFavorite;
