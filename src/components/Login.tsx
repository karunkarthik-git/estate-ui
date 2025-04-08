import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils';

const Login = ({ handleLogin }: any) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const validateLogin = (email, password) => {
        return new Promise((resolve, reject) => {
            fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(response => {
                    localStorage.setItem("userDetails", JSON.stringify(response))
                    resolve(response);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    resolve(null);
                });
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateLogin(email, password).then((response: any) => {
            if (response) {
                handleLogin(response);
                navigate('/home'); // Redirect to home page after successful login
            } else {
                alert('Invalid email or password');
            }
        });
    };

    return (
        <div className="login-container">
            <div>
                <h2>Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="loginForm.email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="loginForm.password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>
                </Form>
                <p className="mt-3">
                    Don't have an account? <Link to="/register">Register here</Link> {/* Link to Registration */}
                </p>
            </div>
        </div>
    );
};

export default Login;