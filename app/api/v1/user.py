from app.libs.redprint import RedPrint
from app.models.member import Member,OauthMemberBind
from flask import Flask, request, jsonify,current_app
import re
from app import db
import requests
from app.utils.member_service import MemberService
api = RedPrint('/user', description='用户模块')

'api/v1/user/login'


@api.route('/login', methods=['POST'])
def login():
    ctx = {'code': 1, 'msg': "成功",'data': {}}
    nickname = request.form.get("nickname")


    gender = request.form.get("gender")
    avatarurl = request.form.get("avatarur")
    code = request.form.get("code")

    if not code or len(code) <1:
        ctx['code']  = -1
        ctx['msg'] = '获取openid出错'
        return jsonify(ctx)
    opneid  =MemberService.getOpenId(code)

    if not opneid:
        ctx['code'] = -1
        ctx['msg'] = 'code无效'
        return jsonify(ctx)
    app_id = current_app.config.get('APP_ID')
    app_secret= current_app.config.get('app_secret')
    ctx['data']['nickname'] = nickname

    url =  'https://api.weixin.qq.com/sns/jscode2session?appid=%swx4503a4f6af272145&secret=%s&js_code=%s&grant_type=authorization_code'%(code,app_id,app_secret)
    response = request.get(url)
    opneid = response.json().get('openid')

    oauthmemberbind = OauthMemberBind.query.filter_by(opneid=opneid).first()
    #存数据库

    if not oauthmemberbind:
        member = Member()
        member.nickname = nickname
        member.avatar =avatarurl
        member.gender =gender
        member.salt =MemberService.getSalt()
        db.session.add(member)
        db.session.commit()

        oauthmemberbind=  OauthMemberBind
        oauthmemberbind.openid = opneid
        oauthmemberbind.client_type = 'wx'
        oauthmemberbind.type = 1
        oauthmemberbind.member_id = member.id
        db.session.add(oauthmemberbind)
        db.session.commit()
        token = MemberService.geneAuthCode(member)
        ctx['data']['token'] = '%s#%s'%(member.id,token)
        return jsonify(ctx)

    else:
        member = Member.query.get(oauthmemberbind.member_id)
        token = MemberService.geneAuthCode(member)
        ctx['data']['token'] = '%s#%s' % (member.id, token)
        return jsonify(ctx)


@api.route('/cklogin',methods=['POST'])
def cklogin():
    ctx = {'code': 1, 'msg': "成功",'data': {}}
    code = request.form.get("code")
    if not code or len(code) <1:
        ctx['code']  = -1
        ctx['msg'] = 'code无效'
        return jsonify(ctx)

    openid = MemberService.getOpenId(code)

    if not openid:
        ctx['code'] = -1
        ctx['msg'] = '获取openid出'
        return jsonify(ctx)
    oauthmemberbind = OauthMemberBind.query.filter_by(opneid=opneid).first()
    if not oauthmemberbind:
        ctx['code'] = -1
        ctx['msg'] = '未登录过'
        return jsonify(ctx)
    member = Member.query.get(oauthmemberbind.member_id)
    token = MemberService.geneAuthCode(member)
    ctx['data']['token'] = '%s#%s' % (member.id, token)
    return jsonify(ctx)

