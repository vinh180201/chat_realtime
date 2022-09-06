import React, {useContext, useEffect, useState} from 'react';
import '../Chat.css';
import io from "socket.io-client";
import {SocketContext} from "../contexts/socket";

// const ip_address = '127.0.0.1';
// const socket_port = '3001';
// const socket = io(ip_address + ':' + socket_port);

const Conversation = (props) => {
    // const socket = useContext(SocketContext);
    const socket = props.socket;

    const [newestMessage, setNewestMessage] = useState(props.message);
    const room = "room" + localStorage.getItem('user_id');

    const changeConversation = () => {
        localStorage.setItem('active', props.active);
    }
    useEffect(() => {
        socket.on(room + "change_conversation_msg", (data) => {
            if (data.conversation_id === props.conversation_id) {
                setNewestMessage(data.message);
            }
        });
    }, []);
    return (
        <div id="conversation_list">
            <div className="conversation">
                <div className="d-flex bd-highlight">
                    <a onClick={changeConversation} href={props.url} style={{textDecoration: "none", width: "100%"}}>
                        <div className="user_info">
                            <span>{props.name}</span>
                            <p>{newestMessage}</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Conversation;



