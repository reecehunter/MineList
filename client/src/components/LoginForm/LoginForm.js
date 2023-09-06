import React, { useState } from 'react'
import styles from './LoginForm.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
    const [formData, setFormData] = useState({ username: "username", password: "password" });
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
    }

    const onSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:5000/api/users/login", {
            username: event.target[0].value,
            password: event.target[1].value,
          })
          .then((res) => {
            document.cookie = `token=${res.data.token}`;
            navigate("/profile");
          })
          .catch((err) => {
            console.log(err);
            const errMessage = err.response.statusText.toLowerCase();
            let output = "";
            if(errMessage.includes("unauthorized")) output = "Invalid login credentials.";
            else if(errMessage.includes("bad request")) output = "Invalid login credentials.";
            else output = errMessage;
            setErrors([output]);
          });
    }

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {errors.map((error, index) => (
            <p key={index} className="text-danger mb-3">
                {error}
            </p>
            ))}

            <div>
                <label htmlFor="username">Username</label>
                <input name="username" type="text" placeholder="Username" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
            </div>

            <input type="submit" value="Log In" className='button button-secondary' />
        </form>
    )
}

export default LoginForm