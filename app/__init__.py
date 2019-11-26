from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_login import LoginManager

import pymysql

pymysql.install_as_MySQLdb()

db = SQLAlchemy()
login_manager = LoginManager()

login_manager.login_view = 'admin.login'


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)  # 后绑定

    # 国际化
    from flask_babelex import Babel
    Babel(app)

    login_manager.init_app(app)
    # 注册蓝图
    from app.api.v1 import create_blueprint_v1
    app.register_blueprint(create_blueprint_v1(), url_prefix='/api/v1')

    # 注册管理后台蓝图
    from app.admin import admin_page
    app.register_blueprint(admin_page, url_prefix='/admin')

    adm = Admin(app, name="订餐管理系统", template_mode='bootstrap3', base_template='admin/mybase.html')

    from app.models.member import Member
    from app.models.admin import User  # 管理员模型类
    from app.models.food import Category, Food  # 管理员模型类
    from app.admin.modelview import MyModelView, UModelview, FModelview
    adm.add_view(UModelview(User, db.session, name='管理员管理'))
    adm.add_view(MyModelView(Member, db.session, name='会员管理'))
    adm.add_view(MyModelView(Category, db.session, name='分类管理'))
    adm.add_view(FModelview(Food, db.session, name='食品管理'))


    return app
