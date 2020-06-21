import React from 'react';
import { Anchorme } from 'react-anchorme';

const isPrimitive = obj => {
    return (obj !== Object(obj) || obj instanceof Date);
}

const toType = obj => {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

const styles = {
    table: {
        borderCollapse: 'collapse',
        width: '100%',
        fontSize: '13px',
        marginButtom: '3px',
        marginTop: '3px',
        fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        tableLayout: 'auto'
    },
    td: {
        border: '1px solid #ddd',
        padding: '8px',
    },
    propType: {
        color: 'gray',
        fontSize: 11,
        fontWeight: 'normal'
    },
    value: {
        fontWeight: 'normal'
    },
    colorPreview: {
        display: 'inline-block',
        width: '1.2em',
        height: '1.2em',
        verticalAlign: '-3px',
        marginRight: '0.4em'
    }
}

class AwesomeTable extends React.Component {
    getTypeDescription(item) {
        return toType(item) + (Array.isArray(item) ? `, ${item.length}` : '')
    }
    getBackgroundColor(rowIndex, indentLevel, columnIndex) {
        let lightness = rowIndex % 2 === 0 ? 92 : 96;
        lightness -= columnIndex === 1 ? 4 : 0;
        return `hsl(${indentLevel * 80}, 20%, ${lightness}%)`;
    }
    renderItem(item) {
        let { level } = this.props;
        level = level || 0;

        let color = item && item.toString().match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

        return (
            isPrimitive(item) ?
                <div style={{ padding: '5px', ...styles.value }}>
                    {item ?
                        <div>
                            {color && color[0] && <span style={{ ...styles.colorPreview, backgroundColor: color[0] }} />}
                            <Anchorme>{item instanceof Date ? item.toLocaleString('en-US') : item.toString()}</Anchorme>
                        </div> :
                        <span style={styles.propType} component="span">(null)</span>}
                </div> :
                <AwesomeTable {...this.props} data={item} level={level + 1} />
        );
    }
    render() {
        let { data, showTypes, level } = this.props;
        try { data = JSON.parse(data); } catch (e) {}
        level = level || 0;

        // Wrap in root object if array
        if(toType(data) === 'array') {
            return <AwesomeTable {...this.props} data={{ root: data }} level={level} />
        }

        return (
            <table style={styles.table}>
                <tbody>
                    {data && Object.keys(data).map((prop, index) =>
                        <tr style={{ backgroundColor: this.getBackgroundColor(index, level, 0) }}>
                            {/* Left column */}
                            <td style={{ ...styles.td, fontWeight: '500', width: '6%', minWidth: '130px', backgroundColor: this.getBackgroundColor(index, level, 1) }}>
                                <span style={styles.prop} component="span">{prop} </span>
                                {showTypes && <span style={styles.propType}>({this.getTypeDescription(data[prop])})</span>}
                            </td>
                            {/* Right column */}
                            <td style={{ ...styles.td, width: 'auto' }}>
                                {Array.isArray(data[prop]) ?
                                    data[prop].length ?
                                        data[prop].map((elem, index) =>
                                            <div style={{ marginTop: index > 0 ? 12 : 0, marginBottom: 7 }}>
                                                <span style={styles.propType}>element {index}{showTypes && ` (${toType(elem)})`}:</span>
                                                {this.renderItem(elem)}
                                            </div>)
                                        : <span style={styles.propType} component="span">(empty array)</span>
                                    : this.renderItem(data[prop])}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}

export default AwesomeTable;