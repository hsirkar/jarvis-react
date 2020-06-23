import React from 'react';
import { Typography } from '@material-ui/core';
import dots from './three-dots.svg';

const styles = {
    chatbubble: {
        cursor: 'pointer',
        backgroundColor: '#0084FF',
        borderRadius: 20,
        marginTop: 1,
        marginRight: 'auto',
        marginBottom: 1,
        marginLeft: 'auto',
        maxWidth: 425,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 14,
        paddingRight: 14,
        width: '-webkit-fit-content',
        lineHeight: '140%'
    },
    leftchat: {
        backgroundColor: '#F1F0F0',
        color: 'black',
        float: 'left'
    },
    rightchat: {
        color: 'white',
        float: 'right',
        background: 'linear-gradient(#47B1FB, #1285FB)',
        backgroundAttachment: 'fixed'
    },
    chatHistory: {
        overflow: 'auto',
        paddingLeft: 15,
        paddingRight: 15
    },
    wrapper: {
        marginTop: 10,
        marginBottom: 10,
        overflow: 'auto',
        position: 'relative',
    },
}

class ChatFeed extends React.Component {
    constructor(props){
        super(props);
        this.messagesEndRef = React.createRef();
    }
    componentDidUpdate() {
        this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    render() {
        const { messages, onClick, status, typing } = this.props;
        return(
            <>
                <div style={styles.chatHistory}>
                    {messages.map(m =>
                        <div style={styles.wrapper}>
                            <div
                                onClick={() => onClick(m)}
                                style={{ ...styles.chatbubble, ...(m.sender === 'User' ? styles.rightchat : styles.leftchat) }}>
                                {m.fullText ? m.fullText.split('\n').map(item => <span>{item}<br/></span>) :
                                m.text ? m.text.split('\n').map(item => <span>{item}<br/></span>) : '👍'}
                                <small style={{ fontSize: '0.7em', marginTop: 0, display: 'block', color: 'gray' }}>{m.subtitle}</small>
                            </div>
                        </div>
                    )}
                    {typing && 
                        <div style={styles.wrapper}>
                            <div style={{ ...styles.chatbubble, ...styles.leftchat }}>
                                <img src={dots} />
                            </div>
                        </div>
                    }
                    <div ref={this.messagesEndRef} />
                </div>
                <Typography variant="caption" style={{ marginRight: 20, textAlign: 'right' }}>{status}</Typography>
            </>
        );
    }
}

export default ChatFeed;