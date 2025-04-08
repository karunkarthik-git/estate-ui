from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, User as UserModel, Address, CreditCard, RenterPreference  # Use SQLAlchemy models
from app.schemas import UserCreate, User  # Use Pydantic schemas for validation
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
            cvv=card.cvv,
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