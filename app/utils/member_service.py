import random
import string
import hashlib
import requests
from flask import current_app
class MemberService():
    @staticmethod
    def getSalt(len=16):
        str = [random.choice(string.ascii_letters + string.digits) for _ in range(1, len + 1)]

        ran_str = "".join(str)

        return ran_str


    @staticmethod
    def geneAuthCode(member=None):
        m = hashlib.md5()
        str = "%s-%s-%s" % (member.id, member.salt, member.status)
        m.update(str.encode("utf-8"))
        return m.hexdigest()


    @staticmethod
    def getOpenId(code):
        app_id = current_app.config.get('APP_ID')
        app_secret = current_app.config.get('APP_SECRET')
        url = 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code' % (
            app_id, app_secret, code)
        response = requests.get(url)
        opneid = response.json().get('openid')
        return opneid
