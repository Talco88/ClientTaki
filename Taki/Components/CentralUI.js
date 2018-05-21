import React from 'react';
import ReactDOM from 'react-dom';
import BoardStatistics from './BoardStatistics';
import CentralUIBoard from './CentralUIBoard';
import UserSelection from './UserSelection';


export default class CentralUI extends React.Component {
    render() {
        return (
            <div className="section central-ui">
                <BoardStatistics />
                <CentralUIBoard/>
                <UserSelection />
            </div>
        );
    }
}