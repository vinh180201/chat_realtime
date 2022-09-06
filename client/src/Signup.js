import axios from "axios";
import {useEffect, useState} from "react";


function Signup() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_password] = useState("");
    const [html, setHtml] = useState([]);


    useEffect(() => {
        if (localStorage.getItem('login') === "true") {
            window.location = "/not-found";
        }
        setHtml([]);
    }, []);

    const postSignup = (event) => {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/signup',
            data: {
                phone: phone,
                password: password,
                password_confirmation: confirm_password,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }).then((response) => {
            // console.log(response.data);
            if (response.data.status === 'success') {
                window.location = "/login"
            } else {
                if (response.data.msg !== undefined) {
                    setHtml([<div className="alert alert-danger">
                        <p>{response.data.msg}</p>
                    </div>]);
                }
            }
        }).catch((err) => {
            // console.log(err.response.data.errors);
            if (err.response.data.errors['phone'] !== undefined) {
                console.log(err.response.data.errors['phone']);
                setHtml([<div className="alert alert-danger">
                    <p>{err.response.data.errors['phone'][0]}</p>
                </div>]);
            } else if(err.response.data.errors['password_confirmation'] !== undefined) {
                console.log(err.response.data.errors['password_confirmation'][0]);
                setHtml([<div className="alert alert-danger">
                    <p>{err.response.data.errors['password_confirmation'][0]}</p>
                </div>]);
            }
            else {
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
                        <form onSubmit={postSignup}>
                            <h4 style={{textAlign: "center"}}>Sign up</h4>
                            {html.map((key, index) => {
                                return (
                                    <div key={index}>{key}</div>
                                );
                            })}
                            <div className="mb-3">
                                <label htmlFor="InputPhone" className="form-label">Phone</label>
                                <input type="tel" className="form-control" id="InputPhone" name="phone" value={phone} onChange={(e) => {
                                    setPhone(e.target.value)
                                }} required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputPassword" className="form-label">Password</label>
                                <input type="password" className="form-control" id="InputPassword" name="password" value={password} onChange={(e) => {
                                    setPassword(e.target.value)
                                }} required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputPassword" className="form-label">Confirm password</label>
                                <input type="password" className="form-control" id="InputConfirmPassword"
                                       name="password_confirmation" value={confirm_password} onChange={(e) => {
                                    setConfirm_password(e.target.value)
                                }} required/>
                            </div>
                            <button type="submit" className="btn btn-primary left_item">OK</button>
                            <a href="/login" className="btn btn-primary right_item">Cancel</a>
                            <div className="" style={{clear: "both"}}/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
