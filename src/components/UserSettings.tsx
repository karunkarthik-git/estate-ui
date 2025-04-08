import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import NavBar from './NavBar';

const UserSettings: React.FC<{ initialData: any }> = ({ initialData }) => {
    const [formData, setFormData] = useState<any>({
        name: '',
        email: '',
        address: [{ street: '', city: '', state: '', zip: '', addressId: uuidv4() }],
        creditCards: [{ number: '', expiry: '', cvv: '', billingAddressId: '', cardId: uuidv4() }],
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData); // Prefill the form with initial data
        }
    }, [initialData]);

    const handleInputChange = (
        e: any,
        field: string,
        index?: number,
        type?: 'address' | 'creditCard'
    ) => {
        if (type === 'address' && index !== undefined) {
            const updatedAddress = [...formData.address];
            updatedAddress[index][field] = e.target.value;
            setFormData({ ...formData, address: updatedAddress });
        } else if (type === 'creditCard' && index !== undefined) {
            const updatedCards = [...formData.creditCards];
            updatedCards[index][field] = e.target.value;
            setFormData({ ...formData, creditCards: updatedCards });
        } else {
            setFormData({ ...formData, [field]: e.target.value });
        }
    };

    const addAddress = () => {
        setFormData({
            ...formData,
            address: [...formData.address, { street: '', city: '', state: '', zip: '', addressId: uuidv4() }],
        });
    };

    const addCreditCard = () => {
        setFormData({
            ...formData,
            creditCards: [...formData.creditCards, { number: '', expiry: '', cvv: '', billingAddressId: '', cardId: uuidv4() }],
        });
    };

    const deleteAddress = (index: number) => {
        const addressId = formData.address[index].addressId;
        const isLinked = formData.creditCards.some((card: any) => card.billingAddressId === addressId);

        if (!isLinked) {
            const updatedAddress = formData.address.filter((_: any, i: number) => i !== index);
            setFormData({ ...formData, address: updatedAddress });
        } else {
            alert('Cannot delete address linked to a credit card.');
        }
    };

    const deleteCreditCard = (index: number) => {
        const updatedCards = formData.creditCards.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, creditCards: updatedCards });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Updated User Data:', formData);
        // Add API call here to update user data
        alert('User details updated successfully!');
    };

    return (
        <>
        <NavBar/>
        <div className="d-flex justify-content-center align-items-center">
            <div className="user-settings-container w-50 p-4 border rounded">
                <h2 className="text-center mb-4">User Settings</h2>
                <Form onSubmit={handleSubmit}>
                    <div className="p-3 border rounded mb-3">
                        <h5 className="text-center">Personal Information</h5>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange(e, 'email')}
                            />
                        </Form.Group>
                    </div>

                    <div className="p-3 border rounded mb-3">
                        <h5 className="text-center">Address Information</h5>
                        {formData.address.map((address: any, index: number) => (
                            <div key={address.addressId} className="p-3 border rounded mb-3">
                                <h6>Address {index + 1}</h6>
                                <Form.Group className="mb-3">
                                    <Form.Label>Street</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={address.street}
                                        onChange={(e) => handleInputChange(e, 'street', index, 'address')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={address.city}
                                        onChange={(e) => handleInputChange(e, 'city', index, 'address')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={address.state}
                                        onChange={(e) => handleInputChange(e, 'state', index, 'address')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={address.zip}
                                        onChange={(e) => handleInputChange(e, 'zip', index, 'address')}
                                    />
                                </Form.Group>
                                <button
                                    type="button"
                                    className="btn btn-danger mb-3"
                                    onClick={() => deleteAddress(index)}
                                    disabled={formData.address.length <= 1}
                                >
                                    Delete Address
                                </button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary mb-3" onClick={addAddress}>
                            Add Address
                        </button>
                    </div>

                    <div className="p-3 border rounded mb-3">
                        <h5 className="text-center">Credit Card Information</h5>
                        {formData.creditCards.map((card: any, index: number) => (
                            <div key={card.cardId} className="p-3 border rounded mb-3">
                                <h6>Credit Card {index + 1}</h6>
                                <Form.Group className="mb-3">
                                    <Form.Label>Card Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={card.number}
                                        onChange={(e) => handleInputChange(e, 'number', index, 'creditCard')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Expiry</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={card.expiry}
                                        onChange={(e) => handleInputChange(e, 'expiry', index, 'creditCard')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={card.cvv}
                                        onChange={(e) => handleInputChange(e, 'cvv', index, 'creditCard')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Billing Address</Form.Label>
                                    <Form.Select
                                        value={card.billingAddressId}
                                        onChange={(e) => handleInputChange(e, 'billingAddressId', index, 'creditCard')}
                                    >
                                        <option value="">Select Billing Address</option>
                                        {formData.address.map((address: any) => (
                                            <option key={address.addressId} value={address.addressId}>
                                                {address.street}, {address.city}, {address.state}, {address.zip}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <button
                                    type="button"
                                    className="btn btn-danger mb-3"
                                    onClick={() => deleteCreditCard(index)}
                                    disabled={formData.creditCards.length <= 1}
                                >
                                    Delete Credit Card
                                </button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary mb-3" onClick={addCreditCard}>
                            Add Credit Card
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Update Details
                    </button>
                </Form>
            </div>
        </div>
        </>
    );
};

export default UserSettings;