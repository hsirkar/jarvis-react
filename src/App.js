import React from 'react';
import { Paper, TextField, IconButton } from '@material-ui/core';
import openSocket from 'socket.io-client';
import ChatFeed from './ChatFeed';
import { Send, Mic, Stop } from '@material-ui/icons';
import AwesomeTable from './AwesomeTable';
import Terminal from './Terminal';

const socket = openSocket('http://localhost:3000');
const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

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
        maxHeight: '100%',
        justifyContent: 'flex-end',
        overflow: 'hidden'
    },
    right: {
        background: '#2C292D'
    },
    top: {
        flex: 1,
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden'
    },
    bottom: {
        flex: 0,
        padding: 15,
        display: 'flex',
        paddingTop: 0
    },
    form: {
        display: 'flex',
        flex: 1,
        marginBottom: -15
    },
};


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            systemMessages: [],
            inputValue: '',
            status: '',
            details: {},
            logMessages: [],
            recognizing: false
        };
    }
    componentDidMount() {
        socket.on('connect', () => this.setState({ status: 'Ready' }));
        socket.on('disconnect', () => this.setState({ status: 'Disconnected' }));
        socket.on('received', () => this.setState({ status: 'Seen' }));
        socket.on('message', message => {
            const obj = { sender: 'Jarvis', time: new Date(), ...message };
            const newState = { messages: this.state.messages.concat(obj), details: obj }

            if(obj.type === 'response' || obj.type === 'question') {
                newState.status = 'Ready';
            }

            this.setState(newState);
        });
        socket.on('log', message => {
            this.setState({ logMessages: this.state.logMessages.concat(message) });
        });
        recognition.onstart = () => {
            this.setState({ recognizing: true });
        }
        recognition.onend = () => {
            this.setState({ recognizing: false });
            this.handleSubmit();
        }
        recognition.onresult = event => {
            let interimTranscript = '';
            let isFinal = false;

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const res = event.results[i];

                if (res.isFinal) {
                    this.setState({ inputValue: res[0].transcript });
                    isFinal = true;
                    recognition.stop();
                } else {
                    interimTranscript += res[0].transcript;
                }
            }

            if (!isFinal)
                this.setState({ inputValue: interimTranscript });
        }
    }
    handleSubmit = e => {
        const { messages, inputValue } = this.state;

        const obj = { text: inputValue, sender: 'User', time: new Date() };
        this.setState({ status: 'Sending...', inputValue: '', messages: messages.concat(obj) });
        
        socket.emit('message', inputValue);

        e && e.preventDefault();
    }
    handleToggleRecognition = () => {
        const { recognizing } = this.state;

        if(recognizing)
            recognition.stop();
        else
            recognition.start();
    }
    render() {
        const { messages, inputValue, status, recognizing } = this.state;
        return (
            <div style={styles.main}>
                <Paper style={styles.left}>
                    <div style={styles.top}>
                        <ChatFeed
                            messages={messages}
                            onClick={message => this.setState({ details: message })}
                            status={status}
                            typing={status === 'Seen'} />
                    </div>
                    <div style={styles.bottom}>
                        <form onSubmit={this.handleSubmit} style={styles.form}>
                            <TextField
                                fullWidth
                                value={inputValue}
                                onChange={event => this.setState({ inputValue: event.target.value })} />
                            <IconButton
                                onClick={this.handleToggleRecognition}
                                style={{ marginLeft: 10 }}
                                color="primary"
                                variant="contained">{recognizing ? <Stop /> : <Mic />}</IconButton>
                            <IconButton
                                type="submit"
                                style={{ marginLeft: 10 }}
                                color="primary"
                                variant="contained"><Send /></IconButton>
                        </form>
                    </div>
                </Paper>
                <Paper style={{ ...styles.left, ...styles.right }}>
                    <div style={styles.top}>
                        {/* <AwesomeTable data={this.state.details} showTypes></AwesomeTable> */}
                        <Terminal messages={this.state.logMessages}></Terminal>
                    </div>
                </Paper>
            </div>
        );
    }
}

const App2 = () => <AwesomeTable data={JSON.parse(`{
	"items":
		{
			"item":
				[
					{
						"id": "0001",
						"type": "donut",
						"name": "Cake",
						"ppu": 0.55,
						"batters":
							{
								"batter":
									[
										{ "id": "1001", "type": "Regular" },
										{ "id": "1002", "type": "Chocolate" },
										{ "id": "1003", "type": "Blueberry" },
										{ "id": "1004", "type": "Devil's Food" }
									]
							},
						"topping":
							[
								{ "id": "5001", "type": "None" },
								{ "id": "5002", "type": "Glazed" },
								{ "id": "5005", "type": "Sugar" },
								{ "id": "5007", "type": "Powdered Sugar" },
								{ "id": "5006", "type": "Chocolate with Sprinkles" },
								{ "id": "5003", "type": "Chocolate" },
								{ "id": "5004", "type": "Maple" }
							]
					}
				]
		}
}
`)} showTypes />


export default App;