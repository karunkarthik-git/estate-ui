import React from 'react';
import { Button, Container, Row, Col, Image } from 'react-bootstrap';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <NavBar />
            {/* Hero Section */}
            <header
                className="hero-section text-center text-white d-flex align-items-center justify-content-center"
                style={{
                    background: 'url(https://source.unsplash.com/1600x900/?house,rent) no-repeat center center/cover',
                    height: '70vh',
                    position: 'relative',
                }}
            >
                <div
                    className="overlay"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                ></div>
                <div className="content" style={{ zIndex: 1 }}>
                    <h1 className="display-3">Welcome to House Rentals</h1>
                    <p className="lead">Find your dream home or list your property with ease.</p>
                    <Button
                        variant="primary"
                        size="lg"
                        className="me-3"
                        onClick={() => navigate('/properties')}
                    >
                        Browse Properties
                    </Button>
                    <Button
                        variant="outline-light"
                        size="lg"
                        onClick={() => navigate('/register')}
                    >
                        Get Started
                    </Button>
                </div>
            </header>

            {/* Feature Highlights Section */}
            <main className="mt-5">
                <Container>
                    <Row className="text-center mb-5">
                        <Col>
                            <h2>Why Choose Us?</h2>
                            <p className="text-muted">
                                Discover the benefits of using House Rentals for your property needs.
                            </p>
                        </Col>
                    </Row>
                    <Row className="text-center">
                        <Col md={4} className="mb-4">
                            <Image
                                src="https://source.unsplash.com/300x300/?home"
                                roundedCircle
                                className="mb-3"
                            />
                            <h4>Find Your Dream Home</h4>
                            <p>
                                Search for properties that match your preferences, including location,
                                price, and amenities.
                            </p>
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate('/properties')}
                            >
                                Search Properties
                            </Button>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Image
                                src="https://source.unsplash.com/300x300/?real-estate"
                                roundedCircle
                                className="mb-3"
                            />
                            <h4>List Your Property</h4>
                            <p>
                                Agents can list their properties and manage bookings effortlessly.
                            </p>
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate('/properties')}
                            >
                                List a Property
                            </Button>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Image
                                src="https://source.unsplash.com/300x300/?contract"
                                roundedCircle
                                className="mb-3"
                            />
                            <h4>Manage Bookings</h4>
                            <p>
                                View and manage your bookings, whether you're a renter or an agent.
                            </p>
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate('/bookings')}
                            >
                                Manage Bookings
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </main>

            {/* Testimonials Section */}
            <section className="bg-light py-5">
                <Container>
                    <Row className="text-center mb-4">
                        <Col>
                            <h2>What Our Users Say</h2>
                            <p className="text-muted">
                                Hear from our satisfied renters and agents.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} className="text-center mb-4">
                            <Image
                                src="https://source.unsplash.com/100x100/?person"
                                roundedCircle
                                className="mb-3"
                            />
                            <blockquote className="blockquote">
                                <p>
                                    "House Rentals made finding my dream home so easy and stress-free!"
                                </p>
                                <footer className="blockquote-footer">John Doe</footer>
                            </blockquote>
                        </Col>
                        <Col md={4} className="text-center mb-4">
                            <Image
                                src="https://source.unsplash.com/100x100/?person"
                                roundedCircle
                                className="mb-3"
                            />
                            <blockquote className="blockquote">
                                <p>
                                    "As an agent, I love how simple it is to list and manage my
                                    properties."
                                </p>
                                <footer className="blockquote-footer">Jane Smith</footer>
                            </blockquote>
                        </Col>
                        <Col md={4} className="text-center mb-4">
                            <Image
                                src="https://source.unsplash.com/100x100/?person"
                                roundedCircle
                                className="mb-3"
                            />
                            <blockquote className="blockquote">
                                <p>
                                    "The booking process was seamless, and I found the perfect rental
                                    in no time!"
                                </p>
                                <footer className="blockquote-footer">Emily Johnson</footer>
                            </blockquote>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-4">
                <Container>
                    <Row>
                        <Col>
                            <p>&copy; {new Date().getFullYear()} House Rentals. All rights reserved.</p>
                            <p>
                                <a href="/about" className="text-white">
                                    About Us
                                </a>{' '}
                                |{' '}
                                <a href="/contact" className="text-white">
                                    Contact
                                </a>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
};

export default Home;