import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import NavBar from './NavBar';

const UserSettings = () => {
    const [userInfo, setUserInfo] = useState<any>();
    const [formData, setFormData] = useState<any>({
        name: '',
        email: '',
        addresses: [{ street: '', city: '', state: '', zip: '', addressId: uuidv4() }],
        credit_cards: [{ number: '', expiry: '', cvv: '', billingAddressId: '', cardId: uuidv4() }],
    });

    useEffect(() => {
        let data = localStorage.getItem("userDetails");
        if (data) {
            data = JSON.parse(data);
            setUserInfo(data);
            setFormData(data);
        }
    }, [])

    const handleInputChange = (
        e: any,
        field: string,
        index?: number,
        type?: 'addresses' | 'creditCard'
    ) => {
        if (type === 'addresses' && index !== undefined) {
            const updatedAddress = [...formData.addresses];
            updatedAddress[index][field] = e.target.value;
            setFormData({ ...formData, addresses: updatedAddress });
        } else if (type === 'creditCard' && index !== undefined) {
            const updatedCards = [...formData.credit_cards];
            updatedCards[index][field] = e.target.value;
            setFormData({ ...formData, credit_cards: updatedCards });
        } else {
            setFormData({ ...formData, [field]: e.target.value });
        }
    };

    const addAddress = () => {
        setFormData({
            ...formData,
            addresses: [...formData.addresses, { street: '', city: '', state: '', zip: '', addressId: uuidv4() }],
        });
    };

    const addCreditCard = () => {
        setFormData({
            ...formData,
            credit_cards: [...formData.credit_cards, { number: '', expiry: '', cvv: '', billingAddressId: '', cardId: uuidv4() }],
        });
    };

    const deleteAddress = (index: number) => {
        const addressId = formData.addresses[index].addressId;
        const isLinked = formData.credit_cards.some((card: any) => card.billingAddressId === addressId);

        if (!isLinked) {
            const updatedAddress = formData.addresses.filter((_: any, i: number) => i !== index);
            setFormData({ ...formData, addresses: updatedAddress });
        } else {
            alert('Cannot delete addresses linked to a credit card.');
        }
    };

    const deleteCreditCard = (index: number) => {
        const updatedCards = formData.credit_cards.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, credit_cards: updatedCards });
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
                        {formData.addresses?.map((addresses: any, index: number) => (
                            <div key={addresses.addressId} className="p-3 border rounded mb-3">
                                <h6>Address {index + 1}</h6>
                                <Form.Group className="mb-3">
                                    <Form.Label>Street</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={addresses.street}
                                        onChange={(e) => handleInputChange(e, 'street', index, 'addresses')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={addresses.city}
                                        onChange={(e) => handleInputChange(e, 'city', index, 'addresses')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={addresses.state}
                                        onChange={(e) => handleInputChange(e, 'state', index, 'addresses')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={addresses.zip}
                                        onChange={(e) => handleInputChange(e, 'zip', index, 'addresses')}
                                    />
                                </Form.Group>
                                <button
                                    type="button"
                                    className="btn btn-danger mb-3"
                                    onClick={() => deleteAddress(index)}
                                    disabled={formData.addresses.length <= 1}
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
                        {formData.credit_cards.map((card: any, index: number) => (
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
                                {/* <Form.Group className="mb-3">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={card.cvv}
                                        onChange={(e) => handleInputChange(e, 'cvv', index, 'creditCard')}
                                    />
                                </Form.Group> */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Billing Address</Form.Label>
                                    <Form.Select
                                        value={card.billingAddressId}
                                        onChange={(e) => handleInputChange(e, 'billingAddressId', index, 'creditCard')}
                                    >
                                        <option value="">Select Billing Address</option>
                                        {formData.addresses.map((addresses: any) => (
                                            <option key={addresses.addressId} value={addresses.addressId}>
                                                {addresses.street}, {addresses.city}, {addresses.state}, {addresses.zip}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <button
                                    type="button"
                                    className="btn btn-danger mb-3"
                                    onClick={() => deleteCreditCard(index)}
                                    disabled={formData.credit_cards.length <= 1}
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