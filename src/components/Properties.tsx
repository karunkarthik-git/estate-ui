import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import CreateProperty from "./CreateProperty";
import {PROPERTIES} from "../mocks/data.ts";
import NavBar from "./NavBar";

const Properties: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);

    const handleEditProperty = (property: any) => {
        setSelectedProperty(property); // Set the selected property for editing
        setShowModal(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setSelectedProperty(null); // Clear the selected property
    };

    return (
        <>
        <NavBar/>
        <div className="container mt-4">
            <h1 className="text-center mb-4">Properties</h1>
            <span onClick={(e) => {
                e.preventDefault();
                setSelectedProperty(null); // Clear the selected property
                setShowModal(true); // Open the modal
            }}>Create</span>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Bedrooms</th>
                        <th>Bathrooms</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {PROPERTIES.map((property, index) => (
                        <tr key={index}>
                            <td>{property.name}</td>
                            <td>{property.type}</td>
                            <td>{property.propertyDetails.price}</td>
                            <td>{property.propertyDetails.bedrooms}</td>
                            <td>{property.propertyDetails.bathrooms}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    onClick={() => handleEditProperty(property)}
                                >
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for CreateProperty */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProperty ? "Edit Property" : "Create Property"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateProperty initialData={selectedProperty} />
                </Modal.Body>
            </Modal>
        </div>
        </>
    );
};

export default Properties;