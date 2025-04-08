import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // For generating unique address IDs
import { isAuthenticated } from '../utils';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState<'agent' | 'renter'>('renter');
    const [formData, setFormData] = useState<any>({
        name: '',
        email: '',
        password: '',
        address: [{ street: '', city: '', state: '', zip: '', addressId: uuidv4() }],
        creditCards: [{ number: '', expiry: '', cvv: '', billingAddressId: '', cardId: uuidv4() }],
        phone: '',
        jobTitle: '',
        company: '',
        moveInDate: { start: '', end: '' },
        preferredLocation: { city: '', state: '' },
        budget: { min: '', max: '' },
    });

    const handleInputChange = (e: any, field: string, index?: number, type?: any) => {
        if (type === 'address' && index !== undefined) {
            const updatedAddress = [...formData.address];
            updatedAddress[index][field] = e.target.value;
            setFormData({ ...formData, address: updatedAddress });
        } else if (type === 'creditCards' && index !== undefined) {
            const updatedCards = [...formData.creditCards];
            updatedCards[index][field] = e.target.value;
            setFormData({ ...formData, creditCards: updatedCards });
        } else if (field.includes('.')) {
            // Handle nested fields (e.g., moveInDate.start)
            const [parentField, childField] = field.split('.');
            setFormData({
                ...formData,
                [parentField]: {
                    ...formData[parentField],
                    [childField]: e.target.value,
                },
            });
        } else {
            // Handle top-level fields
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
        const payload = userType === 'agent'
            ? {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                address: formData.address,
                userType: 'agent',
                phone: formData.phone,
                jobTitle: formData.jobTitle,
                company: formData.company,
            }
            : {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                address: formData.address,
                userType: 'renter',
                moveInDate: formData.moveInDate,
                preferredLocation: formData.preferredLocation,
                budget: formData.budget,
                creditCards: formData.creditCards,
            };

        console.log('Final Payload:', payload);
        // Add API call here to submit the payload
        navigate('/home'); // Redirect to home after successful registration
    };

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/home'); // Redirect to home if already logged in
        }
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="register-container w-50">
                <h2 className="text-center mt-5 mb-4">Register</h2>
                <Form onSubmit={handleSubmit}>
                    <div className='p-3 border rounded mb-3'>
                        <h5 className='text-center'>User Information</h5>
                        <Form.Group className="mb-3">
                            <Form.Label>User Type</Form.Label>
                            <Form.Select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value as 'agent' | 'renter')}
                            >
                                <option value="renter">Renter</option>
                                <option value="agent">Agent</option>
                            </Form.Select>
                        </Form.Group>

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

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange(e, 'password')}
                            />
                        </Form.Group>
                    </div>

                    {/* Address Fields */}
                    {formData.address.map((address: any, index: number) => (
                        <div key={address.addressId} className='p-3 border rounded mb-3'>
                            <h5>Address {index + 1}</h5>
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
                    <button type="button" className="btn btn-secondary mb-3" onClick={addAddress} disabled={formData.address.length >= 3}>  
                        Add Address
                    </button>

                    {/* Conditional Fields for Agent */}
                    {userType === 'agent' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange(e, 'phone')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Job Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={(e) => handleInputChange(e, 'jobTitle')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Company</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => handleInputChange(e, 'company')}
                                />
                            </Form.Group>
                        </>
                    )}

                    {/* Conditional Fields for Renter */}
                    {userType === 'renter' && (
                        <div className='p-3 border rounded mb-3'>
                            <h5>Rental Preferences</h5>
                            <Form.Group className="mb-3">
                                <Form.Label>Move-In Date Start</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.moveInDate.start}
                                    onChange={(e) => handleInputChange(e, 'moveInDate.start')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Move-In Date End</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.moveInDate.end}
                                    onChange={(e) => handleInputChange(e, 'moveInDate.end')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Preferred Location (City)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.preferredLocation.city}
                                    onChange={(e) => handleInputChange(e, 'preferredLocation.city')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Preferred Location (State)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.preferredLocation.state}
                                    onChange={(e) => handleInputChange(e, 'preferredLocation.state')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Budget Min</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.budget.min}
                                    onChange={(e) => handleInputChange(e, 'budget.min')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Budget Max</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.budget.max}
                                    onChange={(e) => handleInputChange(e, 'budget.max')}
                                />
                            </Form.Group>
                            {formData.creditCards.map((card: any, index: number) => (
                                <div key={index} className='p-3 border rounded mb-3'>
                                    <h5>Credit Card {index + 1}</h5>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Card Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={card.number}
                                            onChange={(e) => handleInputChange(e, 'number', index, 'creditCards')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Expiry</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={card.expiry}
                                            onChange={(e) => handleInputChange(e, 'expiry', index, 'creditCards')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={card.cvv}
                                            onChange={(e) => handleInputChange(e, 'cvv', index, 'creditCards')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Billing Address</Form.Label>
                                        <Form.Select
                                            value={card.billingAddressId}
                                            onChange={(e) => handleInputChange(e, 'billingAddressId', index, 'creditCards')}
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
                            <button type="button" className="btn btn-secondary mb-3" onClick={addCreditCard} disabled={formData.creditCards.length >= 3}>
                                Add Credit Card
                            </button>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100">
                        Register
                    </button>
                </Form>
            </div>
        </div>
    );
};

export default Register;