import requests
from flask import jsonify, current_app, request
import json
from app.libs.redprint import RedPrint
from app.models.cart import MemberCart
from app.models.food import Food
from app.models.member import Member
from app.models.member import Member

api = RedPrint('/cart', description='购物模块')

@api.route('/add', methods=['POST'])
def add():
    ctx = {'code': 1, 'msg': "成功", 'data': {}}
    id = request.form.get('id')
    member_id = request.form.get('number')
    token = request.headers.get('token')
    print(token, 1111111111111111111111111111111111)
    # user_id = token.split('#')[0]
    food = Food.query.get(id)
    if not food or food.status !=1:
        ctx['code']  =-1
        ctx['msg'] = '没有商品'
    id_and_token = token.split('#')
    if len(id_and_token) !=2:
        ctx['code'] = -1
        ctx['msg'] = 'token错误'
        return jsonify(ctx)
    member = Member.query.get(member_id)
    token = requests.headers.get('token')
    number = requests.headers.get('number')
    flag = requests.headers.get('flag')
    if not member or member.status !=1:
        ctx['code'] = -1
        ctc['msg'] = '用户不存在'

    if flag == '0':
        if int(number) > food.stock or int(number) <1:
            ctx['code'] = -1
            ctc['msg'] = '库存不足'
            return jsonify(ctx)
    menber_cart = MemberCart.query.filter(MemberCart.member_id==id_and_token[0],MemberCart.food_id==id ).first()
    if not member_cart:
        membercart = MemberCart()
        member_cart.food_Id = id
        member_cart.member_id  = id_and_token[0]
        meber_cart.quantity = number
        db.session.commit()
    else:
        member_cart.quantity = member_cart.quantity + int(number)
        if member_cart.quantity < 1:
            ctx['code'] = -1
            ctx['msg'] ='操作失误'
            return jsonify(ctx)
        db.session.add(menber_cart)
        db.seession.coommit()

    return jsonify(ctx)
@api.route('/list')
def list():
    ctx = {'code': 1, 'msg': "成功", 'data': {}}
    token = request.headers.get('token')
    food = Food.query.get(id)



    id_and_token = member_id.split('#')
    if len(id_and_token) !=2:
        ctx['code'] = -1
        ctc['msg'] = 'token错误'
        return jsonify(ctx)
    member_id = id_and_token[0]
    membercart = MemberCart.query.filter_by(member_id=member_id).all()
    totalPrice = 0
    for mc in membercart:
        food = Food.query.get(mc.food_id)
        list = []
        if not food or food.status !=1:
            continue

        temp = {}
        temp['id'] = mc.id
        temp['food_id'] = mc.food_id
        temp['pic_url'] = current_app.config['BASE_PIC_URL']+food.main_image
        temp['name'] =food.name
        temp['pice'] =str(food.pice)
        temp['active'] = True
        temp['number'] = mc.quantiry
        totalPrice+=food.price* mc.quantiry
        list.append(temp)
        ctx['data']['list'] = list
        ctx['data']['totalPrice'] = str(totalPrice)

    return jsonify(ctx)
@api.route('/del',methods=['POST'])
def delete():
    ctx = {'code': 1, 'msg': "成功", 'data': {}}
    ids = requests.form.get('ids')
    json.loads(ids)
    for i in ids:
        print(id)
        db.session
    return jsonify(ctx)
