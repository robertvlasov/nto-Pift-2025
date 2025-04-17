from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from app.database import SessionLocal, engine
from app import models, crud, schemas,utils
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Регистрация пользователя
@app.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(utils.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# Авторизация пользователя
@app.post("/auth/login", response_model=schemas.Token)
def login(user: schemas.UserCreate, db: Session = Depends(utils.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not utils.pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utils.create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Получение списка транзакций
@app.get("/transactions/", response_model=List[schemas.Transaction])
def read_transactions(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(utils.get_db),
):
    # if current_user.is_operator:
    #     transactions = crud.get_transactions(db, skip=skip, limit=limit)
    # else:
    #     transactions = db.query(models.Transaction).filter(
    #         models.Transaction.owner_id == current_user.id
    #     ).offset(skip).limit(limit).all()
    # return transactions
    transactions = crud.get_transactions(db, skip=skip, limit=limit)
    return transactions

# Изменение статуса транзакции
@app.post("/transactions/{transaction_id}/verdict")
def update_verdict(
    transaction_id: int, 
    verdict: schemas.Verdict,
    db: Session = Depends(utils.get_db),
    current_user: models.User = Depends(utils.get_current_user)
):
    if not current_user.is_operator:
        raise HTTPException(status_code=403, detail="Only operators can update verdicts")
    
    transaction = crud.update_transaction_verdict(db, transaction_id, verdict.is_fraud)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Отправляем уведомление в Telegram
    message = f"🚨 Fraud alert!\nTransaction ID: {transaction_id}\nAmount: {transaction.amount}\nVerdict: {'Fraud' if verdict.is_fraud else 'Legitimate'}"
    utils.send_telegram_notification(message)
    
    # Блокируем пользователя, если это мошенничество
    if verdict.is_fraud:
        user = crud.get_user(db, transaction.owner_id)
        if user:
            user.is_blocked = True
            db.commit()
            db.refresh(user)
            return {"message": "User is blocked", "is_blocked": True}
    
    return {"message": "Verdict updated", "is_blocked": False}

# Отправка уведомления оператору
@app.post("/notifications/alert")
def send_notification(
    notification: schemas.NotificationCreate,
    db: Session = Depends(utils.get_db),
    current_user: models.User = Depends(utils.get_current_user)
):
    if not current_user.is_operator and notification.operator_id is None:
        raise HTTPException(
            status_code=403, 
            detail="Clients can only send notifications to specific operators"
        )
    
    # Отправляем уведомление в базу данных
    db_notification = crud.create_notification(db, notification)
    
    # Отправляем уведомление в Telegram
    operator_msg = f"🔔 New notification\nFrom: {current_user.username}\nMessage: {notification.message}"
    utils.send_telegram_notification(operator_msg)
    
    return {"status": "success"}

# Получение текущего пользователя
@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(utils.get_current_user)):
    return current_user