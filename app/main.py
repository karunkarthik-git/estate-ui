from datetime import datetime
from typing import List
import uuid
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, Booking, User as UserModel, Address, CreditCard, RenterPreference, Property  # Use SQLAlchemy models
from app.schemas import BookingCreate, BookingSchema, PropertySchema, PropertyCreate, UserCreate, User  # Use Pydantic schemas for validation
from passlib.context import CryptContext

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (use specific origins in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility function to hash passwords
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Utility function to verify passwords
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the user's password before saving
    hashed_password = hash_password(user.password)

    new_user = UserModel(
        email=user.email,
        name=user.name,
        password=hashed_password,  # Store the hashed password
        user_type=user.user_type,
        phone=user.phone if user.user_type == "agent" else None,  # Include phone for agents
        job_title=user.job_title if user.user_type == "agent" else None,  # Include jobTitle for agents
        company=user.company if user.user_type == "agent" else None  # Include company for agents
    )
    db.add(new_user)
    db.commit()  # Commit the user first to ensure the email exists in the database
    db.refresh(new_user)

    # Add addresses
    for address in user.addresses:
        db.add(Address(
            user_email=new_user.email,
            street=address.street,
            city=address.city,
            state=address.state,
            zip=address.zip,
            address_id=address.addressId  # Map addressId to address_id
        ))

    # Add credit cards
    for card in user.credit_cards:
        db.add(CreditCard(
            user_email=new_user.email,
            number=card.number,
            expiry=card.expiry,
            billing_address_id=card.billingAddressId,
            card_id=card.cardId  # Map cardId to card_id
        ))

    # Add renter preferences if the user is a renter
    if user.user_type == "renter" and user.renter_preferences:
        db.add(RenterPreference(
            user_email=new_user.email,
            move_in_start=user.renter_preferences.move_in_start,
            move_in_end=user.renter_preferences.move_in_end,
            preferred_city=user.renter_preferences.preferred_city,
            preferred_state=user.renter_preferences.preferred_state,
            budget_min=user.renter_preferences.budget_min,
            budget_max=user.renter_preferences.budget_max
        ))

    db.commit()

    # Prepare the response
    response ={
        "email": new_user.email
    }

    return response

@app.post("/user/details")
async def get_user_details(request: Request, db: Session = Depends(get_db)):
    # Query the user by email
    body = await request.json()
    email = body.get("email")
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prepare the response
    response = {
        "name": user.name,
        "email": user.email,
        "user_type": user.user_type,
        "phone": user.phone,
        "job_title": user.job_title,
        "company": user.company,
        "addresses": [
            {
                "addressId": address.address_id,
                "street": address.street,
                "city": address.city,
                "state": address.state,
                "zip": address.zip
            }
            for address in user.addresses
        ],
        "credit_cards": [
            {
                "cardId": card.card_id,
                "number": card.number,
                "expiry": card.expiry.strftime("%Y-%m-%d"),
                "billingAddressId": card.billing_address_id
            }
            for card in user.credit_cards
        ],
        "renter_preferences": None
    }

    # Include renter preferences if the user is a renter
    if user.user_type == "renter" and user.renter_preferences:
        response["renter_preferences"] = {
            "move_in_start": user.renter_preferences.move_in_start.strftime("%Y-%m-%d"),
            "move_in_end": user.renter_preferences.move_in_end.strftime("%Y-%m-%d"),
            "preferred_city": user.renter_preferences.preferred_city,
            "preferred_state": user.renter_preferences.preferred_state,
            "budget_min": user.renter_preferences.budget_min,
            "budget_max": user.renter_preferences.budget_max
        }

    return response


@app.post("/login")
def login_user(request: dict, db: Session = Depends(get_db)):
    # Extract email and password from the request body
    email = request.get("email")
    password = request.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    # Query the user by email
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify the password
    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Prepare the response
    response = {
        "name": user.name,
        "email": user.email,
        "user_type": user.user_type,
        "phone": user.phone,
        "job_title": user.job_title,
        "company": user.company,
        "addresses": [
            {
                "addressId": address.address_id,
                "street": address.street,
                "city": address.city,
                "state": address.state,
                "zip": address.zip
            }
            for address in user.addresses
        ],
        "credit_cards": [
            {
                "cardId": card.card_id,
                "number": card.number,
                "expiry": card.expiry.strftime("%Y-%m-%d"),
                "billingAddressId": card.billing_address_id
            }
            for card in user.credit_cards
        ],
        "renter_preferences": None
    }

    # Include renter preferences if the user is a renter
    if user.user_type == "renter" and user.renter_preferences:
        response["renter_preferences"] = {
            "move_in_start": user.renter_preferences.move_in_start.strftime("%Y-%m-%d"),
            "move_in_end": user.renter_preferences.move_in_end.strftime("%Y-%m-%d"),
            "preferred_city": user.renter_preferences.preferred_city,
            "preferred_state": user.renter_preferences.preferred_state,
            "budget_min": user.renter_preferences.budget_min,
            "budget_max": user.renter_preferences.budget_max
        }

    return response

@app.put("/user/update")
def update_user_details(request: dict, db: Session = Depends(get_db)):
    # Extract email, addresses, and credit cards from the request body
    email = request.get("email")
    addresses = request.get("addresses", [])
    credit_cards = request.get("credit_cards", [])

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    # Query the user by email
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update addresses
    existing_addresses = {address.address_id: address for address in user.addresses}
    for address in addresses:
        if address["addressId"] in existing_addresses:
            # Update existing address
            existing_address = existing_addresses[address["addressId"]]
            existing_address.street = address["street"]
            existing_address.city = address["city"]
            existing_address.state = address["state"]
            existing_address.zip = address["zip"]
        else:
            # Add new address
            db.add(Address(
                user_email=email,
                street=address["street"],
                city=address["city"],
                state=address["state"],
                zip=address["zip"],
                address_id=address["addressId"]
            ))

    # Update credit cards
    existing_credit_cards = {card.card_id: card for card in user.credit_cards}
    for card in credit_cards:
        if card["cardId"] in existing_credit_cards:
            # Update existing credit card
            existing_card = existing_credit_cards[card["cardId"]]
            existing_card.number = card["number"]
            existing_card.expiry = card["expiry"]
            existing_card.billing_address_id = card["billingAddressId"]
        else:
            # Add new credit card
            db.add(CreditCard(
                user_email=email,
                number=card["number"],
                expiry=card["expiry"],
                billing_address_id=card["billingAddressId"],
                card_id=card["cardId"]
            ))

    db.commit()

    return {"message": "User details updated successfully"}

@app.post("/properties")
def create_property(property: PropertyCreate, db: Session = Depends(get_db)):
    property_id = str(uuid.uuid4())  # Ensure a unique UUID is generated for each property

    new_property = Property(
        pid=property_id,
        name=property.name,
        owner_email=property.owner_email,
        type=property.type,
        description=property.description,
        street=property.address.street,
        city=property.address.city,
        state=property.address.state,
        country=property.address.country,
        zip_code=property.address.zipCode,
        property_type=property.propertyDetails.propertyType,
        listing_type=property.propertyDetails.listingType,
        price=property.propertyDetails.price,
        rooms=property.propertyDetails.rooms,
        square_feet=property.propertyDetails.squareFeet,
        year_built=property.propertyDetails.yearBuilt,
        additional_info=property.propertyDetails.additionalInfo,
        property_image_url=property.propertyImageUrl,
        available=property.available,
        start_date=property.propertyDetails.startDate,  # Map startDate
        end_date=property.propertyDetails.endDate       # Map endDate
    )
    db.add(new_property)
    db.commit()
    db.refresh(new_property)
    return {"success": True, "property_id": new_property.pid}

@app.get("/properties", response_model=List[PropertySchema])
def get_properties(db: Session = Depends(get_db)):
    properties = db.query(Property).all()
    # Transform the SQLAlchemy model into the Pydantic schema
    response = [
        {
            "pid": property.pid,
            "name": property.name,
            "owner_email": property.owner_email,
            "type": property.type,
            "description": property.description,
            "address": {
                "street": property.street,
                "city": property.city,
                "state": property.state,
                "country": property.country,
                "zipCode": property.zip_code,
            },
            "propertyDetails": {
                "propertyType": property.property_type,
                "listingType": property.listing_type,
                "price": property.price,
                "rooms": property.rooms,
                "squareFeet": property.square_feet,
                "yearBuilt": property.year_built,
                "additionalInfo": property.additional_info,
                "startDate": property.start_date,  # Include startDate
                "endDate": property.end_date       # Include endDate
            },
            "propertyImageUrl": property.property_image_url,
            "available": property.available,
        }
        for property in properties
    ]
    return response

@app.put("/properties/{property_id}")
def update_property(property_id: str, property: PropertyCreate, db: Session = Depends(get_db)):
    existing_property = db.query(Property).filter(Property.pid == property_id).first()
    if not existing_property:
        raise HTTPException(status_code=404, detail="Property not found")

    # Update property details
    existing_property.name = property.name
    existing_property.type = property.type
    existing_property.description = property.description
    existing_property.street = property.address.street
    existing_property.city = property.address.city
    existing_property.state = property.address.state
    existing_property.country = property.address.country
    existing_property.zip_code = property.address.zipCode
    existing_property.property_type = property.propertyDetails.propertyType
    existing_property.listing_type = property.propertyDetails.listingType
    existing_property.price = property.propertyDetails.price
    existing_property.rooms = property.propertyDetails.rooms
    existing_property.square_feet = property.propertyDetails.squareFeet
    existing_property.year_built = property.propertyDetails.yearBuilt
    existing_property.additional_info = property.propertyDetails.additionalInfo
    existing_property.property_image_url = property.propertyImageUrl
    existing_property.available = property.available
    existing_property.start_date = property.propertyDetails.startDate  # Update startDate
    existing_property.end_date = property.propertyDetails.endDate      # Update endDate

    db.commit()
    db.refresh(existing_property)
    return {"success": True, "property_id": property_id}

@app.delete("/properties/{property_id}")
def delete_property(property_id: str, db: Session = Depends(get_db)):
    # Query the property by pid
    property = db.query(Property).filter(Property.pid == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    # Delete the property
    db.delete(property)
    db.commit()

    return {"success": True, "message": f"Property with id {property_id} has been deleted"}



@app.post("/bookings", response_model=BookingSchema)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    # Generate a unique ID for the booking
    booking_id = str(uuid.uuid4())
    start_date = datetime.strptime(booking.duration["start"], "%Y-%m").date()
    end_date = datetime.strptime(booking.duration["end"], "%Y-%m").date()

    property = db.query(Property).filter(Property.pid == booking.pid).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    # Set the property as unavailable
    property.available = False
    db.commit()

    booking.status = "booked"

    new_booking = Booking(
        bid=booking_id,  # Generate bid on the fly
        pid=booking.pid,
        email=booking.email,
        owner_email=booking.owner_email,
        card_id=booking.cardId,  # Map cardId to card_id
        start_date=start_date,
        end_date=end_date,
        price=booking.price,
        status=booking.status
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # Transform the response to match BookingSchema
    response = {
        "bid": new_booking.bid,
        "pid": new_booking.pid,
        "email": new_booking.email,
        "owner_email": new_booking.owner_email,
        "cardId": new_booking.card_id,
        "duration": {
            "start": new_booking.start_date.strftime("%Y-%m"),
            "end": new_booking.end_date.strftime("%Y-%m")
        },
        "price": new_booking.price,
        "status": new_booking.status
    }
    return response

@app.put("/bookings/{booking_id}/cancel", response_model=BookingSchema)
def update_booking(booking_id: str, db: Session = Depends(get_db)):
    existing_booking = db.query(Booking).filter(Booking.bid == booking_id).first()
    if not existing_booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Update booking details
    existing_booking.status = "cancelled"

    property = db.query(Property).filter(Property.pid == existing_booking.pid).first()
    if property:
        property.available = True
        db.commit()

    db.commit()
    db.refresh(existing_booking)

    # Transform the response to match BookingSchema
    response = {
        "bid": existing_booking.bid,
        "pid": existing_booking.pid,
        "email": existing_booking.email,
        "owner_email": existing_booking.owner_email,
        "cardId": existing_booking.card_id,
        "duration": {
            "start": existing_booking.start_date.strftime("%Y-%m"),
            "end": existing_booking.end_date.strftime("%Y-%m")
        },
        "price": existing_booking.price,
        "status": existing_booking.status
    }
    return response

@app.get("/bookings", response_model=List[BookingSchema])
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    response = [
        {
            "bid": booking.bid,
            "pid": booking.pid,
            "email": booking.email,
            "owner_email": booking.owner_email,
            "cardId": booking.card_id,  # Map card_id to cardId
            "duration": {
                "start": booking.start_date.strftime("%Y-%m"),  # Convert start_date to string
                "end": booking.end_date.strftime("%Y-%m")       # Convert end_date to string
            },
            "price": booking.price,
            "status": booking.status
        }
        for booking in bookings
    ]
    return response