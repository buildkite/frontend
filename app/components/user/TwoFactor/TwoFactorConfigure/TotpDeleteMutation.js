// @flow

import { graphql, commitMutation } from 'react-relay/compat';
import type {
  TotpDeleteMutationMutationVariables as Variables,
  TotpDeleteMutationMutationResponse as Response
} from './__generated__/TotpCreateMutation.graphql';

type MutationParams = {
  environment: *, // TODO
  onCompleted?: (response: Response) => *,
  onError?: () => void,
  variables?: Variables
};

export default function TotpDeleteMutation({ environment, variables }: MutationParams): void {
  commitMutation(
    environment,
    {
      mutation: graphql`
        mutation TotpDeleteMutationMutation($input: TOTPDeleteInput!) {
          totpDelete(input: $input) {
            clientMutationId
          }
        }
      `,
      variables
    }
  );
}
