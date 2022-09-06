import './Chat.css';
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import Conversation from "./components/Conversation";
import Connect from "./components/Connect";
import ChatFrame from "./components/ChatFrame";
import {SocketContext} from "./contexts/socket";

function Chat() {
    const socket = useContext(SocketContext);
    const room = "room" + localStorage.getItem('user_id');

    const [user_name, setUser_name] = useState(localStorage.getItem('user_name'));
    const [conversations_html, setConversations_html] = useState([]);
    const [connect, setConnect] = useState([]);
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
        setConversation([]);
        setConversations_html([]);
        setConnect([]);

        const getData = () => {
            axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/chat/conversation/' + localStorage.getItem('active'),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                data: {
                    user_id: localStorage.getItem('user_id'),
                },
            }).then((res) => {
                // console.log(res.data);
                //connect
                if (res.data.connects !== undefined) {
                    const connects = res.data.connects;
                    for (let i = 0; i < connects.length; i++) {
                        const requester_name = connects[i].user.name;
                        const requester_id = connects[i].user.id;
                        const receiver_id = connects[i].receiver_id;
                        const receiver_name = connects[i].receiver.name;

                        setConnect(connect => [...connect, <Connect requester_name={requester_name} receiver_id={receiver_id}
                                                                    requester_id={requester_id} receiver_name={receiver_name} socket={socket}/>])
                    }
                }
                //conversations
                if (res.data.conversations !== undefined) {
                    const conversations = res.data.conversations;
                    localStorage.setItem('conversations_length', conversations.length);
                    for (let i = 0; i < conversations.length; i++) {
                        let last_message = conversations[i].message.length !== 0 ?
                            conversations[i].message[conversations[i].message.length - 1].message : 'New';
                        let url = "/chat/conversation/" + i;
                        setConversations_html(conversations_html => [...conversations_html,
                            <Conversation conversation_id={conversations[i].id} name={conversations[i].name} message={last_message} active={i} url={url} socket={socket}/>]);
                    }
                    //conversation_content
                    const active = localStorage.getItem('active');
                    const opposite_name = res.data.opposite.name;
                    const messages = res.data.conversations[active].message;
                    const conversation_id = res.data.conversations[active].id;
                    const msg_id = messages.length;
                    const opposite_id = res.data.opposite.id;
                    setConversation([<ChatFrame opposite_name={opposite_name} opposite_id={opposite_id} messages={messages} conversation_id={conversation_id} msg_id={msg_id} socket={socket}/>]);
                }

            });
        }
        socket.on(room + 'get_connect', (data) => {
            setConnect(connect => [...connect, <Connect requester_name={data.requester_name} receiver_id={data.receiver_id}
                                                        requester_id={data.requester_id} receiver_name={data.receiver_name} socket={socket}/>])
        });
        socket.on(room + 'new_conversation', (data) => {
            const active = localStorage.getItem('conversations_length');
            setConversations_html(conversations_html => [...conversations_html,
                <Conversation conversation_id={data.conversation_id} name={data.name} message="New" active={active} url={"/chat/conversation/" + active} socket={socket}/>]);
            localStorage.setItem('conversations_length', (parseInt(active) + 1).toString());
        })

        getData();
        // console.log(localStorage);
        if (localStorage.getItem('login') !== 'true') {
            window.location = "/login";
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        window.location = "/login";
    }
    const changeName = () => {
        localStorage.setItem('user_name', user_name);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/change-name',
            data: {
                name: user_name,
                user_id: localStorage.getItem('user_id'),
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }

    return (
        <div className="container-fluid">
            <div id="header" className="row">
                <div id="welcome_message" className="col-md-5">
                    <form onSubmit={changeName} className="form-inline">
                        <label>Hi, </label>
                        <input type="text" className="form-control" name="name"  value={user_name}
                               onChange={(e) => {
                                   setUser_name(e.target.value)
                               }} required />
                            <button type="submit" className="btn btn-primary mb-2">Change</button>
                    </form>
                </div>
                <div className="col-md-7">
                    <button onClick={logout} className="right_item btn btn-primary mb-2"
                       style={{margin: "20px"}}>Logout</button>
                </div>
            </div>
            <div id="chat_frame" className="row">
                <div id="conversation_list" className="col-md-3">
                    <div id="new_connect">
                        <a href="/connect" className="right_item"><i className="fa fa-2x fa-plus-circle" aria-hidden="true"/></a>
                    </div>
                    {connect.map((item, index) => {
                        return (
                            <div key={index}>{item}</div>
                        )
                    })}
                    <ul className="contacts">
                        {conversations_html.map((item, i) => {
                            if (i === parseInt(localStorage.getItem('active'))) {
                                return(
                                    <li key={i} className="active">{item}</li>
                                );
                            }
                            return(
                                <li key={i}>{item}</li>
                            );
                        })}
                    </ul>
                </div>
                <div id="conversation" className="col-md-9">
                    {conversation.map((item, i) => {
                        return(
                            <div key={i}>{item}</div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Chat;




