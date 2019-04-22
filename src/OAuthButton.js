import { withOAuth } from 'aws-amplify-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';

class OAuthButton extends Component {
  render() {
    return (
      <button className="btn btn-primary" onClick={this.props.OAuthSignIn}>
        Sign in with AWS
      </button>
    )
  }
}

export default withOAuth(OAuthButton);