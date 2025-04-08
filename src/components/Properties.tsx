import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Modal, Row } from "react-bootstrap";
import CreateProperty from "./CreateProperty";
import NavBar from "./NavBar";
import CreateBooking from "./CreateBooking";
import { BASE_URL } from "../utils";

const Properties = () => {
    const [userInfo, setUserInfo] = useState<any>();
    const [showBooking, setShowBooking] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [properties, setProperties]: any = useState([]);

    const handleDeleteProperty = (property: any) => {
        // Confirm deletion
        if (!window.confirm("Are you sure you want to delete this property?")) {
            return;
        }
        fetch(`${BASE_URL}/properties/${property.pid}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    getProperties(); // Refresh the property list after deletion
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
        setSelectedProperty(property); // Set the selected property for editing
        setShowModal(true); // Open the modal
    };

    const handleBookingProperty = (property: any) => {
        setSelectedProperty(property); // Set the selected property for editing
        setShowBooking(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setSelectedProperty(null); // Clear the selected property
        setShowBooking(false); // Close the booking modal
        getProperties(); // Refresh the property list
    };

    useEffect(() => {
        let data = localStorage.getItem("userInfo");
        if (data) {
            data = JSON.parse(data);
            setUserInfo(data);
        }
    }, [])

    const getProperties = () => {
        fetch(`${BASE_URL}/properties`)
        .then((response) => response.json())
        .then((data) => {
            setProperties(data);
        })
        .catch((error) => {
            console.error("Error fetching properties:", error);
        });
    }

    useEffect(() => {
        getProperties();
    }, []);


    return (
        <>
            <NavBar />
            <div className="container mt-4">
                <span className="d-flex justify-content-between align-items-center">
                    <span></span>
                    <h1 className="text-center mb-4">Properties</h1>
                    <Button variant="secondary" onClick={(e) => {
                        e.preventDefault();
                        setSelectedProperty(null);
                        setShowModal(true);
                    }}><h6>Add</h6></Button>
                </span>
                <div>
                    {properties.map((property, index) => {
                        return (<Card id={index} className="m-5">
                            <Card.Header>{property.name}</Card.Header>
                            <Card.Body>
                                <div className="blockquote mb-0">
                                    <Container>
                                        <Row>
                                            <Col><Image src={property.propertyImageUrl} style={{width: '350px', height: '250px'}} alt="propertyImage" /></Col>
                                            <Col><p>
                                                {property.propertyDetails.price}
                                            </p>
                                                <p>
                                                    {property.propertyDetails.bedrooms}
                                                </p>
                                                <p>
                                                    {property.propertyDetails.bathrooms}
                                                </p></Col>
                                        </Row>
                                    </Container>
                                    <div className="d-flex flex-row-reverse mr-2">
                                    <Button variant="primary" onClick={() => handleDeleteProperty(property)}>Delete</Button>
                                    <span className="p-2"></span>
                                    <Button variant="primary" onClick={() => handleEditProperty(property)}>Edit</Button>
                                    <span className="p-2"></span>
                                    <Button variant="primary" onClick={() => handleBookingProperty(property)}>Purchase</Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>)
                    })}
                </div>
                {/* Modal for CreateProperty */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProperty ? "Edit Property" : "Create Property"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CreateProperty initialData={selectedProperty} editMode={!!selectedProperty} handleClose={() => {
                            handleCloseModal();
                        }}/>
                    </Modal.Body>
                </Modal>
                <Modal show={showBooking} onHide={handleCloseModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{"Book Property"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CreateBooking propertyInfo={{
                            pid: selectedProperty?.pid,
                            name: selectedProperty?.name,
                            price: selectedProperty?.propertyDetails?.price || 0,
                        }}/>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};

export default Properties;