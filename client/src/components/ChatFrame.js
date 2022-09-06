import React, {useEffect, useState} from 'react';
import axios from "axios";
import Message from "./Message";

const ChatFrame = (props) => {
    const socket = props.socket;

    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState([]);
    const [msg_id, setMsg_id] = useState(parseInt(props.msg_id));
    const room = "room" + localStorage.getItem('user_id');

    let data = {
        sender: parseInt(localStorage.getItem('user_id')),
    };

    useEffect(() => {
        setShowMessage([]);
        const getMessage = () => {
            for (let i = 0; i < props.messages.length; i++) {
                const message = props.messages[i].message;
                const key = props.messages[i].id;
                const sender = props.messages[i].user_id === parseInt(localStorage.getItem('user_id')) ? 'user' : 'opposite';
                let time = new Date(props.messages[i].updated_at);

                const today = new Date();
                if (today.toDateString() === time.toDateString()) {
                    let hour = time.getHours();
                    let minutes = time.getMinutes();
                    hour = hour.toString().padStart(2, "0");
                    minutes = minutes.toString().padStart(2, "0");

                    const format_time = "Today, " + hour + ":" + minutes;
                    setShowMessage(showMessage => [...showMessage,
                        <Message message={message} sender={sender} time={format_time} key={key}/>])
                } else {
                    let month = time.getMonth() + 1;
                    let day = time.getDate();
                    let hour = time.getHours();
                    let minutes = time.getMinutes();
                    month = month.toString().padStart(2, "0");
                    day = day.toString().padStart(2, "0");
                    hour = hour.toString().padStart(2, "0");
                    minutes = minutes.toString().padStart(2, "0");

                    const format_time = month + "/" + day + ", " + hour + ":" + minutes;
                    setShowMessage(showMessage => [...showMessage,
                        <Message message={message} sender={sender} time={format_time} key={key}/>])
                }
            }
        }
        getMessage();

        socket.emit('joinConversation', room);

        socket.on(room + "get_message", (data) => {
            var id = data.msg_id;
            var sender;
            if(data.sender === parseInt(localStorage.getItem('user_id'))) {
                sender = "user";
            }
            else {
                sender = "opposite";
            }
            var message = data.message;
            var time = data.time;

            // add message
            if (data.conversation_id === props.conversation_id) {
                setShowMessage(showMessage => [...showMessage, <Message message={message} sender={sender} time={time} key={id}/>]);
            }
            scrollMessage();
        });

    }, []);
    const sendChat = () => {
        var currents = new Date();

        data.receiver = props.opposite_id;
        data.message = message;
        data.msg_id = "message" + msg_id;
        data.conversation_id = props.conversation_id;

        let msg_time = "Today, " + currents.getHours().toString().padStart(2, "0") + ":" + currents.getMinutes().toString().padStart(2, "0");
        data.time = msg_time;

        setMsg_id(msg_id + 1);
        // setShowMessage(showMessage => [...showMessage, <Message message={message} sender="user" time={msg_time} key={msg_id}/>]);

        // console.log(data);

        scrollMessage();
        socket.emit(room + "send_message", data);
    }

    const postChat = (event) => {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/send-chat',
            data: {
                message: message,
                user_id: localStorage.getItem('user_id'),
                conversation_id: props.conversation_id,
            }
        }).then(() => {
            sendChat();
        });
        setMessage("");
    }
    return (
        <div>
            <div id="chat_header" style={{height: "60px"}}>
                <h3 style={{textAlign: "center"}}><strong>{props.opposite_name}</strong></h3>
            </div>
            <div id="message">
                {showMessage.map((item, i) => {
                    return (
                        <div key={i}>{item}</div>
                    )
                })}
            </div>

            <div id="send_message_form" >
                <form id="send_chat" className="form-inline" onSubmit={postChat}>
                    <input type="text" placeholder="Aa" id="send_message" name="message" style={{borderRadius: "5px", width: "90%"}} value={message} onChange={(e) => {setMessage(e.target.value)}} required/>
                    <input type="hidden" id="conversation_id" name="conversation_id" value={props.active}/>
                    <button type="submit" style={{margin: "0px", padding: "0", border: "none", background: "none"}} className="send-chat">
                        <i className="fa fa-paper-plane" aria-hidden="true" style={{fontSize: "20px"}}/>
                    </button>
                </form>
            </div>

        </div>
    );
}

export default ChatFrame;

function scrollMessage(){
    setTimeout(function () {
        let element = document.getElementById('message');
        element.scrollTop = element.scrollHeight;
    },100);
}

