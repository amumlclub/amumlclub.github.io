from flask import Blueprint, request, jsonify
from models import db, ContactSubmission
from extension import mail
from flask_mail import Message
import re

contact_bp = Blueprint('contact', __name__)

def is_valid_email(email):
    pattern = r"[^@]+@[^@]+\.[^@]+"
    return re.match(pattern, email)

@contact_bp.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    subject = data.get("subject", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not subject or not message:
        return jsonify({"error": "All fields are required"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    submission = ContactSubmission(
        name=name,
        email=email,
        subject=subject,
        message=message,
        ip_address=request.remote_addr
    )

    db.session.add(submission)
    db.session.commit()

    # Send email notification
    try:
        msg = Message(
            subject=f"New Contact: {subject}",
            recipients=["yourclubemail@gmail.com"]
        )

        msg.body = f"""
New contact submission:

Name: {name}
Email: {email}
Subject: {subject}
Message:
{message}

IP: {request.remote_addr}
        """

        mail.send(msg)

    except Exception as e:
        return jsonify({"error": "Saved but email failed"}), 500

    return jsonify({"success": "Message received successfully"}), 200