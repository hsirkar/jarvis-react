import React from 'react';
import { AutoSizer, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { FiThumbsUp, FiInfo } from 'react-icons/fi';
import { FaExternalLinkAlt, } from 'react-icons/fa';

// Convert "\n" to line breaks
const br = text => text && text.split('\n').map((item, i) => <span key={item}>{i===0 || <br/>}{item}</span>);

class ChatFeed extends React.Component {
    constructor(props) {
        super(props);
        this.list = React.createRef();
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 75,
        });
    }
    componentDidUpdate(prevProps) {
        const { messages: prevMessages } = prevProps;
        const { messages } = this.props;

        if (messages.length !== prevMessages.length) {
            this.list.current.scrollToRow(this.props.messages.length);
        } else if (prevMessages.length && messages[messages.length - 1] !== prevMessages[prevMessages.length - 1]) {
            this.cache.clear(messages.length - 1, 0);
            this.list.current.scrollToRow(this.props.messages.length);
            setTimeout(() => this.list.current.scrollToRow(this.props.messages.length), 100);
            setTimeout(() => this.list.current.scrollToRow(this.props.messages.length), 600);
        }
    }
    renderRow = ({ index, key, style, parent }) => {
        let { messages, onClick } = this.props;
        const m = messages[index];

        if(m.source && !m.subtitle)
            m.subtitle = 'via ' + m.source;

        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}>
                {({ registerChild, measure }) => (
                    <div ref={registerChild} style={style}>
                        <div
                            onClick={() => onClick(index)}
                            className={`chatbubble ${m.sender.toLowerCase()}`}>
                            {m.type === 'typing' ? <img src={require('./dots.svg')} /> : (
                                <div>
                                    {(m.list && Array.isArray(m.list) && m.list.length) ?
                                        <div>
                                            {m.list.map((el,i) => 
                                            <div key={i} className="list-element">
                                                {el.image && <img className="image" onLoad={measure} alt="" src={el.image} width={128} />}
                                                {el.displayText && br(el.displayText.toString())}
                                                <div className="subtitle">{br(el.subtitle)}</div>
                                                <div className="subtitle small">
                                                    {br(el.subtitle2)}
                                                    {el.url && <a target="_blank" rel="noopener noreferrer" href={el.url}><FaExternalLinkAlt /></a>}
                                                </div>
                                            </div>)}
                                        </div> :
                                        <div>
                                            {m.image && <img className="image" onLoad={measure} alt="" src={m.image} width={128} />}
                                            {m.displayText ? br(m.displayText.toString()) : m.text ? br(m.text.toString()) : <FiThumbsUp size="1.3em" />}
                                        </div>
                                    }
                                    <div className="subtitle">{br(m.subtitle)}</div>
                                    <div className="subtitle small">
                                        {br(m.subtitle2)}
                                        {m.url && <a target="_blank" rel="noopener noreferrer" href={m.url}><FaExternalLinkAlt /></a>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CellMeasurer>
        )
    }
    render() {
        const { props, cache, list, renderRow } = this;
        const { messages, onClick, typing } = props;
        const totalHeight = messages.map((_,i)=>cache.getHeight(i,0)).reduce((t,c)=>t+c, 0);

        return (
            <AutoSizer>
                {({ width, height }) => (
                    <List
                        ref={list}
                        width={width}
                        height={Math.min(totalHeight, height)}
                        rowCount={messages.length}
                        rowHeight={cache.rowHeight}
                        deferredMeasurementCache={cache}
                        rowRenderer={renderRow}
                        style={{ position: 'absolute', bottom: 0 }}>
                    </List>
                )}
            </AutoSizer>
        );
    }
}

export default ChatFeed;