import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatBox from '../components/ChatBox';
import { Tabs, TabPane, Button, Select, Input } from 'antd';

class Inks extends Component {
    static async getInitialProps({ store }) {
        const inks = [
            {
                0: 'ink 1',
                messsage: messageSample
            },
            {
                0: 'ink 2',
                message: messageSample
            }
        ];
        const schools = ['Sage', 'Uni', 'etc...'];

        return { inks, schools };
    }

    state = {
        text: '',
        highlighted: '-1',
        school: '',
        schoolInput: ''
    };

    handleSubmit = () => {
        console.log('handling submit');
    };

    renderInk() {
        return (
            <div style={{ width: '70vw', height: '100%' }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Select
                    style={{ width: '300px' }}
                    placeholder="Select a School"
                    onChange={val => this.setState({ school: val })}
                >
                    {this.props.schools.map(school => (
                        <Option value={school}> {school}</Option>
                    ))}
                </Select>
                <Input
                    style={{ width: '200px' }}
                    onChange={event => this.setState({ schoolInput: event.target.value })}
                ></Input>
                <Button type="primary" onClick={() => console.log('adding school here')}>
                    Add School
                </Button>
            </div>
        );
    }

    render() {
        const { TabPane } = Tabs;
        return (
            <div style={{ width: '90vw', margin: '5vw' }}>
                <h1 style={{ textAlign: 'center' }}> Inks </h1>
                {this.props.user && this.props.user.administrator ? this.renderSchool() : null}
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
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
                                                  width: '15vw',
                                                  padding: '0.5vw',
                                                  overflowWrap: 'normal',
                                                  whiteSpace: 'normal'
                                              }}
                                          >
                                              <div
                                                  style={{
                                                      fontSize: '150%'
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
                                <div
                                    style={{
                                        width: '15vw',
                                        padding: '0.5vw',
                                        overflowWrap: 'normal',
                                        whiteSpace: 'normal'
                                    }}
                                >
                                    <Button style={{ margin: '5%', width: '90%' }} type="primary">
                                        Create New Ink
                                    </Button>
                                </div>
                            }
                        >
                            <h1
                                style={{
                                    textAlign: 'center',
                                    width: '100%',
                                    marginTop: '1.5vw'
                                }}
                            >
                                Select an Ink
                            </h1>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

const messageSample = [
    {
        0: '123',
        1: 'message text'
    },
    {
        0: '456',
        1: 'message text 2'
    }
];

export default connect(null, null)(Inks);
