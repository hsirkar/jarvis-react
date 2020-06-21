import React from 'react';
import { Typography } from '@material-ui/core';

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
    },
    leftchat: {
        backgroundColor: '#EEEEEE',
        color: 'black',
        float: 'left'
    },
    rightchat: {
        color: 'white',
        float: 'right'
    },
    chatHistory: {
        overflow: 'auto'
    },
    wrapper: {
        marginTop: 10,
        marginBottom: 10,
        overflow: 'auto',
        position: 'relative',
    }
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
        const { messages, onClick, status } = this.props;
        return(
            <>
                <div style={styles.chatHistory}>
                    {messages.map(m =>
                        <div style={styles.wrapper}>
                            <div
                                onClick={() => onClick(m)}
                                style={{ ...styles.chatbubble, ...(m.sender === 'User' ? styles.rightchat : styles.leftchat) }}>
                                {m.text}
                            </div>
                        </div>
                    )}
                    <div ref={this.messagesEndRef} />
                    <Typography variant="caption" >{status}</Typography>
                </div>
            </>
        );
    }
}

export default ChatFeed;