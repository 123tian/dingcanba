class Config(object):
    DEBUG = True

    SECRET_KEY = 'yukdy%$^s%%^s'
    BABEL_DEFAULT_LOCALE = 'zh_Hans_CN'

class DevConfig(Config):
    App_ID = 'wx4503a4f6af272145'
    App_Secret = '72d978dac6a05ab2d8ce4a2419153a73'
    SQLALCHEMY_DATABASE_URI = 'mysql://root:123456@127.0.0.1:3306/db'
    # 数据库和模型类同步修改
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    # 查询时会显示原始SQL语句
    SQLALCHEMY_ECHO = True
    BASE_PIC_URL = "http://127.0.0.1:5000/static/"


class ProConfig(Config):
    DEBUG = False


mapping_config = {
    'dev': DevConfig,
    'pro': ProConfig
}
