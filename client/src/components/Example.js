import React from 'react';
import axios from 'axios';
import * as ReactDOM from "react-dom";

const Example = () => {
    const [formValue, setformValue] = React.useState({
        email: '',
        password: ''
    });

    const handleSubmit = async() => {
        // store the states in the form data
        const loginFormData = new FormData();
        loginFormData.append("username", formValue.email)
        loginFormData.append("password", formValue.password)

        try {
            // make axios post request
            const response = await axios.post("/api/login", {
                data: loginFormData,
            });
            console.log(response);
        } catch(error) {
            console.log(error.response.data)
        }
    }
    const handleChange = (event) => {
        setformValue({formValue,
            [event.target.name]: event.target.value
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <p>Login Form</p>
            <input
                type="email"
                name="email"
                placeholder="enter an email"
                value={formValue.email}
                onChange={handleChange}
            />
            <input
                type="password"
                name="password"
                placeholder="enter a password"
                value={formValue.password}
                onChange={handleChange}
            />
            <button
                type="submit"
            >
                Login
            </button>
        </form>
    )
};

export default Example;

ReactDOM.render(<Example />, document.getElementById('example'));
