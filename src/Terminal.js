import React from 'react';
import { Typography } from '@material-ui/core';
import dots from './three-dots.svg';

const styles = {
    chatbubble: {
        lineHeight: '140%'
    },
    chatHistory: {
        overflow: 'auto',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        fontFamily: 'Ubuntu Mono, monospace',
        background: '#2C292D',
        color: '#bbb',
        wordWrap: 'break-word'
    },
    wrapper: {
        overflow: 'auto',
        position: 'relative',
    },
}

class Terminal extends React.Component {
    constructor(props){
        super(props);
        this.terminalEndRef = React.createRef();
    }
    componentDidUpdate() {
        this.terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    render() {
        const { messages } = this.props;
        console.log(messages);
        return(
            <>
                <div style={styles.chatHistory}>
                    {messages.map(m =>
                        <div style={styles.wrapper}>
                            <div
                                style={{ ...styles.chatbubble }}
                                dangerouslySetInnerHTML={{ __html: m.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;') }}>

                                {/* {m.split('\n').map(l => <span>{l}<br/></span>)} */}
                            </div>
                        </div>
                    )}
                    <div ref={this.terminalEndRef} />
                </div>
            </>
        );
    }
}

export default Terminal;