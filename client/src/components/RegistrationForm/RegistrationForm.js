import React, { useState, useEffect } from "react";
import config from "../../config/config";
import styles from "./RegistrationForm.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../Input/TextInput/TextInput";
import Button from "../Button/Button";
import PlusSquare from "../icons/PlusSquare";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({ username: "username", email: "email@email.email", password: "password", confirmPassword: "password" });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const errorArray = [];
    if (formData.username.length < 3) errorArray.push("Username must be more than 3 characters!");
    if (!validateEmail(formData.email)) errorArray.push("Invalid email!");
    if (formData.password.length < 7) errorArray.push("Password must be more than 7 characters!");
    if (formData.confirmPassword !== formData.password) errorArray.push("Passwords must match!");
    setErrors(errorArray);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (str) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${config.api_url}/api/users/register`, {
        username: event.target[0].value,
        email: event.target[1].value,
        password: event.target[2].value,
      })
      .then((res) => {
        localStorage.setItem("username", res.data.user.username);
        navigate("/dashboard");
      })
      .catch((err) => {
        const errMessage = err.response.statusText.toLowerCase();
        let output = "";
        if (errMessage.includes("users.email")) output = "That email is already in use!";
        else output = errMessage;
        setErrors([output]);
      });
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {errors.map((error, index) => (
        <p key={index} className="text-danger mb-3">
          {error}
        </p>
      ))}

      <h1>Create an Account</h1>

      <div>
        <label htmlFor="username">Username</label>
        <TextInput name="username" type="text" placeholder="Username" onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <TextInput name="email" type="text" placeholder="Email" onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <TextInput name="password" type="password" placeholder="Password" onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <TextInput name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} />
      </div>

      <Button type="submit" icon={<PlusSquare color="var(--primaryColor)" />} className="button-secondary">
        Create Account
      </Button>

      <p className={styles.loginPrompt}>
        Already have an account? <Link to="/auth/sign-in">log in</Link>.
      </p>
    </form>
  );
};

export default RegistrationForm;
