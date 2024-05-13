from flask import Flask, request, jsonify,send_file
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import LargeBinary
from flask_cors import CORS
from urllib.parse import quote_plus  
from sqlalchemy import or_, and_
from processing import process_image
import traceback
import tempfile
import os
import json
import uuid
import base64
from pdf2image import convert_from_path
from pdf2image import convert_from_bytes
from flask_mail import Mail, Message
from traceback import format_exc
from sqlalchemy import func
from io import BytesIO
from PIL import Image
import numpy as np
import cv2
import io
import requests
poppler_path = r"C:\Users\User\Downloads\Release-23.11.0-0\poppler-23.11.0\Library\bin" # Adjust this path
app = Flask(__name__)

from flask import request, jsonify

from flask import request, jsonify
import json
# Replace 'your_database' and 'your_username' with your actual database name and username
database_name = 'bpa'
username = 'root'
password = 'padma@2002'

# Encode the password
encoded_password = quote_plus(password)

# Set the SQLALCHEMY_DATABASE_URI with the encoded password
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{username}:{encoded_password}@localhost/{database_name}'
app.config['MAIL_DEBUG'] = True
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'billbuddy002@gmail.com'
app.config['MAIL_PASSWORD'] = 'bxgj srmj whss wetp'
app.config['MAIL_DEFAULT_SENDER'] = 'billbuddy002@gmail.com'
# app.config['MAX_CONTENT_LENGTH'] = 16* 1024 * 1024 

mail=Mail(app)
db = SQLAlchemy(app)
CORS(app)


#----------------------------------------------------------------------------------
class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    registration_type = db.Column(db.String(50), nullable=False)
    company_name = db.Column(db.String(100))
    company_establishment_date = db.Column(db.String(20))
    phone_number = db.Column(db.String(15))
    email = db.Column(db.String(50))
    branch_location = db.Column(db.String(100))
    company_address = db.Column(db.String(100))
    password = db.Column(db.String(50))
    username = db.Column(db.String(50))

    customer_name = db.Column(db.String(100))
    customer_contact_number = db.Column(db.String(15))
    customer_email = db.Column(db.String(50))
    customer_password = db.Column(db.String(50))
    customer_username = db.Column(db.String(50))

    freelancer_name = db.Column(db.String(100))  # Add these fields
    freelancer_contact_number = db.Column(db.String(15))
    freelancer_email = db.Column(db.String(50))
    freelancer_password = db.Column(db.String(50))
    freelancer_username = db.Column(db.String(50))

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(200))
    issue_date = db.Column(db.String(50))
    due_date = db.Column(db.String(50))
    address = db.Column(db.String(2000))
    billed_to = db.Column(db.String(2000), nullable=False)
    phone = db.Column(db.String(2000))
    email = db.Column(db.String(200))  # <-- Add this line
    ship_name = db.Column(db.String(200))
    total = db.Column(db.String(200))
    country = db.Column(db.String(200))  # <-- Add this line
    acc_number = db.Column(db.String(200))
    acc_name = db.Column(db.String(200))
    payment = db.Column(db.String(200))
    payment_status = db.Column(db.String(20),default="Not Paid")
    image_data = db.Column(db.BLOB)
    username=db.Column(db.String(200))

class ContactUsMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    message = db.Column(db.String(255))  # Adjust the length as needed

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    rating = db.Column(db.String(10))
    message = db.Column(db.Text)

class Invoice_generator(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    invoiceId=db.Column(db.String(100), unique=True)
    freelancer_username = db.Column(db.String(100))
    logo = db.Column(db.BLOB)
    invoice_number = db.Column(db.String(100))
    issue_date = db.Column(db.String(100))
    due_date = db.Column(db.String(100))
    client_name = db.Column(db.String(100))
    client_address = db.Column(db.String(100))
    client_email = db.Column(db.String(100))
    country = db.Column(db.String(100))
    client_phone = db.Column(db.String(100))
    
    payment_method = db.Column(db.String(100))
    payment_information = db.Column(db.String(100))
    total = db.Column(db.String(100))
    note = db.Column(db.String(1000))
    item=db.Column(db.String(10000))
    invoice_image=db.Column(db.BLOB)
#----------------------------------------------------------------------------

def compress_image(image_data):
    img = Image.open(io.BytesIO(image_data))
    img = img.convert("RGB")

    # Compress the image to a lower quality
    img = img.resize((img.width, img.height))
    img_byte_array = io.BytesIO()
    img.save(img_byte_array, format='JPEG', quality=60)

    return img_byte_array.getvalue()


def convert_pdf_to_images(pdf_content):
    # Create a BytesIO object to simulate a file-like object from the content
    pdf_file = BytesIO(pdf_content)

    # Use convert_from_bytes instead of convert_from_path
    images = convert_from_bytes(pdf_file.read(), fmt="png")

    return images

#-----------------------------------------------------------------------------
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        print('Received registration data:', data)
        registration_type = data.get('registrationType')

        if registration_type == 'organization':
            new_registration = Registration(
                registration_type='organization',
                company_name=data.get('companyName'),
                company_establishment_date=data.get('companyEstablishmentDate'),
                phone_number=data.get('phoneNumber'),
                branch_location=data.get('branchLocation'),# Include branch location here
                email=data.get('email'),
                company_address=data.get('companyAddress'),
                password=data.get('password'),
                username=data.get('username'),
            )
       
        elif registration_type == 'customer':
            new_registration = Registration(
                registration_type='customer',
                customer_name=data.get('customerName'),
                customer_contact_number=data.get('customerContactNumber'),
                customer_email=data.get('customerEmail'),
                customer_password=data.get('password'),
                customer_username=data.get('customerUsername'),
            )
        elif registration_type == 'freelancer':
            new_registration = Registration(
                registration_type='freelancer',
                freelancer_name=data.get('freelancerName'),
                freelancer_contact_number=data.get('freelancerContactNumber'),
                freelancer_email=data.get('freelancerEmail'),
                freelancer_password=data.get('password'),
                freelancer_username=data.get('freelancerUsername'),
            )
        else:
            return jsonify({'message': 'Invalid registration type'}), 400

        db.session.add(new_registration)
        db.session.commit()

        return jsonify({'message': 'Registration successful'})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Registration failed'}), 500


#---------------------------------------------------------------------------------
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        print('Received login data:', data) 

        # Check for admin login
        if data['username'] == 'admin' and data['password'] == 'pass':
            response_data = {
                'message': 'Admin login successful',
                'userType': 'admin'
            }
            return jsonify(response_data)

        # Retrieve user based on username or email
        user = Registration.query.filter(
            ((Registration.username == data['username']) & (Registration.registration_type == 'organization')) |
            ((Registration.customer_username == data['username']) & (Registration.registration_type == 'customer'))|
            ((Registration.freelancer_username == data['username']) & (Registration.registration_type == 'freelancer'))
        ).first()




        if user:
            print('Stored password:', user.password if user.registration_type != 'freelancer' else user.freelancer_password)
    
            # Check the correct attribute based on registration type
            stored_password = (
                user.password if user.registration_type == 'organization' else
                user.customer_password if user.registration_type == 'customer' else
                user.freelancer_password if user.registration_type == 'freelancer' else
                None
            )

            if stored_password and stored_password == data['password']:
                response_data = {
                    'message': 'Login successful',
                    'userType': user.registration_type
                }
                return jsonify(response_data)
            else:
                return jsonify({'message': 'Invalid password'}), 401
        else:
            return jsonify({'message': 'User not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'message': 'Login failed. Please try again.'}), 500


#----------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/checkUsername/<username>', methods=['GET'])
def check_username(username):
    registration_type = request.args.get('registrationType')
    user = Registration.query.filter(
        (
            (Registration.username == username) & (Registration.registration_type == 'organization')
        ) |
        (
            (Registration.customer_username == username) & (Registration.registration_type == 'customer')
        ) |
        (
            (Registration.freelancer_username == username) & (Registration.registration_type == 'freelancer')
        )
    ).first()

    is_username_available = user is None
    return jsonify({'isUsernameAvailable': is_username_available})



#-------------------------------------------------------------------------------------------------------------------------------------
@app.route('/contact', methods=['GET'])
def contact_form():
    return render_template('contact_form.html')

#---------------------------------------------------------------------------------
@app.route('/contact-us', methods=['POST'])
def submit_contact_form():
    try:
        data = request.json

        new_message = ContactUsMessage(
            name=data['name'],
            email=data['email'],
            message=data['message'],  # Updated field name
        )

        db.session.add(new_message)
        db.session.commit()

        response_data = {'message': 'Contact form submitted successfully'}
        return jsonify(response_data)
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to submit contact form. Please try again.'}), 500

#---------------------------------------------------------------------------------
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.all()
    reviews_data = [{'id': review.id, 'name': review.name, 'rating': review.rating, 'message': review.message} for review in reviews]
    return jsonify({'reviews': reviews_data})

# Route to submit a new review
#---------------------------------------------------------------------------------
@app.route('/api/reviews', methods=['POST'])
def submit_review():
    try:
        data = request.form
        print("Received data:", data)  # Add this line for debugging
        name = data['name']
        rating = int(data['rating'])
        message = data['message']

        # Create a new Review object
        new_review = Review(
            name=name,
            rating=rating,
            message=message,
        )

        # Add and commit the new review to the database
        db.session.add(new_review)
        db.session.commit()

        response_data = {'review': {'id': new_review.id, 'name': new_review.name, 'rating': new_review.rating, 'message': new_review.message}}
        return jsonify(response_data)

    except Exception as e:
        print("Error:", e)  # Add this line for debugging
        return jsonify({'message': 'Error submitting review'}), 500
#---------------------------------------------------------------------------------
def get_client_invoices(client_name, issue_date):
    try:
        # Query invoices directly based on the provided 'client_name' and 'issue_date'
        invoices = Invoice.query.filter_by(billed_to=client_name, issue_date=issue_date).all()

        return invoices
    except Exception as e:
        print(e)
        return []  # Handle exceptions as needed

#---------------------------------------------------------------------------------
@app.route('/get-client-invoices', methods=['POST'])
def get_client_invoices_endpoint():
    data = request.json
    client_name = data.get('clientName')
    issue_date = data.get('issueDate')

    try:
        # Query invoices directly based on the provided client_name and issue_date
        invoices = get_client_invoices(client_name, issue_date)

        # Extract invoice details from the invoices
        invoices_data = [
            {
                'invoiceNumber': invoice.invoice_number,
                'issueDate': invoice.issue_date,  # Include other relevant attributes
                'address': invoice.address,
                'billedTo': invoice.billed_to,
                'username':invoice.username,
                # Add other details as needed
            }
            for invoice in invoices
        ]

        print('Invoices Data:', invoices_data)

        email = get_client_email(client_name)
        print("Email",email)
        return jsonify({
            'email': email,
            'invoices': invoices_data,
            'invoiceCount': len(invoices),  # Include the invoice count in the response
        })
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching client invoices'}), 500

#---------------------------------------------------------------------------------

def get_client_email(client_name):
    try:
        # Assuming 'Registration' is the model for user registration details
        user = Registration.query.filter_by(customer_name=client_name).first()

        if user:
            # Assuming 'email' is the attribute in the Registration model storing the email address
            return user.customer_email  # Adjust this based on your actual attribute name
        else:
            return None  # Return None if user not found
    except Exception as e:
        print(f"Error getting client email: {str(e)}")
        return None  # Handle exceptions as needed


#---------------------------------------------------------------------------------

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        print("Received data:", data)

        email = data.get('email')
        subject = data.get('subject')
        body = data.get('body')
        attachments = data.get('attachments', [])
        bcc = data.get('bcc', [])  # BCC recipients

        # Combine main recipient and BCC recipients
        recipients = [email] + [bcc_recipient['address'] for bcc_recipient in bcc]

        message = Message(subject, recipients=recipients, body=body)

        # Attach each file to the email
        for attachment in attachments:
            file_content = base64.b64decode(attachment['content'])
            print(f"Decoded content for {attachment['filename']}: {file_content[:50]}...")

            message.attach(attachment['filename'], 'image/png', file_content)

        mail.send(message)

        return jsonify({"success": True, "message": "Email sent successfully!"})

    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({"success": False, "message": str(e)})
#-----------------------------------------------------------------------------------------------------------------------------------------------


#---------------------------------------------------------------------------------
@app.route('/delete-invoice/<client_name>/<issue_date>', methods=['DELETE'])
def delete_invoice(client_name, issue_date):
    try:
        # Query invoices directly based on the provided 'client_name' and 'issue_date'
        invoice_to_delete = Invoice.query.filter_by(billed_to=client_name, issue_date=issue_date).first()

        if invoice_to_delete:
            # Delete the invoice
            db.session.delete(invoice_to_delete)
            db.session.commit()

            return jsonify({"message": "Invoice deleted successfully"}),200
        else:
            return jsonify({"error": "Invoice not found"}),404

    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to delete invoice"}),500

#---------------------------------------------------------------------------------
@app.route('/extract_invoice_text', methods=['POST'])
def extract_invoice_text():
    try:
        username = request.form.get('username')  
        invoice_image = request.files['invoice_image']
        image_data = invoice_image.read()
        file_extension = invoice_image.filename.lower().split('.')[-1]

        # Check if the file extension is an image format
        if file_extension in ['png', 'jpg', 'jpeg', 'webp']:
            compressed_image_data = image_data

            while len(compressed_image_data) > 64 * 1024:
                # Compress the image until its size is less than 64 KB
                compressed_image_data = compress_image(compressed_image_data)

            # Process the compressed image data
            image = cv2.imdecode(np.frombuffer(compressed_image_data, np.uint8), 1)
            data = process_image(image)

            if data:
                new_invoice = Invoice(
                    invoice_number=data.get('Invoice Number'),
                    issue_date=data.get('Issue Date'),
                    due_date=data.get('Due Date'),
                    address=data.get('Address'),
                    billed_to=data.get('Billed To'),
                    phone=data.get('Phone'),
                    email=data.get('Email'),
                    ship_name=data.get('Ship to'),
                    acc_number=data.get('Account Number'),
                    acc_name=data.get('Account Name'),
                    payment=data.get('Payment'),
                    total=data.get('Total'),
                    country=data.get('Country'),
                    image_data=compressed_image_data,
                    username=username,
                )
                db.session.add(new_invoice)
                db.session.commit()
            else:
                    # If the image size is not more than 64 KB, use the original image data
                        data = process_image(cv2.imdecode(np.frombuffer(image_data, np.uint8), 1))
                        if data:
                            print("Data friom invoice is:",data)
                            new_invoice = Invoice(
                                invoice_number=data.get('Invoice Number'),
                                issue_date=data.get('Issue Date'),
                                due_date=data.get('Due Date'),
                                address=data.get('Address'),
                                billed_to=data.get('Billed To'),
                                phone=data.get('Phone'),
                                email=data.get('Email'),
                                ship_name=data.get('Ship to'),
                                acc_number=data.get('Account Number'),  # Modified key name
                                acc_name=data.get('Account Name'),  # Modified key name
                                payment=data.get('Payment'),
                                total=data.get('Total'),
                                country=data.get('Country'),
                                # payment_status="Not paid",
                                image_data=image_data,
                            )
                            db.session.add(new_invoice)
                            db.session.commit()
        elif file_extension == 'pdf':
            # PDF file, convert to images and process
            pdf_images = convert_pdf_to_images(image_data)
            for pdf_image in pdf_images:
                # Process each image separately
                data = process_image(np.array(pdf_image))

                # Resize the PDF image to a smaller size (e.g., 600x700 pixels)
                resized_pdf_image = cv2.resize(np.array(pdf_image), (600, 700))

                # Convert the resized PDF image to bytes
                resized_pdf_image_bytes = cv2.imencode('.jpg', resized_pdf_image)[1].tobytes()
                while len(resized_pdf_image_bytes) > 64 * 1024:
                            # Resize again if the image size exceeds the limit
                        resized_pdf_image = cv2.resize(resized_pdf_image, (int(resized_pdf_image.shape[1] * 0.8), int(resized_pdf_image.shape[0] * 0.8)))
                        resized_pdf_image_bytes = cv2.imencode('.jpg', resized_pdf_image)[1].tobytes()

                        return resized_pdf_image_bytes

                # Now you can use resized_pdf_image_bytes in your SQLAlchemy insert statement
                if data:
                    new_invoice = Invoice(
                        invoice_number=data.get('Invoice Number'),
                        issue_date=data.get('Issue Date'),
                        due_date=data.get('Due Date'),
                        address=data.get('Address'),
                        billed_to=data.get('Billed To'),
                        phone=data.get('Phone'),
                        email=data.get('Email'),
                        ship_name=data.get('Ship to'),
                        acc_number=data.get('Account Number'),  # Modified key name
                        acc_name=data.get('Account Name'),  # Modified key name
                        payment=data.get('Payment'),
                        total=data.get('Total'),
                        country=data.get('Country'),
                        image_data=resized_pdf_image_bytes,  # Use the converted bytes here
                    )

                    db.session.add(new_invoice)
                    db.session.commit()




        return jsonify({'status': 'success', 'message': 'Invoice data saved successfully'}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500

#------------------------------------------------------------------------------------------------------------------
@app.route('/invoices', methods=['GET'])
def get_invoices():
    try:
        # Query to group by billed_to and issue_date and count the number of invoices
        query = db.session.query(
            Invoice.billed_to,
            Invoice.issue_date,
            Invoice.username,
            func.count().label('invoice_count')
        ).group_by(
            Invoice.billed_to,
            Invoice.issue_date,
            Invoice.username
        ).order_by(
            Invoice.billed_to,
            Invoice.issue_date
        )

        invoices = query.all()

        result = [
            {'billed_to': invoice.billed_to, 'issue_date': invoice.issue_date, 'invoice_count': invoice.invoice_count,'username':invoice.username}
            for invoice in invoices
        ]
        print(result)
        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching invoices'}), 500
#-----------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/search-invoice', methods=['POST'])
def search_invoice():
    try:
        data = request.get_json()
        invoice_number = data.get('invoiceNumber')

        invoice = Invoice.query.filter_by(invoice_number=invoice_number).first()

        if invoice:
            image_data = base64.b64encode(invoice.image_data).decode('utf-8')
            return jsonify({
                'invoices': [{
                    'id':invoice.id,
                    'invoice_number': invoice.invoice_number,
                    'issue_date': invoice.issue_date,
                    'address': invoice.address,
                    'billed_to': invoice.billed_to,
                    'phone': invoice.phone,
                    'due_date': invoice.due_date,
                    'total': invoice.total,
                    'image_data': image_data
                }]
            })
        else:
            return jsonify({'invoices': [], 'message': 'Invoice not found'}), 404
    except Exception as e: 
        print(e)
        traceback.print_exc()
        return jsonify({'invoices': [], 'message': 'Error searching invoice'}),500

#----------------------------------------------------------------------------------------------------------


# Update the '/update-payment-status' route
@app.route('/api/update-payment-status', methods=['PUT'])
def update_payment_status():
    try:
        data = request.json
        id = data.get('id')
        payment_status = data.get('payment_status')

        # Input Validation
        if not (id and payment_status):
            return jsonify({'status': 'error', 'message': 'Invalid input data'}), 400

        # Convert id to integer
        id = int(id)

        # Update the payment status in the database
        invoice = Invoice.query.get(id)

        if invoice:
            invoice.payment_status = payment_status
            db.session.commit()

            # Return a success response
            return jsonify({'status': 'success', 'message': 'Payment status updated successfully'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Invoice not found'}), 404
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': 'Error updating payment status'}), 500


#----------------------------------------------------------------------------------------------
@app.route('/get-organization-details', methods=['GET'])
def get_organization_details():
    try:
        organization_details = Registration.query.filter_by(registration_type='organization').first()
        if organization_details:
            return jsonify({
                'company_name': organization_details.company_name,
                'company_establishment_date': organization_details.company_establishment_date,
                'phone_number': organization_details.phone_number,
                'email': organization_details.email,
                'company_address': organization_details.company_address,
                'branch_location': organization_details.branch_location,  # Include branch location here
            })
        else:
            return jsonify({'message': 'Organization details not found'}), 404
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching organization details'}), 500
#----------------------------------------------------------------------------------------------
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        print("Received a request to /forgot-password")
        data = request.get_json()

        username = data.get('username')
        new_password = data.get('newPassword')
        confirm_password = data.get('confirmPassword')
        print(f"Received username from frontend: {username}")
        # Find the user in the data store
        user = Registration.query.filter(
            ((Registration.username == username) & (Registration.registration_type == 'organization')) |
            ((Registration.customer_username == username) & (Registration.registration_type == 'customer'))
        ).first()

        print("User from database:",user)

        if user:
            # Determine the user type (organization or customer)
            user_type = user.registration_type

            # Add print statements for debugging
            print(f"Username: {username}")
            print(f"User Type: {user_type}")

            if new_password == confirm_password:
                # Update the password based on user type
                if user_type == 'organization':
                    user.password = new_password
                elif user_type == 'customer':
                    user.customer_password = new_password

                # Save changes to the database
                db.session.commit()

                return jsonify({'message': 'Password reset successful'})
            else:
                return jsonify({'error': 'New password and confirm password do not match'}), 400
        else:
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'message': 'Error resetting password'}), 500
#----------------------------------------------------------------------------------------------
@app.route('/get-customer-details', methods=['GET'])
def get_customer_details():
    try:
        customer_details = Registration.query.filter_by(registration_type='customer').all()
        if customer_details:
            customers_data = [{
                'customer_name': customer.customer_name,
                'customer_contact_number': customer.customer_contact_number,
                'customer_email': customer.customer_email,
            } for customer in customer_details]
            return jsonify(customers_data)
        else:
            return jsonify({'message': 'Customer details not found'}), 404
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching customer details'}), 500
    
#----------------------------------------------------------------------------------------------
@app.route('/get-company-names', methods=['GET'])
def get_company_names():
    try:
        # Retrieve distinct company names directly from the database
        company_names = Registration.query.filter_by(registration_type='organization') \
                          .distinct(Registration.company_name) \
                          .with_entities(Registration.company_name) \
                          .all()

        unique_company_names = list(set([name[0] for name in company_names]))
        print('Unique Company Names:', unique_company_names)  # Add this line for debugging

        return jsonify({'companyNames': unique_company_names})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching company names'}), 500

#----------------------------------------------------------------------------------------------
    

@app.route('/get-details-by-company', methods=['GET', 'POST'])
def get_details_by_company():
    try:
        data = request.json
        company = data.get('company')
        org_type = data.get('type')
        branch = data.get('branch')

        # Fetch details based on company, organization type, and branch location
        details = Registration.query.filter_by(company_name=company, registration_type=org_type, branch_location=branch).all()


        if details:
            # To Construct a list of details for all locations
            details_list = []
            for entry in details:
                details_list.append({
                    'company_name': entry.company_name,
                    'company_establishment_date': entry.company_establishment_date,
                    'phone_number': entry.phone_number,
                    'email': entry.email,
                    'company_address': entry.company_address,
                    'branch_location': entry.branch_location,
                    # Add other details as needed
                })

            # Return the list of details as a JSON response
            return jsonify({'details': details_list})
        else:
            return jsonify({'message': 'Details not found'}), 404
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching details'}), 500
#----------------------------------------------------------------------------------------------  
@app.route('/get-branch-locations', methods=['GET'])
def get_branch_locations():
    try:
        company = request.args.get('company')

        # Fetch branch locations based on the selected company
        locations = Registration.query.filter_by(company_name=company, registration_type='organization').with_entities(Registration.branch_location).distinct()

        if locations:
            # Convert the result to a list of branch locations
            branch_locations = [loc[0] for loc in locations]
            return jsonify({'branchLocations': branch_locations})
        else:
            return jsonify({'message': 'Branch locations not found'}), 404
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching branch locations'}), 500
#----------------------------------------------------------------------------------------------

@app.route('/api/saveSettings', methods=['POST'])
def save_settings():
    try:
        # Extract form data from the request
        form_data = request.json
        username = form_data.get('companyName')
        company_address = form_data.get('companyAddress')
        email = form_data.get('email')
        branch_location = form_data.get('branchLocation')
        print(username)
        # Assuming you have only one organization entry for simplicity
        organization_entry = Registration.query.filter_by(registration_type='organization').first()

        if organization_entry:
            # Update the organization details
            organization_entry.username = username
            organization_entry.company_address = company_address
            organization_entry.branch_location = branch_location  
            organization_entry.email = email  

            # Save changes to the database
            db.session.commit()

            return jsonify({'message': 'Settings saved successfully'}), 200
        else:
            return jsonify({'message': 'Organization details not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'message': 'Error saving settings'}), 500


#------------------------------------------------------------------------------------------------------------------------------------------


@app.route('/api/invoice', methods=['GET'])
def get_user_invoices():
    try:
        # Retrieve the username from the query parameters
        username = request.args.get('username')

        # Print the username for debugging
        print(f"Username: {username}")

        # Fetch the registration record based on the username
        registration_record = Registration.query.filter_by(customer_username=username).first()

        # Print the registration record for debugging
        print(f"Registration Record: {registration_record}")

        if registration_record:
            # Fetch user invoices based on the username from your database
            invoices = Invoice.query.filter_by(billed_to=registration_record.customer_name).all()

            # Create a list to store the details of each invoice
            invoices_list = []

            for invoice in invoices:
                # Convert binary image data to Base64 string
                image_data = base64.b64encode(invoice.image_data).decode('utf-8')

                invoices_list.append({
                    'id': invoice.id,
                    'invoice_number': invoice.invoice_number,
                    'issue_date': invoice.issue_date,
                    'due_date': invoice.due_date,
                    'address': invoice.address,
                    'billed_to': registration_record.customer_name,
                    'customer_name': registration_record.customer_name,
                    'phone': invoice.phone,
                    'total': invoice.total,
                    'payment_status': invoice.payment_status,
                    'image_data': image_data
                })

            # Return the list of user invoices as a JSON response
            return jsonify({'invoices': invoices_list})

        else:
            # Return a 404 response if the user is not found
            return jsonify({'message': 'User not found'}), 404

    except Exception as e:
        # Print the error and traceback to the console
        print(f"Error: {e}")
        traceback.print_exc()
        return jsonify({'message': 'Error fetching user invoices'}), 500
#---------------------------------------------------------------------------
@app.route('/api/invoices/<invoice_number>', methods=['GET'])
def get_invoice(invoice_number):
    try:
        # Query the 'invoice' table to get the invoice where 'invoice_number' matches
        invoice = Invoice.query.filter_by(invoice_number=invoice_number).first()

        if invoice:
            # Convert binary image data to Base64 string
            image_data = base64.b64encode(invoice.image_data).decode('utf-8')

            return jsonify({
                'invoice_number': invoice.invoice_number,
                'issue_date': invoice.issue_date,
                'address': invoice.address,
                'billed_to': invoice.billed_to,
                'image_data': image_data
            })
        else:
            return jsonify({'message': 'Invoice not found'}),404
    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'message': 'Error fetching invoice'}),500
#------------------------------------------------------------------------------------------------------------------------------------------

@app.route('/api/contact-us', methods=['GET'])
def get_contact_us_messages():
    contact_us_messages = ContactUsMessage.query.all()
    
    # Update 'number' to 'message' in the response data
    messages_data = [{'id': message.id, 'name': message.name, 'email': message.email, 'message': message.message} for message in contact_us_messages]
    
    return jsonify({'contactUsMessages': messages_data})

#------------------------------------------------------------------------------------------------------------------------------------------

@app.route('/api/admininvoice', methods=['GET'])
def get_admin_invoices():
    try:
        invoices = Invoice.query.all()
        invoices_data = [
            {
                'id': invoice.id,
                'invoice_number': invoice.invoice_number,
                'issue_date': invoice.issue_date,
                'address': invoice.address,
                'billed_to': invoice.billed_to,
                'image_data': base64.b64encode(invoice.image_data).decode('utf-8') if invoice.image_data else None
            }
            for invoice in invoices
        ]
        print("Invoices Data:", invoices_data)  # Add this line for debugging
        return jsonify(invoices_data)
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching invoices'}), 500
#--------------------------------------------------------------------------------------------------------
@app.route('/api/saveCustomerSettings', methods=['POST'])
def save_customer_settings():
    try:
        # Extract form data from the request
        form_data = request.json
        customer_username = form_data.get('customerUsername')
        customer_contact_number = form_data.get('customerContactNumber')
        customer_email = form_data.get('customerEmail')
        print(customer_username)
        # Assuming you have only one customer entry for simplicity
        customer_entry = Registration.query.filter_by(registration_type='customer').first()

        if customer_entry:
            # Update the customer details
            customer_entry.customer_username = customer_username
            customer_entry.customer_contact_number = customer_contact_number
            customer_entry.customer_email = customer_email

            # Save changes to the database
            db.session.commit()

            return jsonify({'message': 'Customer settings saved successfully'}), 200
        else:
            return jsonify({'message': 'Customer details not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'message': 'Error saving customer settings'}), 500
#------------------------------------------------------------------------------------------------------------------------------------------

@app.route('/get-freelancer-details', methods=['GET'])
def get_freelancer_details():
    try:
        
        freelancer_details = Registration.query.filter_by(registration_type='freelancer').all()

        if freelancer_details:
            
            freelancers_data = [{
                'freelancer_name': freelancer.freelancer_name,
                'freelancer_contact_number': freelancer.freelancer_contact_number,
                'freelancer_email': freelancer.freelancer_email,
            } for freelancer in freelancer_details]
            
            
            return jsonify(freelancers_data)
        else:
            
            return jsonify({'message': 'Freelancer details not found'}), 404
    except Exception as e:
        
        print(e)
        return jsonify({'message': 'Error fetching freelancer details'}), 500

#------------------------------------------------------------------------------------------------------------------------------------------------

@app.route('/api/invoice_generator', methods=['POST'])
def save_invoice():
    try:
        # Get the JSON data from the request
        invoice_data = request.json

        # Get items from the invoice data or an empty list if not present
        items = invoice_data.get('items', [])
        
        # Serialize items to JSON
        items_json = json.dumps(items)
              
        invoiceId = invoice_data['invoiceId']
        client_image = invoice_data.get('clientImage')
        encoded_image = base64.b64encode(client_image.encode('utf-8'))
        
        # pdf_file = request.files['pdf']
        # pdf_image = convert_pdf_to_images(pdf_files)
        client_phone = invoice_data.get('clientPhone')
        freelancer_username = invoice_data.get('storedUsername')
        # pdf_file = request.files['pdfFile']

        # Convert PDF to image (You need to implement this part)
        # pdf_image = convert_pdf_to_image(pdf_file)
        # image_base64 = base64.b64encode(pdf_image).decode('utf-8')

        # Create a new Invoice_generator object with the received data
        new_invoice = Invoice_generator(
            freelancer_username=freelancer_username,
            client_name=invoice_data['clientName'],
            client_address=invoice_data['clientAddress'],
            client_email=invoice_data['clientEmail'],
            country=invoice_data['clientCountry'],
            client_phone=client_phone,
            invoice_number=invoice_data['invoiceNumber'],
            issue_date=invoice_data['invoiceDate'],
            due_date=invoice_data['invoiceDueDate'],
            total=sum(item['quantity'] * item['unitPrice'] for item in items),
            note=invoice_data['note'],
            payment_method=invoice_data['paymentType'],
            payment_information=invoice_data.get('otherPayment', None),
            logo=encoded_image,  # Assign the client image here
            # invoice_image=image_base64,
            item=items_json,
            invoiceId=invoiceId
        )
        
        # Add the new invoice to the database
        db.session.add(new_invoice)
        db.session.commit()
        
        return jsonify({'message': 'Invoice saved successfully'}), 201
    except Exception as e:
        print('Error saving invoice:', e)
        return jsonify({'message': 'Error saving invoice'}), 500
#------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/check_invoice_id/<invoiceId>', methods=['GET'])
def check_invoice_id(invoiceId):
    # Query the database to check if the invoiceId exists
    exists = bool(Invoice_generator.query.filter_by(invoiceId=invoiceId).first())
    return jsonify({'exists': exists})

#-------------------------------------------------------------------------------------------------------------------
@app.route('/api/invoice_generator', methods=['GET'])
def get_info():
    try:
        # Retrieve the username from the query parameters
        freelancer_username = request.args.get('username')
        print(f"Username: {freelancer_username}")
        invoice_records = Invoice_generator.query.filter_by(freelancer_username=freelancer_username).all()
        print(f"inviice: {invoice_records}")
        invoices = []

        # Iterate through invoice records and extract relevant information
        for invoice_record in invoice_records:
            invoice_info = {
                'id': invoice_record.id,
                'invoice_number': invoice_record.invoice_number,
                'client_name': invoice_record.client_name,
                'client_address': invoice_record.client_address,
                'client_phone': invoice_record.client_phone,
                'client_email': invoice_record.client_email,
                'country': invoice_record.country,
                'issue_date': invoice_record.issue_date,
                'due_date': invoice_record.due_date,
                'payment_method': invoice_record.payment_method,
                'item': invoice_record.item,
                'total': invoice_record.total,
            }
            print(invoice_info)
            invoices.append(invoice_info)

        # Return JSON response containing invoice data
        return jsonify({'invoices': invoices}), 200

    except Exception as e:
        # Handle exceptions
        print('Error:', e)
        return jsonify({'error': 'An error occurred while fetching invoice data.'}), 500
        
#------------------------------------------------------------------------------------------------------------
@app.route('/api/invoice_generator1', methods=['POST'])
def generate_invoice():
    try:
        # Get the client image from the request
        client_image = request.files['clientImage']
        
        # Get the invoiceId from the request
        invoice_id = request.form['invoiceId']
        
        # Convert the image file to Base64 string
        encoded_image = base64.b64encode(client_image.read()).decode('utf-8')
        
        # Save the Base64 encoded image to the database for the corresponding invoiceId
        # Assuming you have a database connection and cursor established
        # Replace these with your database connection and cursor
        # cursor.execute("UPDATE invoice_generator SET invoice_image = %s WHERE invoiceId = %s", (encoded_image, invoice_id))
        # connection.commit()

        # For demonstration, print the encoded image and invoiceId
        print("Encoded Image:", encoded_image)
        print("Invoice ID:", invoice_id)

        # Return success response
        return jsonify({'message': 'Client image saved successfully'})
    except Exception as e:
        # Handle any exceptions (e.g., database errors)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)