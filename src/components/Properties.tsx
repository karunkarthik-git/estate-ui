import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Image, Modal, Row } from "react-bootstrap";
import CreateProperty from "./CreateProperty";
import NavBar from "./NavBar";
import CreateBooking from "./CreateBooking";
import { BASE_URL, getProperties } from "../utils";

const Properties = () => {
    const [userInfo, setUserInfo] = useState<any>();
    const [showBooking, setShowBooking] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [properties, setProperties]: any = useState([]);
    const [filteredProperties, setFilteredProperties]: any = useState([]);
    const [filters, setFilters] = useState({
        location: "",
        date: "",
        propertyType: "",
        bedrooms: "",
        priceMin: "",
        priceMax: "",
        sortBy: "price", // Default sorting by price
    });
    const isAgent = userInfo?.user_type === "agent";

    const handleDeleteProperty = (property: any) => {
        if (!window.confirm("Are you sure you want to delete this property?")) {
            return;
        }
        fetch(`${BASE_URL}/properties/${property.pid}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    getPropertiesList();
                    console.log("Property deleted successfully");
                } else {
                    console.error("Error deleting property:", response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error deleting property:", error);
            });
    };

    const handleEditProperty = (property: any) => {
        setSelectedProperty(property);
        setShowModal(true);
    };

    const handleBookingProperty = (property: any) => {
        setSelectedProperty(property);
        setShowBooking(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProperty(null);
        setShowBooking(false);
        getPropertiesList();
    };

    useEffect(() => {
        let data = localStorage.getItem("userInfo");
        if (data) {
            data = JSON.parse(data);
            setUserInfo(data);
        }
    }, []);

    const getPropertiesList = () => {
        getProperties()
            .then((data) => {
                if (data) {
                    setProperties(data);
                    setFilteredProperties(data); // Initialize filtered properties
                } else {
                    console.error("Error fetching properties");
                }
            })
            .catch((error) => {
                console.error("Error fetching properties:", error);
            });
    };

    useEffect(() => {
        getPropertiesList();
    }, []);

    const handleFilterChange = (e: any) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const applyFilters = () => {
        let filtered = properties;

        // Filter by location
        if (filters.location) {
            filtered = filtered.filter(
                (property: any) =>
                    property.address.city.toLowerCase().includes(filters.location.toLowerCase()) ||
                    property.address.state.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Filter by date
        if (filters.date) {
            filtered = filtered.filter(
                (property: any) =>
                    new Date(filters.date) >= new Date(property.propertyDetails.startDate) &&
                    new Date(filters.date) <= new Date(property.propertyDetails.endDate)
            );
        }

        // Filter by property type
        if (filters.propertyType) {
            filtered = filtered.filter(
                (property: any) =>
                    property.propertyDetails.propertyType.toLowerCase() === filters.propertyType.toLowerCase()
            );
        }

        // Filter by number of bedrooms
        if (filters.bedrooms) {
            filtered = filtered.filter(
                (property: any) => property.propertyDetails.rooms === parseInt(filters.bedrooms)
            );
        }

        // Filter by price range
        if (filters.priceMin) {
            filtered = filtered.filter(
                (property: any) => property.propertyDetails.price >= parseInt(filters.priceMin)
            );
        }
        if (filters.priceMax) {
            filtered = filtered.filter(
                (property: any) => property.propertyDetails.price <= parseInt(filters.priceMax)
            );
        }

        // Sort properties
        if (filters.sortBy === "price") {
            filtered = filtered.sort((a: any, b: any) => a.propertyDetails.price - b.propertyDetails.price);
        } else if (filters.sortBy === "bedrooms") {
            filtered = filtered.sort((a: any, b: any) => a.propertyDetails.rooms - b.propertyDetails.rooms);
        }

        setFilteredProperties(filtered);
    };

    useEffect(() => {
        applyFilters();
    }, [filters]);

    return (
        <>
            <NavBar />
            <div className="container mt-4">
                <span className="d-flex justify-content-center align-items-center">
                    <span></span>
                    <h1 className="text-center mb-4">Properties</h1>
                    {userInfo?.user_type != 'renter' ? <Button
                        variant="secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectedProperty(null);
                            setShowModal(true);
                        }}
                    >
                        <h6>Add</h6>
                    </Button>: <></>}
                </span>

                {/* Search Filters */}
                <div className="p-3 border rounded mb-4">
                    <h5>Search Filters</h5>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={filters.date}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Property Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="propertyType"
                                        value={filters.propertyType}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Bedrooms</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="bedrooms"
                                        value={filters.bedrooms}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Price Min</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="priceMin"
                                        value={filters.priceMin}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Price Max</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="priceMax"
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Sort By</Form.Label>
                                    <Form.Select
                                        name="sortBy"
                                        value={filters.sortBy}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="price">Price</option>
                                        <option value="bedrooms">Bedrooms</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* Properties List */}
                <div>
                    {filteredProperties.map((property, index) => {
                        const isOwner = userInfo?.email === property.owner_email;
                        return (
                            <Card id={index} className="m-5">
                                <Card.Header>{property.name}</Card.Header>
                                <Card.Body>
                                    <div className="blockquote mb-0">
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <Image
                                                        src={property.propertyImageUrl}
                                                        style={{ width: "350px", height: "250px" }}
                                                        alt="propertyImage"
                                                    />
                                                </Col>
                                                <Col>
                                                    <p><strong>Price:</strong> ${property.propertyDetails.price}</p>
                                                    <p><strong>Bedrooms:</strong> {property.propertyDetails.rooms}</p>
                                                    <p><strong>Type:</strong> {property.propertyDetails.propertyType}</p>
                                                    <p><strong>Listing Type:</strong> {property.propertyDetails.listingType}</p>
                                                    <p><strong>Address:</strong> {property.address.street}, {property.address.city}, {property.address.state}, {property.address.country}, {property.address.zipCode}</p>
                                                    <p><strong>Available:</strong> {property.available ? "Yes" : "No"}</p>
                                                    <p><strong>Rental Period:</strong> {property.propertyDetails.startDate} to {property.propertyDetails.endDate}</p>
                                                </Col>
                                            </Row>
                                        </Container>
                                        <div className="d-flex flex-row-reverse mr-2">
                                            {isAgent && isOwner ? (
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleDeleteProperty(property)}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <span className="p-2"></span>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleEditProperty(property)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <span className="p-2"></span>
                                                </>
                                            ) : (
                                                !isAgent && property?.available ? <Button
                                                    variant="primary"
                                                    onClick={() => handleBookingProperty(property)}
                                                >
                                                    Book
                                                </Button> : <></>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </div>

                {/* Modal for CreateProperty */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProperty ? "Edit Property" : "Create Property"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CreateProperty
                            userInfo={userInfo}
                            initialData={selectedProperty}
                            editMode={!!selectedProperty}
                            handleClose={() => {
                                handleCloseModal();
                            }}
                        />
                    </Modal.Body>
                </Modal>

                {/* Modal for CreateBooking */}
                <Modal show={showBooking} onHide={handleCloseModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{"Book Property"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CreateBooking
                            propertyInfo={{
                                pid: selectedProperty?.pid,
                                name: selectedProperty?.name,
                                price: selectedProperty?.propertyDetails?.price || 0,
                                owner_email: selectedProperty?.owner_email,
                            }}
                            handleClose={(data) => {
                                handleCloseModal();
                            }}
                        />
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};

export default Properties;