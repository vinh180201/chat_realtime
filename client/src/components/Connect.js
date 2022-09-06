import React from 'react';
import axios from "axios";

const Connect = (props) => {
    const socket = props.socket;
    const room = "room" + localStorage.getItem('user_id');

    const acceptConnect = (event) => {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/accept-connect',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            data: {
                requester_name: props.requester_name,
                receiver_name: props.receiver_name,
                receiver_id: props.receiver_id,
                requester_id: props.requester_id,
            },
        }).then((res) => {
            var conversation = res.data.conversation;
            socket.emit(room + 'accept_connect', {
                requester_id: props.requester_id,
                conversation_id: conversation.id,
                name: conversation.name,
            });
            window.location = "/chat/conversation/" + localStorage.getItem('active');
        });
    }
    const cancelConnect = (event) => {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/cancel-connect',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            data: {
                receiver_id: props.receiver_id,
                requester_id: props.requester_id,
            },
        }).then((res) => {
            // console.log(res.status);
            window.location = "/chat/conversation/" + localStorage.getItem('active');
        });
    }

    return (
        <div className="alert" style={{backgroundColor: "rgb(247 194 200)", textAlign: "center"}}>
            <form onSubmit={acceptConnect} style={{padding: "0px"}} className="form-group">
                <label>{props.requester_name} wants to connect with you</label>
                <br/>
                <button form="cancel" className="btn btn-primary left_item">No</button>
                <button type="submit" className="btn btn-primary right_item">Yes</button>
            </form>
            <form id="cancel" onSubmit={cancelConnect}></form>
        </div>
    );
}

export default Connect;

// var connects = document.getElementsByClassName('connect');
//
// for (let i = 0; i < connects.length; i++) {
//     var id = connects[i].getAttribute('id');
//     var connect_id = connects[i].getAttribute('connect_id');
//     var requester_name = connects[i].getAttribute('requester_name');
//     ReactDOM.render(<Connect connect_id={connect_id} requester_name={requester_name}/>, document.getElementById(id));
// }
