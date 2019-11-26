from app.libs.redprint import RedPrint
from app.models.food import Food,Category
from flask import Flask, request, jsonify,current_app
import re
from app import db
import requests
from app.utils.member_service import MemberService
from app.models.cart import MemberCart
api = RedPrint('/food', description='食品模块')
import time
@api.route('/index')
def index():
    ctx = {'code': 1, 'msg': "成功", 'data': {}}
    banner_foods = Food.query.order_by(Food.month_count.desc()).limit(3).all()
    banners = []
    for food in banner_foods:
        tmep = {}
        tmep['id'] = food.id
        tmep['pic_url']  = current_app.config.get('BASE_PIC_URL')+food.main_image
        banners.append(tmep)
    ctx['data']['banners'] = banners
    # categorys = Category.query.filter_by(status=1).order_by(Category.weight.desc()).all()
    cat_all = Category.query.filter_by(status=1).order_by(Category.weight.desc()).all()
    categories = []
    categories.append({'id': 0,'name':"全部 "})
    for cat in cat_all:
        temp = {}
        temp['id'] = cat.id
        temp['name'] = cat.name
        banners.append(temp)
        ctx['data']['categories'] = categories
        return jsonify(ctx)


@api.route('/all')
def all():
    ctx = {'code': 1, 'msg': "成功", 'data': {}}
    foods = Food.query.filter_by(status=1)
    cid = request.args.get('cid')
    page = int(request.args.get('page'))
    pagesize = 1
    offset = (page - 1) * pagesize

    if cid!='0':
        foods = foods.filter_by(cat_id=cid).offset(offset).limit(1).all()
    else:
        foods = foods.offset(offset).limit(1).all()
    goods = []
    for food in foods:
        temp = {}
        temp['id']  = food.id
        temp['name']  = food.name
        temp['min_price']  = str(food.price)
        temp['price']  = str(food.price)
        temp['pic_url']  = current_app.config.get('BASE_PIC_URL')+food.main_image
        goods.append(temp)

        if len(foods) < pagesize:
            ctx['data'] ['ismore'] = 0
        else:
            ctx['data']['ismore']  = 1
    ctx['data']['goods'] = goods
    time.sleep(5)
    return jsonify(ctx)

@api.route('/info')
def info():
    ctx = {'code':1,'msg':"成功",'data':{}}
    id = request.args.get('id')
    food = Food.query.get(id)
    if food:
        info = {}
        info['id'] = food.id
        info['name'] = food.name
        info['summary'] = food.summary
        info['total_count'] = food.total_count
        info['comment_count'] = food.comment_count
        info['stock'] = str(food.stock)
        info['main_imge'] = current_app.confing.get['BASE_PIC_URL']+food.main_image
        info['pics'] = [current_app.confing.get('BASE_PIC_URL')+food.main_image,current_app.config.get('BASE_PIC_URL')+food.main_image]
        ctx['data']['info'] = info
    return jsonify(ctx)