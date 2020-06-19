import React from 'react';
import { MessageList  } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { Paper, Button, TextField, Typography } from '@material-ui/core';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3000');

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        fontFamily: 'Roboto'
    },
    left: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: 1,
    },
    top: {
        flex: 1,
        padding: 15,
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'auto'
    },
    bottom: {
        flex: 0,
        padding: 15,
        display: 'flex',
    },
    form: {
        display: 'flex',
        flex: 1
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            systemMessages: [],
            inputValue: '',
            status: ''
        };
        socket.on('connect', () => this.setState({ status: 'connected' }));
        socket.on('disconnect', () => this.setState({ status: 'not connected' }));
        socket.on('received', () => this.setState({ status: 'thinking' }));
        socket.on('message', message => {
            const obj = { text: message, sender: 'Jarvis', time: new Date() };
            this.setState({ status: 'connected', messages: this.state.messages.concat(obj) });
        });
    }
    handleSubmit = e => {
        const { messages, inputValue } = this.state;

        const obj = { text: inputValue, sender: 'User', time: new Date() };
        this.setState({ status: 'sending', inputValue: '', messages: messages.concat(obj) });
        
        socket.emit('final_transcript', inputValue);

        e.preventDefault();
    }
    render() {
        const { inputValue } = this.state;
        const { handleSubmit } = this;
        return (
            <div style={styles.main}>
                <Paper style={styles.left}>
                    <div style={styles.top}>
                        <MessageList
                            lockable={true}
                            className='chat-list'
                            toBottomHeight={'100%'}
                            dataSource={this.state.messages.map(message => ({
                                avatar: `https://ui-avatars.com/api/?name=${message.sender}`,
                                position: message.sender === 'User' ? 'right' : 'left',
                                alt: message.sender,
                                title: message.sender,
                                subtitle: message.text,
                                text: message.text,
                                date: message.time,
                                unread: 0
                            }))}
                            />
                        {/* {isJarvisThinking && <small>Jarvis is thinking...</small>} */}
                        <Typography variant="caption" >{this.state.status}</Typography>
                    </div>
                    <div style={styles.bottom}>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <TextField
                                fullWidth
                                value={inputValue}
                                onChange={event => this.setState({ inputValue: event.target.value })} />
                            <Button
                                type='submit'
                                style={{ marginLeft: 10 }}
                                color="primary"
                                variant="contained">Send</Button>
                        </form>
                    </div>
                </Paper>
                <Paper style={styles.left}>
                    hello world
                </Paper>
            </div>
        );
    }
}

export default App;