import React, { Component } from "react";
import { connect } from "react-redux";
import ChatBox from "../components/ChatBox";
import axios from "axios";
import { Tabs, TabPane, Button, Select, Input, Modal } from "antd";

class Inks extends Component {
  static async getInitialProps({ store }) {
    const inks = [
      {
        0: "ink 1",
        messsage: messageSample
      },
      {
        0: "ink 2",
        message: messageSample
      }
    ];

    const schools = ["Sage", "Uni", "etc..."];
    return { schools, inks };
  }
  state = {
    text: "",
    highlighted: "-1",
    inks: [],
    school: "",
    schoolInput: "",
    schools: [],
    visible: false
  };

  async componentDidMount() {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );

    if (!this.props.user.administrator) {
      const { data } = await axios({
        method: "post",
        url: `${process.env.SERVER_URL}/api/ink/myInks`,
        data: { code: this.props.user.code }
      });

      this.setState({ inks: data });
    } else {
      const { data } = await axios({
        method: "get",
        url: `${process.env.SERVER_URL}/api/ink/getSchools`
      });

      this.setState({ schools: data });
      console.log(data);
    }
  }

  handleSubmit = () => {
    console.log("handling submit");
  };

  addSchool = async () => {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );

    await axios({
      method: "post",
      url: `${process.env.SERVER_URL}/api/ink/createSchool`,
      data: { name: this.state.schoolInput }
    });
  };

  renderInk() {
    return (
      <div style={{ width: "70vw", height: "100%" }}>
        <h2> What's Wrong?</h2>
        <ChatBox
          messages={messageSample}
          address={123}
          handleSubmit={this.handleSubmit}
          changeInput={event => this.setState({ text: event.target.value })}
        />
      </div>
    );
  }

  renderSchool() {
    const { Option } = Select;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <Select
          style={{ width: "300px" }}
          placeholder="Select a School"
          onChange={val => this.setState({ school: val })}
        >
          {this.props.schools.map(school => (
            <Option value={school}> {school}</Option>
          ))}
        </Select>
        <Input
          style={{ width: "200px" }}
          onChange={event => this.setState({ schoolInput: event.target.value })}
        ></Input>
        <Button type="primary" onClick={this.addSchool}>
          Add School
        </Button>
      </div>
    );
  }

  render() {
    const { TabPane } = Tabs;
    return (
      <div style={{ width: "90vw", margin: "5vw" }}>
        <h1 style={{ textAlign: "center" }}> Inks </h1>
        {this.props.user && this.props.user.administrator
          ? this.renderSchool()
          : null}
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Tabs
            tabPosition="left"
            onChange={key => this.setState({ highlighted: key })}
            activeKey={this.state.highlighted}
          >
            {this.props.inks
              ? this.props.inks.map((object, index) => (
                  <TabPane
                    key={index}
                    tab={
                      <div
                        style={{
                          width: "15vw",
                          padding: "0.5vw",
                          overflowWrap: "normal",
                          whiteSpace: "normal"
                        }}
                      >
                        <div
                          style={{
                            fontSize: "150%"
                          }}
                        >
                          {object[0]}
                        </div>
                      </div>
                    }
                  >
                    {this.renderInk(index)}
                    {console.log(object)}
                  </TabPane>
                ))
              : null}
            <TabPane
              key={-1}
              disabled
              tab={
                this.props.user.administrator ? null : (
                  <div
                    style={{
                      width: "15vw",
                      padding: "0.5vw",
                      overflowWrap: "normal",
                      whiteSpace: "normal"
                    }}
                  >
                    <Button
                      style={{ margin: "5%", width: "90%" }}
                      type="primary"
                      onClick={() => {
                        this.setState({ visible: true });
                      }}
                    >
                      Create New Ink
                    </Button>
                  </div>
                )
              }
            >
              <h1
                style={{
                  textAlign: "center",
                  width: "100%",
                  marginTop: "1.5vw"
                }}
              >
                Select an Ink
              </h1>
            </TabPane>
          </Tabs>
        </div>

        <Modal
          title="Create Ink"
          visible={this.state.visible}
          onOk={() => {}}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <Input
            style={{ width: "200px" }}
            onChange={event =>
              this.setState({ schoolInput: event.target.value })
            }
          >
            {" "}
          </Input>{" "}
          <Input
            style={{ width: "200px" }}
            onChange={event =>
              this.setState({ schoolInput: event.target.value })
            }
          ></Input>{" "}
          <Input
            style={{ width: "200px" }}
            onChange={event =>
              this.setState({ schoolInput: event.target.value })
            }
          ></Input>
        </Modal>
      </div>
    );
  }
}

const messageSample = [
  {
    0: "123",
    1: "message text"
  },
  {
    0: "456",
    1: "message text 2"
  }
];

const mapStateToProps = state => {
  const { user, isAuthenticated, error } = state.auth;
  return { user, isAuthenticated, error };
};

export default connect(
  mapStateToProps,
  null
)(Inks);
