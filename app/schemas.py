from datetime import date
from enum import Enum
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class AddressBase(BaseModel):
    street: str
    city: str
    state: str
    zip: str
    addressId: str

class AddressCreate(AddressBase):
    pass

class Address(AddressBase):
    class Config:
        orm_mode = True

class CreditCardBase(BaseModel):
    number: str
    expiry: str
    billingAddressId: Optional[str]
    cardId: str

class CreditCardCreate(CreditCardBase):
    pass

class CreditCard(CreditCardBase):
    class Config:
        orm_mode = True

class RenterPreferenceBase(BaseModel):
    move_in_start: Optional[str]
    move_in_end: Optional[str]
    preferred_city: Optional[str]
    preferred_state: Optional[str]
    budget_min: Optional[float]
    budget_max: Optional[float]

class RenterPreferenceCreate(RenterPreferenceBase):
    pass

class RenterPreference(RenterPreferenceBase):
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    name: str
    email: EmailStr
    user_type: str

class UserCreate(UserBase):
    password: str
    addresses: List[AddressCreate]
    credit_cards: List[CreditCardCreate]
    renter_preferences: Optional[RenterPreferenceCreate]
    phone: Optional[str]
    job_title: Optional[str]
    company: Optional[str]

class User(UserBase):
    addresses: List[Address]
    credit_cards: List[CreditCard]
    renter_preferences: Optional[RenterPreference]

    class Config:
        orm_mode = True

class PropertyLocation(BaseModel):  # Renamed from PropertyAddress
    street: str
    city: str
    state: str
    country: str
    zipCode: str

class PropertyDetails(BaseModel):
    propertyType: Optional[str]
    listingType: Optional[str]
    price: int
    rooms: Optional[int]
    squareFeet: Optional[int]
    yearBuilt: Optional[int]
    additionalInfo: Optional[List[str]]
    startDate: Optional[date]  # New field for start date
    endDate: Optional[date]

class PropertyCreate(BaseModel):
    pid: str
    name: str
    owner_email: str
    type: str
    description: Optional[str]
    address: PropertyLocation  # Updated to use the renamed schema
    propertyDetails: PropertyDetails
    propertyImageUrl: Optional[str]
    available: bool

class PropertySchema(PropertyCreate):  # Renamed from Property
    owner_email: str
    class Config:
        orm_mode = True

class BookingStatus(str, Enum):
    booked = "booked"
    cancelled = "cancelled"

class BookingCreate(BaseModel):
    pid: str
    email: str
    owner_email: str
    cardId: str
    duration: dict
    price: int
    status: BookingStatus

class BookingSchema(BaseModel):
    bid: str  # Include bid in the response
    pid: str
    email: str
    owner_email: str
    cardId: str
    duration: dict  # Transform start_date and end_date into a duration dictionary
    price: int
    status: BookingStatus

    class Config:
        orm_mode = True