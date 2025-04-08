import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateBooking: React.FC<{ propertyInfo?: any }> = ({ propertyInfo }) => {
    const [userInfo, setUserInfo] = useState<any>();
    const navigate = useNavigate();
    const propertyPrice = propertyInfo?.price;
    const [formData, setFormData] = useState<any>({
        pid: propertyInfo?.pid || '',
        name: propertyInfo?.name || '',
        email: userInfo?.email || '',
        cardId: '',
        duration: {
            start: '',
            end: '',
        },
        price: '',
    });

    useEffect(() => {
        let data: any = localStorage.getItem("userInfo");
        if (data) {
            data = JSON.parse(data);
            setUserInfo(data);
            setFormData((prev: any) => ({
                ...prev,
                email: data.email,
            }));
        }
    }, [])

    useEffect(() => {
        if (propertyInfo) {
            setFormData((prev: any) => ({
                ...prev,
                pid: propertyInfo.pid,
                name: propertyInfo.name
            }));
        }
    }, [propertyInfo]);

    useEffect(() => {
        const { start, end } = formData.duration;
        if (start && end) {
            const startDate = new Date(`${start}-01`);
            const endDate = new Date(`${end}-01`);
            if (endDate > startDate) {
                const timeDiff = endDate.getTime() - startDate.getTime();
                const weeks = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7)); // Convert milliseconds to weeks
                const totalPrice = weeks * propertyPrice;
                setFormData((prev: any) => ({
                    ...prev,
                    price: totalPrice,
                }));
            } else {
                setFormData((prev: any) => ({
                    ...prev,
                    price: 0, // Reset price if dates are invalid
                }));
            }
        }
    }, [formData.duration.start, formData.duration.end, propertyPrice]);

    const handleInputChange = (
        e: any,
        field: string,
        parentField?: string
    ) => {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Final Booking Data:', formData);
        alert('Booking created successfully!');
        navigate('/bookings'); // Redirect to bookings page
    };

    return (
        <div className="create-booking-container w-100 p-4 border rounded">
            <Form onSubmit={handleSubmit}>
                <div className="p-3 border rounded mb-3">
                    <h5 className="text-center">Booking Information</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Property Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.name}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={formData.email}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Payment Method (Credit Card)</Form.Label>
                        <Form.Select
                            value={formData.cardId}
                            onChange={(e) => handleInputChange(e, 'cardId')}
                        >
                            <option value="">Select a Credit Card</option>
                            {userInfo?.credit_cards?.map((card) => (
                                <option key={card.cardId} value={card.cardId}>
                                    {`**** **** **** ${card.number.slice(-4)} (Expiry: ${card.expiry})`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>

                <div className="p-3 border rounded mb-3">
                    <h5 className="text-center">Rental Duration</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="month"
                            value={formData?.duration?.start}
                            onChange={(e) => handleInputChange(e, 'start', 'duration')}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="month"
                            value={formData?.duration?.end}
                            onChange={(e) => handleInputChange(e, 'end', 'duration')}
                            isInvalid={formData?.duration?.end && formData?.duration?.start && new Date(`${formData?.duration?.end}-01`) <= new Date(`${formData?.duration?.start}-01`)}
                        />
                        <Form.Control.Feedback type="invalid">
                            End date must be after the start date.
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>

                <div className="p-3 border rounded mb-3">
                    <h5 className="text-center">Price</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Total Price</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.price}
                            readOnly
                        />
                    </Form.Group>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    {'Create Booking'}
                </button>
            </Form>
        </div>
    );
};

export default CreateBooking;