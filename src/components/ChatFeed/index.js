import React from 'react';
import { AutoSizer, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { FiThumbsUp } from 'react-icons/fi';
import { FaExternalLinkAlt, } from 'react-icons/fa';
import Gallery from 'react-grid-gallery';

// Convert "\n" to line breaks
const br = text => text && text.split('\n').map((item, i) => <span key={i}>{i===0 || <br/>}{item}</span>);

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
        } else if (prevMessages !== messages) {
            this.cache.clear(messages.length - 1, 0);
            this.list.current.scrollToRow(this.props.messages.length);
            setTimeout(() => this.list.current && this.list.current.scrollToRow(this.props.messages.length), 100);
            setTimeout(() => this.list.current && this.list.current.scrollToRow(this.props.messages.length), 600);
        }
    }
    renderRow = ({ index, key, style, parent }) => {
        let { messages, onClick } = this.props;
        const m = messages[index];

        if(m.source && !m.subtitle)
            m.subtitle = 'via ' + m.source;

        let isList = !!(m.list && Array.isArray(m.list) && m.list.length);

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
                                    {/* Render image */}
                                    {m.image &&
                                        <div className="image-container">
                                        <Gallery
                                            rowHeight={128}
                                            enableImageSelection={false}
                                            images={[{
                                                src: m.image,
                                                thumbnail: m.image,
                                                thumbnailHeight: 100 }]} />
                                            </div>
                                    }
                                    
                                    {/* Render video */}
                                    {m.video && <video type="video/mp4" src={m.video} autoPlay={false} preload="false" controls={true} />}

                                    {/* Render list title / display text / main text */}
                                    {m.listTitle ?
                                        <div className="list-title">{m.listTitle}</div> :
                                        (m.displayText ? br(m.displayText.toString()) : m.text ? br(m.text.toString()) : <FiThumbsUp size="1.3em" />)}

                                    {/* Render list */}
                                    {isList &&
                                        (m.isGallery ?
                                                <div className="gallery-wrapper">
                                                <Gallery
                                                    rowHeight={180}
                                                    enableImageSelection={false}
                                                    images={m.list.map(item => ({
                                                        src: item.image,
                                                        thumbnail: item.image,
                                                        thumbnailHeight: 180,
                                                        caption: item.displayText || item.text
                                                     }))}
                                                    />
                                                </div>
                                            :
                                            <div>
                                                {m.list.map((el, i) =>
                                                    <div key={i} className="list-element">
                                                        {el.image && <img className="image" onLoad={measure} alt="" src={el.image} width={128} />}
                                                        {el.displayText && br(el.displayText.toString())}
                                                        <div className="subtitle">{br(el.subtitle)}</div>
                                                        <div className="subtitle small">
                                                            {br(el.subtitle2)}
                                                            {el.url && <a target="_blank" rel="noopener noreferrer" href={el.url}><FaExternalLinkAlt /></a>}
                                                        </div>
                                                    </div>)}
                                            </div>
                                        )}

                                    {/* Render subtitle, subtitle2, and link */}
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
        const { messages } = props;
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