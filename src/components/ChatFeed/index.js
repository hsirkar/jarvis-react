import React from 'react';
import { AutoSizer, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { FiThumbsUp } from 'react-icons/fi';

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
            setTimeout(() => this.list.current.scrollToRow(this.props.messages.length), 500);
        }
    }
    renderRow = ({ index, key, style, parent }) => {
        let { messages, onClick } = this.props;

        const m = messages[index];
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
                                    {m.image &&
                                        <div className="image-div">
                                            <img onLoad={measure} alt="" src={m.image} width={128} />
                                        </div>}
                                    {m.text ? m.text.toString().split('\n').map((item, index) => <span key={index}>{item}<br /></span>) :
                                        m.fullText ? m.fullText.split('\n').map((item, index) => <span key={index}>{item}<br /></span>) : <FiThumbsUp size="1.3em" />}
                                </div>
                            )}
                            <small style={{ fontSize: '0.7em', marginTop: 0, display: 'block' }}>{m.source ? 'via ' + m.source : ''}</small>
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