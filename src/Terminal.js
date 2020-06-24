import React from 'react';
import { Anchorme } from 'react-anchorme';
import './terminal.css';

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
        color: '#ddd',
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
        return(
            <>
                <div style={styles.chatHistory}>
                    {messages.map(m =>
                        <div style={styles.wrapper} key={m}>
                            {/* <Anchorme> */}
                                {m.replace(/ /g, '\u00A0').split('\n').map(line => <div key={line}><Anchorme>{line}</Anchorme></div>)}
                            {/* </Anchorme> */}
                            {/* <div
                                style={{ ...styles.chatbubble }}
                                dangerouslySetInnerHTML={{ __html: m.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;') }}>

                                {/* {m.split('\n').map(l => <span>{l}<br/></span>)}
                            </div> */}
                        </div>
                    )}
                    <div ref={this.terminalEndRef} />
                </div>
            </>
        );
    }
}

export default Terminal;