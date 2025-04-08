import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user session or token
        localStorage.removeItem('userToken');
        navigate('/login'); // Redirect to login page
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
                    Real Estate App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate('/home')}>Home</Nav.Link>
                        <Nav.Link onClick={() => navigate('/bookings')}>Bookings</Nav.Link>
                        <Nav.Link onClick={() => navigate('/properties')}>Properties</Nav.Link>
                        <Nav.Link onClick={() => navigate('/settings')}>User Settings</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;