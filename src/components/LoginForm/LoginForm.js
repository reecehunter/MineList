import React, { useState } from "react";
import config from "../../config/config";
import styles from "./LoginForm.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../Input/TextInput/TextInput";
import User from "../icons/User";
import Button from "../Button/Button";

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "username", password: "password" });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${config.api_url}/api/users/login`, {
        username: event.target[0].value,
        password: event.target[1].value,
      })
      .then((res) => {
        document.cookie = `token=${res.data.token}`;
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(err);
        const errMessage = err.response.statusText.toLowerCase();
        let output = "";
        if (errMessage.includes("unauthorized")) output = "Invalid login credentials.";
        else if (errMessage.includes("bad request")) output = "Invalid login credentials.";
        else output = errMessage;
        setErrors([output]);
      });
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h1 className={styles.header}>Log In</h1>
      {errors.map((error, index) => (
        <p key={index} className="text-danger mb-3">
          {error}
        </p>
      ))}

      <div>
        <label htmlFor="username">Username</label>
        <TextInput name="username" placeholder="Username" onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <TextInput name="password" type="password" placeholder="Password" onChange={handleChange} />
      </div>

      <Button type="submit" icon={<User color="var(--primaryColor)" />} className="button-secondary">
        Log In
      </Button>

      <p className={styles.registerPrompt}>
        Don't have an account? <Link to="/auth/sign-up">Create one</Link>.
      </p>
    </form>
  );
};

export default LoginForm;
