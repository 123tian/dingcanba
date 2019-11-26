from flask import Blueprint
from . import user,food,cart,address


def create_blueprint_v1():
    bp_v1 = Blueprint('v1', __name__)

    # 把红图持有的路由给蓝图
    user.api.register(bp_v1)
    food.api.register(bp_v1)
    cart.api.register(bp_v1)
    address.api.register(bp_v1)

    return bp_v1
