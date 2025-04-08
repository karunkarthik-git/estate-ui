import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login submitted:', { email, password });
        // Add API for login.
        localStorage.setItem('email', email);
        navigate('/home');
    };

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/home');
        }
    }, []);

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