import React from 'react';
import { Paper, TextField, IconButton } from '@material-ui/core';
import openSocket from 'socket.io-client';
import ChatFeed from './ChatFeed';
import { Send } from '@material-ui/icons';
import AwesomeTable from './AwesomeTable';

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
        maxHeight: '100%',
        overflow: 'auto'
    },
    top: {
        flex: 1,
        padding: 15,
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden'
    },
    
    bottom: {
        flex: 0,
        padding: 15,
        display: 'flex'
    },
    form: {
        display: 'flex',
        flex: 1,
        marginBottom: -15
    },
};

const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633'
  };

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            systemMessages: [],
            inputValue: '',
            status: '',
            details: {}
        };
        socket.on('connect', () => this.setState({ status: 'connected' }));
        socket.on('disconnect', () => this.setState({ status: 'not connected' }));
        socket.on('received', () => this.setState({ status: 'thinking' }));
        socket.on('message', message => {
            const obj = { sender: 'Jarvis', time: new Date(), ...message };
            this.setState({ status: 'connected', messages: this.state.messages.concat(obj), details: obj });
            console.log(JSON.stringify(obj));
        });
    }
    handleSubmit = e => {
        const { messages, inputValue } = this.state;

        const obj = { text: inputValue, sender: 'User', time: new Date() };
        this.setState({ status: 'sending', inputValue: '', messages: messages.concat(obj) });
        
        socket.emit('message', inputValue);

        e.preventDefault();
    }
    componentDidUpdate(prevProps, prevState) {
        console.log(prevState);
    }
    render() {
        const { messages, inputValue } = this.state;
        const { handleSubmit } = this;
        return (
            <div style={styles.main}>
                <Paper style={styles.left}>
                    <div style={styles.top}>
                        <ChatFeed
                            messages={messages}
                            onClick={message => this.setState({ detail: message })} />
                    </div>
                    <div style={styles.bottom}>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <TextField
                                fullWidth
                                value={inputValue}
                                onChange={event => this.setState({ inputValue: event.target.value })} />
                            <IconButton
                                type='submit'
                                style={{ marginLeft: 10 }}
                                color="primary"
                                variant="contained"><Send /></IconButton>
                        </form>
                    </div>
                </Paper>
                <Paper style={styles.left}>
                    <div>
                        <AwesomeTable data={this.state.details} showTypes></AwesomeTable>
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