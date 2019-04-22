import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import OAuthButton from './OAuthButton';
import Amplify, {Auth, Hub} from 'aws-amplify';
import awsmobile from './aws-exports'; // your Amplify configuration

Amplify.configure(awsmobile);

class App extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
    // let the Hub module listen on Auth events
    Hub.listen('auth', (data) => {
        switch (data.payload.event) {
            case 'signIn':
                this.setState({authState: 'signedIn'});
                this.setState({authData: data.payload.data});
                Auth.currentAuthenticatedUser().then(user => {
                  const { identities } = user.attributes;
                  const provider = JSON.parse(identities);
                  this.setState({email: user.attributes.email, provider: provider[0].providerName});
                }).catch(e => {
                  console.log(e);
                });
                break;
            case 'signIn_failure':
                this.setState({authState: 'signIn'});
                this.setState({authData: null});
                this.setState({authError: data.payload.data});
                break;
            default:
                break;
        }
    });
    this.state = {
      authState: 'loading',
      authData: null,
      authError: null,
      email: null,
      provider: null
    }
  }

  componentDidMount() {
    console.log('on component mount');
    // check the current user when the App component is loaded
    Auth.currentAuthenticatedUser().then(user => {
      console.log(user);
      this.setState({authState: 'signedIn'});
    }).catch(e => {
      console.log(e);
      this.setState({authState: 'signIn'});
    });
  }

  signOut() {
    Auth.signOut().then(() => {
      this.setState({authState: 'signIn'});
    }).catch(e => {
      console.log(e);
    });
  }

  render() {
    const { authState, email, provider } = this.state;
    return (
      <div className="App App-header">
      <img src={logo} className="App-logo" alt="logo" />
        {authState === 'loading' && (<div>loading...</div>)}
        {authState === 'signIn' && (<OAuthButton/>)}
        {authState === 'signedIn' && (<div><span>Welcome {email} via {provider}</span><br/><button className="btn btn-primary" onClick={this.signOut}>Sign out</button></div>)}
      </div>
    );
  }
}

export default App;
