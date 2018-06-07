import React, { Component } from 'react';
import {Platform}  from './../JS/Platform.js';


export default class Popup extends Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
    }

    onCloseWindowClick(){
        this.platform.closePopupwindow();
    }

    render(){
        if (this.props.Show){
            return(
                <div className="popup">
                    <div className="popup-content">
                        <span className="close-button" onClick={this.onCloseWindowClick.bind(this)}>&times;</span>
                        <div className="popup-text">
                            {this.platform.getPopupMessage()}
                        </div>
                    </div>
                </div>
            );
        }
        else{
            return (null);
        }
    }
}