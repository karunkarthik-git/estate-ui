from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, DECIMAL
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