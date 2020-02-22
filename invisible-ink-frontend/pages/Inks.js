import React, { Component } from "react";
import { connect } from "react-redux";
import ChatBox from "../components/ChatBox";
import axios from "axios";
import { Tabs, Radio, Button, Select, Input, Modal } from "antd";

class Inks extends Component {
  static async getInitialProps({ store }) {
    const inks = [
      {
        0: "ink 1",
        1: "description",
        address: "0x456",

        messages: messageSample
      },
      {
        0: "ink 2",
        1: "description",
        address: "0x456",
        messages: messageSample
      }
    ];
    const schools = [
      {
        0: "New School",
        1: "0x456",
        address: "something else",
        email: "student@gmail.com"
      },
      {
        0: "Uni",
        1: "0x123",
        address: "something else",
        email: "student@gmail.com"
      }
    ];

    return { inks, schools };
  }

  state = {
    text: "",
    highlighted: "-1",
    inks: [],
    school: "",
    schoolInput: "",
    schools: [],
    visible: false,
    title: "",
    description: "",
    allInks: []
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

      this.setState({ inks: data.inks });
    } else {
      const { data } = await axios({
        method: "get",
        url: `${process.env.SERVER_URL}/api/ink/getSchools`
      });

      const res = await axios({
        method: "get",
        url: `${process.env.SERVER_URL}/api/ink/allInks`
      });

      this.setState({ schools: data.schools, allInks: res.data.inks });
    }
  }

  renderInk() {
    return (
      <div style={{ width: "70vw", height: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            marginTop: "2vh"
          }}
        >
          <h2> What's Wrong?</h2>
          <Radio.Group defaultValue="a">
            <Radio.Button value="a">Harassment</Radio.Button>
            <Radio.Button value="b">Physical Bullying</Radio.Button>
            <Radio.Button value="c">Cyberbulling</Radio.Button>
            <Radio.Button value="d">Other</Radio.Button>
          </Radio.Group>
        </div>
        <ChatBox
          messages={messageSample}
          address={123}
          handleSubmit={this.handleSubmit}
          changeInput={event => this.setState({ text: event.target.value })}
        />
      </div>
    );
  }

  handleSubmit = async () => {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );

    await axios({
      method: "post",
      url: `${process.env.SERVER_URL}/api/ink/sendMessage`,
      data: {
        text: this.state.text,
        ink: this.state.inks[this.state.highlighted].address
      }
    });
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
          {this.state.schools.map(school => (
            <Option value={school[1]} style={{ width: "290px" }}>
              {" "}
              {school[0]}
            </Option>
          ))}
        </Select>
        <Input
          style={{ width: "200px" }}
          onChange={event => this.setState({ schoolInput: event.target.value })}
        ></Input>
        <Button
          type="primary"
          onClick={() => console.log("adding school here")}
        >
          Add School
        </Button>
      </div>
    );
  }

  render() {
    const { TabPane } = Tabs;
    return (
      <div style={{ width: "90vw", margin: "3vw" }}>
        <h1 style={{ textAlign: "center" }}> My Inks </h1>
        {this.props.user && this.props.user.administrator
          ? this.renderSchool()
          : null}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            marginTop: "3vw"
          }}
        >
          <Tabs
            tabPosition="left"
            onChange={key => this.setState({ highlighted: key })}
            activeKey={this.state.highlighted}
          >
            {this.state.inks
              ? this.state.inks
                  .filter(
                    object =>
                      //   !this.props.user.administrator ||
                      //   this.state.school == object.address
                      true
                  )
                  .map((object, index) => (
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
              <h2
                style={{
                  textAlign: "center",
                  width: "60vw",
                  marginTop: "3vw"
                }}
              >
                No Ink Selected
              </h2>
              <h4
                style={{
                  textAlign: "center",
                  width: "60vw",
                  marginTop: "1vw"
                }}
              >
                Select an ink in the panel on the right
              </h4>
            </TabPane>
          </Tabs>
        </div>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={async () => {
            axios.defaults.headers.common[
              "Authorization"
            ] = localStorage.getItem("jwtToken");

            await axios({
              method: "post",
              url: `${process.env.SERVER_URL}/api/ink/createInk`,
              data: {
                title: this.state.title,
                description: this.state.description,
                code: this.props.user.code
              }
            });
          }}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <Input
            style={{ width: "200px" }}
            placeholder="title"
            onChange={event => this.setState({ title: event.target.value })}
          ></Input>
          <Input
            placeholder="description"
            style={{ width: "200px" }}
            onChange={event =>
              this.setState({ description: event.target.value })
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
