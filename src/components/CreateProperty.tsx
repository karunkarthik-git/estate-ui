import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { BASE_URL } from '../utils';

const CreateProperty: React.FC<{ initialData?: any, editMode: boolean, handleClose: any, userInfo: any }> = ({ initialData, editMode, handleClose, userInfo }) => {
    const [formData, setFormData] = useState<any>({
        pid: initialData ? initialData.pid : uuidv4(),
        owner_email: userInfo.email,
        name: '',
        type: '',
        description: '',
        address: { street: '', city: '', state: '', country: '', zipCode: '' },
        propertyDetails: {
            propertyType: '',
            listingType: '',
            price: 0,
            rooms: 0,
            squareFeet: 0,
            yearBuilt: 0,
            additionalInfo: [],
            startDate: '',
            endDate: ''
        },
        propertyImageUrl: '',
        available: true,
    });

    const [newAmenity, setNewAmenity] = useState<string>(''); // For dynamically adding additionalInfo

    useEffect(() => {
        if (initialData) {
            setFormData(initialData); // Prefill the form with initial data for edit cases
        }
    }, [initialData]);

    const handleInputChange = (e: any, field: string, parentField?: string, type?: string) => {
        if (type === 'date' && parentField) {
            setFormData({
                ...formData,
                [parentField]: {
                    ...formData[parentField],
                    [field]: e.target.value,
                },
            });
        } else if (parentField) {
            if (e.target.valueAsNumber) {
                setFormData({
                    ...formData,
                    [parentField]: {
                        ...formData[parentField],
                        [field]: e.target.valueAsNumber,
                    },
                });
            } else {
                setFormData({
                    ...formData,
                    [parentField]: {
                        ...formData[parentField],
                        [field]: e.target.value,
                    },
                });
            }
        } else {
            setFormData({ ...formData, [field]: e.target.value });
        }
    };

    const handleAddAmenity = () => {
        if (newAmenity.trim() && !formData.propertyDetails.additionalInfo.includes(newAmenity)) {
            setFormData({
                ...formData,
                propertyDetails: {
                    ...formData.propertyDetails,
                    additionalInfo: [...formData.propertyDetails.additionalInfo, newAmenity],
                },
            });
            setNewAmenity(''); // Clear the input field
        }
    };

    const handleRemoveAmenity = (amenity: string) => {
        const updatedAmenities = formData.propertyDetails.additionalInfo.filter((a: string) => a !== amenity);
        setFormData({
            ...formData,
            propertyDetails: {
                ...formData.propertyDetails,
                additionalInfo: updatedAmenities,
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode) {
            fetch(`${BASE_URL}/properties/${initialData.pid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }
                )
                .then((data) => {
                    console.log('Success updated:', data);
                    handleClose();
                    // Optionally, you can redirect or show a success message here
                }
                )
                .catch((error) => {
                    console.error('Error:', error);
                    // Optionally, you can show an error message here
                }
                );
        } else {
            fetch(`${BASE_URL}/properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }
                )
                .then((data) => {
                    console.log('Success:', data);
                    handleClose();
                    // Optionally, you can redirect or show a success message here
                }
                )
                .catch((error) => {
                    console.error('Error:', error);
                    // Optionally, you can show an error message here
                }
                );
        }
    };

    return (
        <div className="create-property-container w-100 p-4 border rounded">
            <Form onSubmit={handleSubmit}>
                <div className="p-3 border rounded mb-3">
                    <h5 className="text-center">Property Information</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Property Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange(e, 'name')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Property Type</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.type}
                            onChange={(e) => handleInputChange(e, 'type')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => handleInputChange(e, 'description')}
                        />
                    </Form.Group>
                </div>

                <div className="p-3 border rounded mb-3">
                    <h5 className="text-center">Address</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Street</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => handleInputChange(e, 'street', 'address')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address.city}
                            onChange={(e) => handleInputChange(e, 'city', 'address')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address.state}
                            onChange={(e) => handleInputChange(e, 'state', 'address')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address.country}
                            onChange={(e) => handleInputChange(e, 'country', 'address')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address.zipCode}
                            onChange={(e) => handleInputChange(e, 'zipCode', 'address')}
                        />
                    </Form.Group>
                </div>

                <div className="p-3 border rounded mb-3">
                    <h5 className="text-center">Property Details</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.propertyDetails.propertyType}
                            onChange={(e) => handleInputChange(e, 'propertyType', 'propertyDetails')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Listing Type</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.propertyDetails.listingType}
                            onChange={(e) => handleInputChange(e, 'listingType', 'propertyDetails')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Rooms</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.propertyDetails.rooms}
                            onChange={(e) => handleInputChange(e, 'rooms', 'propertyDetails')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Square Feet</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.propertyDetails.squareFeet}
                            onChange={(e) => handleInputChange(e, 'squareFeet', 'propertyDetails')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Year Built</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.propertyDetails.yearBuilt}
                            onChange={(e) => handleInputChange(e, 'yearBuilt', 'propertyDetails')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.propertyDetails.price}
                            onChange={(e) => handleInputChange(e, 'price', 'propertyDetails')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.propertyDetails.startDate}
                            onChange={(e) => handleInputChange(e, 'startDate', 'propertyDetails', 'date')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.propertyDetails.endDate}
                            onChange={(e) => handleInputChange(e, 'endDate', 'propertyDetails', 'date')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Additional Info</Form.Label>
                        <div>
                            {formData.propertyDetails.additionalInfo.map((amenity: string, index: number) => (
                                <div key={index} className="d-flex align-items-center mb-2">
                                    <span className="me-2">{amenity}</span>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveAmenity(amenity)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Add an amenity"
                                value={newAmenity}
                                onChange={(e) => setNewAmenity(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={handleAddAmenity}
                            >
                                Add
                            </button>
                        </div>
                    </Form.Group>
                </div>

                <Form.Group className="mb-3">
                    <Form.Label>Property Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.propertyImageUrl}
                        onChange={(e) => handleInputChange(e, 'propertyImageUrl')}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Available"
                        checked={formData.available}
                        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    />
                </Form.Group>

                <button type="submit" className="btn btn-primary w-100">
                    {initialData ? 'Update Property' : 'Create Property'}
                </button>
            </Form>
        </div>
    );
};

export default CreateProperty;