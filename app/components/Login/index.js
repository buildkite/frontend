import React from 'react';
import styled from 'styled-components';

import FormTextField from '../shared/FormTextField';
import Button from '../shared/Button';

const CenteredContainer = styled.div.attrs({
  className: 'center flex flex-column justify-center'
})`
  min-width: 100vw;
  min-height: 100vh;
`;

const CenteredContent = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`;

const CenteredForm = styled.div.attrs({
  className: 'mx-auto'
})`
  max-width: 320px;
`;

export default function Login() {
  return (
    <CenteredContainer>
      <div className="flex-none">
        <p><a href="">Buildkite</a></p>
      </div>
      <CenteredContent>
        <CenteredForm>
          <h1 className="h1 bold">Hi! Please sign in…</h1>
          <form className="flex flex-column">
            <FormTextField />
            <Button>Sign In</Button>
          </form>
        </CenteredForm>
      </CenteredContent>
      <div className="flex-none">
        <p>Don’t have an account? <a href="">Get Started</a></p>
      </div>
    </CenteredContainer>
  );
}