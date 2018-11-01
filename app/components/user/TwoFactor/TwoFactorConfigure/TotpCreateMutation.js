// @flow

import { graphql, commitMutation } from 'react-relay/compat';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import RecoveryCodeList from 'app/components/RecoveryCodeList'; // eslint-disable-line
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

export default function TotpCreateMutation({ environment, onCompleted }: MutationParams): void {
  commitMutation(
    environment,
    {
      mutation: graphql`
        mutation TotpCreateMutation($input: TOTPCreateInput!) {
          totpCreate(input: $input) {
            provisioningUri
            totp {
              id
            }
          }
        }
      `,
      variables: { input: {} },
      onError: handleCreateMutationError,
      onCompleted
    }
  );
}

function handleCreateMutationError(error) {
  if (error && error.source) {
    switch (error.source.type) {
      case GraphQLErrors.ERROR:
        // TODO: Sorry, this check sucks, I know, but it's temporary until we don't have any users under classic SSO rules - Jessica, July '18
        // If we get an SSO-related error back, something's gone weird (a user shouldn't be able to get here under those circumstances) but I'm handling it just in case.
        if (error.source.errors && error.source.errors[0] && error.source.errors[0].message && error.source.errors[0].message === 'TOTP configuration is not available to SSO users') {
          // Show an alert (the backend handling would show a similar flash, but I decided this was better than allowing for a potential infinite loop)
          alert([
            'You currently use Buildkite via Single Sign-On.',
            'Two-factor authentication cannot be enabled on your account until you reset your password.',
            'Weʼll take you back to your personal settings.'
          ].join('\n\n'));
          location.assign('/user/settings');
          return;
        }
        break;
      case GraphQLErrors.ESCALATION_ERROR:
        // Reload the page so that the backend can prompt to escalate the current session for us
        location.reload();
        return;
      default:
        break;
    }
  }
  alert(error);
}
