import React, { Component } from "react";
import { connect } from "react-redux";
//import { setCurrentUser, logoutUser, loginUser } from '../redux/actions/auth_actions';
import { Divider, Icon, Button, Input } from "antd";
import { Router } from "../routes";
import axios from "axios";
import Web3 from "web3";

class PlayerInfo extends Component {
  state = {
    dcBalance: "0",
    ethBalance: "0",
    value: 0,
    expand: false,
    email: "",
    password: "",
    loading: false
  };

  submit = async () => {
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(user, this.callback);
  };

  callback = () => {
    Router.push("/cases");
  };

  renderNotLoggedIn() {
    console.log(this.props.error);
    return (
      <div
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <h2> Log In </h2>
          <Input
            style={{ marginBottom: "10px" }}
            placeholder="Email"
            onChange={event =>
              this.setState({
                email: event.target.value
              })
            }
          />
          <Input
            placeholder="Password"
            type="password"
            onChange={event =>
              this.setState({
                password: event.target.value
              })
            }
          />
          <Button
            type="primary"
            style={{ margin: "20px 20px 0px 20px" }}
            onClick={this.submit}
            loading={this.state.loading}
          >
            Log In
          </Button>

          {this.props.error ? (
            <h3
              style={{
                textAlign: "center",
                color: "red",
                margin: "10px 0px -10px 0px"
              }}
            >
              Login Error!
            </h3>
          ) : null}
        </div>

        <Divider />
        <Button
          style={{ margin: "0px 20px 0 20px" }}
          onClick={() => Router.push("/register/student")}
        >
          Register (Student)
        </Button>
        <Button
          style={{ margin: "0px 20px 0 20px" }}
          onClick={() => Router.push("/register/admin")}
        >
          Register (Administrator)
        </Button>
      </div>
    );
  }

  renderLoggedIn() {
    const web3 = new Web3(
      "https://rinkeby.infura.io/v3/6a20903e63ec4a96a771a79800a1a1d4"
    );

    const full = (
      <div
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <span style={{ fontSize: "120%" }}> Signed in as </span>
          <span
            style={{
              fontSize: "150%",
              color: "#10004e",
              fontWeight: "600"
            }}
          >
            {this.props.user.name}
          </span>
        </div>

        <Divider />

        {/* <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}
                >
                    <div>
                        <span style={{ fontWeight: '600' }}>Dapp Balance:&ensp;</span>{' '}
                        {formatPrice(this.props.user.dappBalance)}
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{ fontWeight: '600' }}>Ether Balance:&ensp;&nbsp;</span>{' '}
                        {formatPrice(this.props.user.ethBalance)}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <span style={{ fontWeight: '600' }}>Dapp Address:&ensp;&nbsp;</span>
                        <br />
                        <span style={{ fontSize: '90% ' }}>{this.props.user.address}</span>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <span style={{ fontWeight: '600' }}>Ether Address:&ensp;&nbsp;</span>
                        <br />
                        <span style={{ fontSize: '90% ' }}>{this.props.user.ethAddress}</span>
                    </div>

                    <span style={{ fontWeight: '500', fontSize: '120%' }}>Add Ether</span>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}
                    >
                        <EtherSelector
                            onBuyChange={event => this.setState({ value: event })}
                            value={this.state.value}
                            onDenominationChange={event => this.setState({ denom: event })}
                            wide
                        />
                        <Button onClick={this.addEther} icon="check" />
                    </div>
                </div> */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {this.links.map(link => (
            <Button
              icon={link.icon}
              onClick={link.click}
              style={{ width: "120px", margin: "5px" }}
            >
              {link.text}
            </Button>
          ))}
        </div>
        <Button
          icon="logout"
          onClick={() => this.props.logoutUser(() => Router.push("/"))}
          type="danger"
          style={{ width: "220px" }}
        >
          Logout
        </Button>
      </div>
    );

    return full;
  }

  render() {
    return this.props.isAuthenticated
      ? this.renderLoggedIn()
      : this.renderNotLoggedIn();
  }

  links = [
    { text: "Bugs", icon: "exclamation-circle" },
    { text: "Friends", icon: "team" }
  ];
}

const mapStateToProps = state => {
  const { user, isAuthenticated, error } = state.auth;
  //const { error, text } = state.errors;
  return { user, isAuthenticated, error };
};

export default connect(
  mapStateToProps,
  null
)(PlayerInfo);
