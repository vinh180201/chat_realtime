import './Login.css';
import {useEffect, useState} from "react";
import axios from 'axios';

function Login() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [html, setHtml] = useState([]);

    useEffect(() => {
        // console.log(localStorage);
        setHtml([]);
    }, []);

    // gui form du lieu dang nhap
    const postLogin = (event) => {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/login',
            data: {
                phone: phone,
                password: password,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }).then((response) => {
            if (response.data.status === 'success') {
                localStorage.setItem('user_id', response.data.user.id);
                localStorage.setItem('user_phone', response.data.user.phone);
                localStorage.setItem('user_name', response.data.user.name);
                localStorage.setItem('login', 'true');
                localStorage.setItem('active', '0');

                window.location = "/chat/conversation/0"
            } else {
                if (response.data.msg !== undefined) {
                    setHtml([<div className="alert alert-danger">
                        <p>{response.data.msg}</p>
                    </div>]);
                }
            }
        }).catch((err) => {
            if (err.response.data.errors['phone'] !== undefined) {
                console.log(err.response.data.errors['phone'][0]);
                setHtml([<div className="alert alert-danger">
                    <p>{err.response.data.errors['phone'][0]}</p>
                </div>]);
            } else {
                console.log("more error need to be validated");
            }

        });
    }

    return (
        <div className="container">
            <div className="row top top-buffer">
                <div className="col-md-4"/>
                <div className="col-md-4">
                    <div className="jumbotron">
                        <form onSubmit={postLogin}>
                            <h4 style={{textAlign: "center"}}>Login</h4>

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
                            <div className="mb-3">
                                <label htmlFor="InputPassword" className="form-label">Password</label>
                                <input type="password" className="form-control" id="InputPassword" name="password"
                                       value={password} onChange={(e) => {
                                    setPassword(e.target.value)
                                }} required/>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="Checkbox" name="remember"/>
                                <label className="form-check-label" htmlFor="Checkbox">Remember me</label>
                            </div>
                            <button type="submit" className="btn btn-primary left_item">OK</button>
                            <a href="/signup" className="btn btn-primary right_item">Sign up</a>
                            <div className="" style={{clear: "both"}}/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
