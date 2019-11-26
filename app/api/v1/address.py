import requests
from flask import jsonify, current_app
import json
from app import db
from app.libs.redprint import RedPrint
from app.models.cart import MemberCart
from app.models.address import MemberAddress
from app.models.member import Member
api = RedPrint('/address', description='地址模块')

@api.route('/set',methods = ['POST'])
def set():

    ctx = {'code': 1, 'msg': "成功", 'data': {}}
    token = requests.headers.get('token')
    id_and_token = token.split('#')
    if len(id_and_token) != 2:
        ctx['code'] = -1
        ctx['msg'] = 'token错误'
        return jsonify(ctx)
    nickname = requests.form.get('nickname')
    mobile = requests.form.get('mobile')
    province_id = requests.form.get('province_id')
    province_str = requests.form.get('province_str')
    city_str = requests.form.get('city_str')
    city_id = requests.form.get('city_id')
    area_id = requests.form.get('area_id')
    area_str = requests.form.get('area_str')
    address = requests.form.get('address`')

    member = Member.query.get(id_and_token[0])
    if not member or member.status!=1:
        ctx['code'] = -1
        ctx['msg'] = '用户错误'
        return jsonify(ctx)
    num = MemberAddress.query.filter_by(member_id=member.id)
    memberaddress = MemberAddress()
    memberaddress.member_id = member.id
    memberaddress.nickname = nickname
    memberaddress.mobile = mobile
    memberaddress.province_id = province_id
    memberaddress.province_str = province_str
    memberaddress.city_id = city_id
    memberaddress.city_str = city_str
    memberaddress.area_id = area_id
    memberaddress.area_str = area_str
    memberaddress.address = address

    if num == 0:
        memberaddress.is_default = 1
    else:
        memberaddress.is_default = 0
        db.session(memberaddress)
        db.commit()
        return jsonify(ctx)


    return jsonify(ctx)