import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {SocketContext} from "./contexts/socket";

const redirectChat = 'chat/conversation/' + localStorage.getItem('active');

const Connect = () => {
    const socket = useContext(SocketContext);
    const room = "room" + localStorage.getItem('user_id');

    const [phone, setPhone] = useState("");
    const [html, setHtml] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('login') !== 'true') {
            window.location = "/login";
        }
        setHtml([]);
        socket.emit('joinConversation', room);
    }, []);

    // gui form du lieu ket noi
    const postConnect = (event) => {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/connect',
            data: {
                phone: phone,
                user_id: localStorage.getItem('user_id'),
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }).then((response) => {
            // console.log(response.data.status);
            if (response.data.status === 'success') {
                getUserName();

            } else {
                if (response.data.msg !== undefined) {
                    setHtml([<div className="alert alert-danger">
                        <p>{response.data.msg}</p>
                    </div>]);
                }
            }
        }).catch((err) => {
            if (err.response.data.errors['phone'] !== undefined) {
                // console.log(err.response.data.errors);
                setHtml([<div className="alert alert-danger">
                    <p>{err.response.data.errors['phone'][0]}</p>
                </div>]);
            } else {
                console.log("more error need to be validated");
            }
        });
    }

    const getUserName = () => {
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/connect/getUser',
            data: {
                phone: phone,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }).then((response) => {
            var data = {
                receiver_name: response.data.user_name,
                receiver_id: response.data.id,
                requester_id: localStorage.getItem('user_id'),
                requester_name: localStorage.getItem('user_name'),
            }
            socket.emit(room + "send_connect", data);
            window.location = redirectChat;
        })
    }
    return (
        <div className="container">
            <div className="row top top-buffer">
                <div className="col-md-4"/>
                <div className="col-md-4">
                    <div className="jumbotron">
                        <form onSubmit={postConnect}>
                            <h4 style={{textAlign: "center"}}>Connect</h4>
                            {html.map((key, index) => {
                                return (
                                    <div key={index}>{key}</div>
                                );
                            })}
                            <div className="mb-3">
                                <label htmlFor="InputPhone" className="form-label">Phone</label>
                                <input type="tel" className="form-control" id="InputPhone" name="phone" value={phone}
                                       onChange={(e) => {
                                           setPhone(e.target.value)
                                       }} required/>
                            </div>
                            <button type="submit" className="btn btn-primary left_item connect">OK</button>
                            <a href={redirectChat} className="btn btn-primary right_item">Cancel</a>
                            <div className="col-md-4" style={{clear: "both"}}/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Connect;
