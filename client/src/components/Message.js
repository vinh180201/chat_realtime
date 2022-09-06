import React from 'react';

const Message = (props) => {
    const sender = props.sender;

    if (sender === "opposite") {
        return (
            <div className="d-flex justify-content-start mb-4">
                <div className="msg_cotainer">
                    {props.message}
                    <span className="msg_time" style={{width: "200px", textAlign: "left"}}>{props.time}</span>
                </div>
            </div>
        );
    }
    return (
        <div className="d-flex justify-content-end mb-4">
            <div className="msg_cotainer_send">
                {props.message}
                <span className="msg_time_send" style={{width: "200px", textAlign: "right"}}>{props.time}</span>
            </div>
        </div>
    );
}

export default Message;



