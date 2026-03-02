from flask import Flask
from models import db
from extension import mail
from routes.contact import contact_bp
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Mail config (use app password later)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_DEFAULT_SENDER")

db.init_app(app)
mail.init_app(app)

app.register_blueprint(contact_bp)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)