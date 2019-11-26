from flask_script import Manager
from config import mapping_config
from app import create_app, db
from flask_migrate import Migrate, MigrateCommand

app = create_app(mapping_config['dev'])
manager = Manager(app)
Migrate(app, db)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
