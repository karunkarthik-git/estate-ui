import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CreateProperty: React.FC<{ initialData?: any }> = ({ initialData }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<any>({
        pid: initialData ? initialData.pid : uuidv4(),
        name: '',
        type: '',
        description: '',
        address: { street: '', city: '', state: '', country: '', zipCode: '' },
        propertyDetails: {
            propertyType: '',
            listingType: '',
            price: '',
            bedrooms: '',
            bathrooms: '',
            squareFeet: '',
            yearBuilt: '',
            amenities: [],
        },
        propertyImageUrl: '',
        available: true,
    });

    const [newAmenity, setNewAmenity] = useState<string>(''); // For dynamically adding amenities

    useEffect(() => {
        if (initialData) {
            setFormData(initialData); // Prefill the form with initial data for edit cases
        }
    }, [initialData]);

    const handleInputChange = (e: any, field: string, parentField?: string) => {
        if (parentField) {
            setFormData({
                ...formData,
                [parentField]: {
                    ...formData[parentField],
                    [field]: e.target.value,
                },
            });
        } else {
            setFormData({ ...formData, [field]: e.target.value });
        }
    };

    const handleAddAmenity = () => {
        if (newAmenity.trim() && !formData.propertyDetails.amenities.includes(newAmenity)) {
            setFormData({
                ...formData,
                propertyDetails: {
                    ...formData.propertyDetails,
                    amenities: [...formData.propertyDetails.amenities, newAmenity],
                },
            });
            setNewAmenity(''); // Clear the input field
        }
    };

    const handleRemoveAmenity = (amenity: string) => {
        const updatedAmenities = formData.propertyDetails.amenities.filter((a: string) => a !== amenity);
        setFormData({
            ...formData,
            propertyDetails: {
                ...formData.propertyDetails,
                amenities: updatedAmenities,
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Final Property Data:', formData);
        // Add API call here to create or update the property
        navigate('/'); // Redirect to home or property list after submission
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
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.propertyDetails.price}
                            onChange={(e) => handleInputChange(e, 'price', 'propertyDetails')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Bedrooms</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.propertyDetails.bedrooms}
                            onChange={(e) => handleInputChange(e, 'bedrooms', 'propertyDetails')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Bathrooms</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.propertyDetails.bathrooms}
                            onChange={(e) => handleInputChange(e, 'bathrooms', 'propertyDetails')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Amenities</Form.Label>
                        <div>
                            {formData.propertyDetails.amenities.map((amenity: string, index: number) => (
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