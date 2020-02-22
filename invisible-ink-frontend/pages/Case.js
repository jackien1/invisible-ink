import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatBox from '../components/ChatBox';

class Case extends Component {
    state = {
        text: ''
    };
    handleSubmit = () => {};

    render() {
        return (
            <div style={{ width: '100%', height: '100%', backgroundColor: 'yellow' }}>
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

export default connect(null, null)(Case);
