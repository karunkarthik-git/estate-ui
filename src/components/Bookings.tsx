import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { BASE_URL, getProperties } from "../utils";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";

const Bookings = () => {
    const [userInfo, setUserInfo] = useState<any>();
    const [bookings, setBookings]: any = useState([]);
    const [properties, setProperties]: any = useState([]);

    const handleBookingCancel = (booking: any) => {
            // Confirm deletion
            if (!window.confirm("Are you sure you want to cancel this booking?")) {
                return;
            }
            fetch(`${BASE_URL}/bookings/${booking.bid}/cancel`, {
                method: "PUT",
            })
                .then((response) => {
                    if (response.ok) {
                        getBookings(); // Refresh the property list after deletion
                        console.log("Booking deleted successfully");
                    } else {
                        console.error("Error deleting booking:", response.statusText);
                    }
                })
                .catch((error) => {
                    console.error("Error deleting booking:", error);
                });
        };

    const getBookings = () => {
        fetch(`${BASE_URL}/bookings`)
            .then((response) => response.json())
            .then((data) => {
                setBookings(data);
            })
            .catch((error) => {
                console.error("Error fetching properties:", error);
            });
    }

    useEffect(() => {
            let data = localStorage.getItem("userInfo");
            if (data) {
                data = JSON.parse(data);
                setUserInfo(data);
            }
        }, [])
    

    useEffect(() => {
        getBookings();
        getProperties().then((data) => {
            setProperties(data);
        }
        ).catch((error) => {
            console.error("Error fetching properties:", error);
        });
    }, [])


    const getValidBookings = () => {
        const combinedData = bookings.filter((booking) => {
            if (userInfo?.user_type === "agent") {
                return booking.owner_email === userInfo?.email;
            } else {
                return booking.email === userInfo?.email;
            }
        }).map((booking: any) => {
            const property = properties.find((property: any) => property.pid === booking.pid);
            return {
                ...booking,
                propertyDetails: property,
            };
        });
        combinedData.sort((a: any, b: any) => b.bid.localeCompare(a.bid));
        return combinedData;        
    }

    return (
        <div>
            <NavBar />
            <div className="container mt-4">
                <span className="d-flex justify-content-center align-items-center">
                    <h1 className="text-center mb-4">Bookings</h1>
                </span>
                <div>
                    {getValidBookings().map((item, index) => {
                        return (<Card id={index} className="m-5">
                            <Card.Header>{item.propertyDetails?.name}</Card.Header>
                            <Card.Body>
                                <div className="blockquote mb-0">
                                    <Container>
                                        <Row>
                                            <Col>
                                                <Image src={item.propertyDetails?.propertyImageUrl}/>
                                            </Col>
                                            <Col><p>
                                                {item.propertyDetails?.price}
                                            </p>
                                                <p>
                                                    {item.duration?.start} - {item.duration?.end}
                                                </p>
                                                <p>
                                                    {item.price}
                                                </p>
                                                <p>{item.status}</p>
                                                </Col>
                                        </Row>
                                    </Container>
                                    {item.status != 'cancelled' ? <div className="d-flex flex-row-reverse mr-2">
                                        <Button variant="primary" onClick={() => handleBookingCancel(item)}>Cancel</Button>
                                    </div> : <></>}
                                </div>
                            </Card.Body>
                        </Card>)
                    })}
                </div>    </div>

        </div >
    );
}
export default Bookings;