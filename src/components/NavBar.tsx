import React, { useState } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const [userInfo, setUserInfo] = useState<any>();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user session or token
        localStorage.removeItem('userInfo');
        navigate('/login'); // Redirect to login page
    };

    React.useEffect(() => {
        let data = localStorage.getItem("userInfo");
        if (data) {
            data = JSON.parse(data);
            setUserInfo(data);
        }
    }, [])

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
                        {userInfo?.user_type === 'renter' && (
                            <Nav.Link onClick={() => navigate('/settings')}>User Settings</Nav.Link>
                        )}
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