import React, { Component } from 'react';
import { Input, Button } from 'react';

class ChatBox extends Component {
    render() {
        return (
            <div style={{ width: '100%' }}>
                <div
                    style={{
                        width: '100%',
                        borderRadius: '20px',
                        height: '50vh',
                        overflowX: 'scroll'
                    }}
                    ref={div => {
                        this.messageList = div;
                    }}
                >
                    {/* {this.props.messages.map(message => {
                        return (
                            <div
                                style={{
                                    margin: '20px',
                                    textAlign:
                                        message[0].toLowerCase() == this.props.address
                                            ? 'right'
                                            : 'left'
                                }}
                            >
                                <div style={{ fontSize: '100%' }}> {message.name} </div>
                                <div
                                    style={{
                                        backgroundColor:
                                            message[0].toLowerCase() == this.props.address
                                                ? '#10004e'
                                                : '#EEEEEE',
                                        color:
                                            message[0].toLowerCase() == this.props.address
                                                ? '#FFFFFF'
                                                : '#212121',
                                        padding: '10px',
                                        borderRadius: '1vw',
                                        flexWrap: 'wrap',
                                        display: 'inline-block',
                                        maxWidth: '80vw'
                                    }}
                                >
                                    {message[1]}
                                </div>
                            </div>
                        );
                    })} */}
                </div>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}
                >
                    <Input
                        placeholder="Enter Message"
                        onChange={event => this.changeInput(event)}
                    />
                    <Button onClick={this.props.handleSubmit}>Submit</Button>
                </div>
            </div>
        );
    }
}

export default ChatBox;
