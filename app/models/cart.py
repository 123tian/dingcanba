from app.models.basemodel import BaseModel
from app import db


class MemberCart(BaseModel, db.Model):
    __tablename__ = 'member_cart'

    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('tbl_member.id'), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey('food.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=0)  # 数量