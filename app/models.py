import enum
from sqlalchemy import JSON, Boolean, Column, Integer, String, Enum, ForeignKey, Date, DECIMAL
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    email = Column(String(255), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    job_title = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    user_type = Column(Enum("agent", "renter"), nullable=False)

    addresses = relationship("Address", back_populates="user", cascade="all, delete")
    credit_cards = relationship("CreditCard", back_populates="user", cascade="all, delete")
    renter_preferences = relationship("RenterPreference", back_populates="user", uselist=False)
    properties = relationship("Property", back_populates="owner", cascade="all, delete")  # Relationship to Property

class Address(Base):
    __tablename__ = "addresses"
    address_id = Column(String(255), primary_key=True, index=True)
    user_email = Column(String(255), ForeignKey("users.email", ondelete="CASCADE"), nullable=False)
    street = Column(String(255), nullable=False)
    city = Column(String(255), nullable=False)
    state = Column(String(255), nullable=False)
    zip = Column(String(20), nullable=False)

    user = relationship("User", back_populates="addresses")

class CreditCard(Base):
    __tablename__ = "credit_cards"
    card_id = Column(String(255), primary_key=True, index=True)
    user_email = Column(String(255), ForeignKey("users.email", ondelete="CASCADE"), nullable=False)
    number = Column(String(20), nullable=False)
    expiry = Column(Date, nullable=False)
    billing_address_id = Column(String(255), ForeignKey("addresses.address_id", ondelete="SET NULL"), nullable=True)

    user = relationship("User", back_populates="credit_cards")

class RenterPreference(Base):
    __tablename__ = "renter_preferences"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Ensure autoincrement is enabled
    user_email = Column(String(255), ForeignKey("users.email", ondelete="CASCADE"), nullable=False)
    move_in_start = Column(Date, nullable=True)
    move_in_end = Column(Date, nullable=True)
    preferred_city = Column(String(255), nullable=True)
    preferred_state = Column(String(255), nullable=True)
    budget_min = Column(DECIMAL(10, 2), nullable=True)
    budget_max = Column(DECIMAL(10, 2), nullable=True)

    user = relationship("User", back_populates="renter_preferences")

class Property(Base):
    __tablename__ = "properties"
    pid = Column(String(255), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    owner_email = Column(String(255), ForeignKey("users.email", ondelete="CASCADE"), nullable=False)
    type = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    street = Column(String(255), nullable=False)
    city = Column(String(255), nullable=False)
    state = Column(String(255), nullable=False)
    country = Column(String(255), nullable=False)
    zip_code = Column(String(20), nullable=False)
    property_type = Column(String(255), nullable=True)
    listing_type = Column(String(255), nullable=True)
    price = Column(Integer, nullable=False)
    rooms = Column(Integer, nullable=True)
    square_feet = Column(Integer, nullable=True)
    year_built = Column(Integer, nullable=True)
    additional_info = Column(JSON, nullable=True)
    property_image_url = Column(String(500), nullable=True)
    available = Column(Boolean, default=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    owner = relationship("User", back_populates="properties")  # Relationship to User


class BookingStatus(enum.Enum):
    booked = "booked"
    cancelled = "cancelled"

class Booking(Base):
    __tablename__ = "bookings"
    bid = Column(String(255), primary_key=True, index=True)  # Primary key for Booking
    pid = Column(String(255), ForeignKey("properties.pid"), nullable=False)
    email = Column(String(255), ForeignKey("users.email"), nullable=False)
    owner_email = Column(String(255), ForeignKey("users.email"), nullable=False)
    card_id = Column(String(255), ForeignKey("credit_cards.card_id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    price = Column(Integer, nullable=False)
    status = Column(Enum(BookingStatus), nullable=False)