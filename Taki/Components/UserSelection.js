import React from 'react';
import ReactDOM from 'react-dom';
import SelectionUIGenerator  from './SelectionUIGenerator';


export default class UserSelection extends React.Component {  
    render() {
        return (
            <div className="user-selection">
                <SelectionUIGenerator />
            </div>
        );
    }
}