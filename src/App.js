import React from 'react';
import { ThemeProvider, CssBaseline, IconButton } from '@material-ui/core';
import { BsMic, BsStop, BsExclamationCircle } from 'react-icons/bs';
import { FiEye, FiCheck  } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Background from './components/Background';
import ChatFeed from './components/ChatFeed';
import theme from './theme';
import './index.css';
import socketIO from 'socket.io-client';
import wakeword from './wakeword';
import { uncensor } from './util';

const socket = socketIO('http://192.168.1.7:3000');
const recognition = window.webkitSpeechRecognition ? new window.webkitSpeechRecognition() : {};
const beep = new Audio('http://localhost:3006/beep.mp3');

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            inputValue: '',
            status: 'Disconnected',
            details: {},
            logMessages: [],
            recognizing: false
        };
    }
    async componentDidMount() {
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
            this.forceUpdate();
        });
        socket.on('update', update => {
            if(!update.ref) return;

            let messages = [...this.state.messages];
            let index = messages.findIndex(m => m.ref === update.ref);

            if(index === -1) return;

            let message = {...messages[index]};
            Object.assign(message, update);
            messages[index] = message;

            this.setState({ messages });
            this.forceUpdate();
        });
        socket.on('log', message => {
            this.setState({ logMessages: this.state.logMessages.concat(message) });
        });
        recognition.onstart = () => {
            beep.play();
            this.setState({ recognizing: true });
            socket.emit('recognitionStart');
        }
        recognition.onend = () => {
            beep.play();
            this.setState({ recognizing: false });
            this.submit();
            if(wakeword.recognizer && !wakeword.recognizer.isListening())
                wakeword.listen(() => this.state.recognizing || recognition.start());
            socket.emit('recognitionEnd');
        }
        recognition.onresult = event => {
            let interimTranscript = '';
            let isFinal = false;

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const res = event.results[i];

                if (res.isFinal) {
                    this.setState({ inputValue: uncensor(res[0].transcript) });
                    isFinal = true;
                    recognition.stop();
                } else {
                    interimTranscript += res[0].transcript;
                }
            }

            if (!isFinal)
                this.setState({ inputValue: uncensor(interimTranscript) });
        }
        await wakeword.init();
        wakeword.listen(() => this.state.recognizing || recognition.start());
    }
    componentDidUpdate(_, prevState) {
        if(prevState.messages !== this.state.messages) {
            this.forceUpdate();
        }
    }
    submit = event => {
        const { messages, inputValue } = this.state;

        if(inputValue.trim() !== '') {
            const obj = { text: inputValue, sender: 'User', time: new Date() };
            this.setState({ status: 'Sending...', inputValue: '', messages: messages.concat(obj) });
            socket.emit('message', inputValue);
        }

        event && event.preventDefault();
    }
    toggleRecognition = () => {
        const { recognizing } = this.state;

        if(recognizing)
            recognition.stop();
        else
            recognition.start();
    }
    render() {
        const { state, submit, toggleRecognition } = this;
        const { inputValue, status, recognizing } = state;
        return (
            <div className="container">
                <div className="container horizontal">
                    <div className="top">
                        <ChatFeed
                            messages={status === 'Seen' ? state.messages.concat({ type: 'typing', sender: 'Jarvis' }) : state.messages}
                            onClick={()=>{}}
                            typing={status === 'Seen'} />
                    </div>
                    <div className="bottom">
                        <form onSubmit={submit}>
                            <IconButton
                                onClick={toggleRecognition}
                                className={`iconbutton` + (this.state.recognizing ? ' pulse' : '')}
                                color="inherit"
                                variant="contained">{recognizing ? <BsStop /> : <BsMic />}</IconButton>
                            <input
                                placeholder="Say &quot;Jarvis&quot; or type something..."
                                value={inputValue}
                                onChange={event => this.setState({ inputValue: event.target.value })}
                                onKeyDown={event => {
                                    if(event.keyCode === 38) {
                                        if(state.messages.length)
                                            this.setState({
                                                inputValue: state.messages.slice().reverse().find(m=>m.sender==='User').text
                                            });
                                    }
                                }}
                                variant="outlined"
                                disabled={recognizing} />
                        </form>
                    </div>
                    <div className="status">
                        {this.state.status === 'Sending...' && <AiOutlineLoading3Quarters className="spin" />}
                        {this.state.status === 'Ready' && <FiCheck />}
                        {this.state.status === 'Disconnected' && <BsExclamationCircle />}
                        {this.state.status === 'Seen' && <FiEye />}
                        {this.state.status}
                    </div>
                </div>
            </div>
        );
    }
}

export default () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Background /> */}
        <App />
    </ThemeProvider>
);