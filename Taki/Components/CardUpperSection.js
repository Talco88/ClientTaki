import React from 'react';
import ReactDOM from 'react-dom';

export default class CardUpperSection extends React.Component {
    render() {
        return (
            <div id='playersHandCard' className='card-small-option card-upper-option' >
                {this.props.option}
            </div>
        );
    }
}

