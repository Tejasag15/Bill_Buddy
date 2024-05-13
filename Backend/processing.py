from pdf2image import convert_from_path
from PIL import Image
from IPython.display import display, HTML
import cv2
import pytesseract
from PIL import Image, ImageDraw
import numpy as np
import re
import pandas as pd
import os
from tabulate import tabulate
import matplotlib.pyplot as plt
import spacy
import fileupload
import io
from pdf2image import convert_from_path
from pdf2image import convert_from_bytes

from io import BytesIO

def convert_pdf_to_images(pdf_content):
    # Create a BytesIO object to simulate a file-like object from the content
    pdf_file = BytesIO(pdf_content)

    # Use convert_from_bytes instead of convert_from_path
    images = convert_from_bytes(pdf_file.read(), fmt="png")

    return images

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"



#=====================================================================================================================================================




# =======================================================================================================================================================

def extract_text_and_boxes(image):
    # Open the image using OpenCV
    img = image

    # Get image dimensions
    height, width, _ = img.shape

    # Divide the image into five parts
    upper_left = img[:height // 3, :width // 2]
    upper_right = img[:height // 3, width // 2:]
    middle = img[height // 3:2 * height // 3, :]
    lower_left = img[2 * height // 3:, :width // 2]
    lower_right = img[2 * height // 3:, width // 2:]

    # Create a single drawing object for the entire image
    draw = ImageDraw.Draw(Image.fromarray(img))

    # Extract text and draw boxes for each part
    extracted_texts = []
    for part, name in zip([upper_left, upper_right, middle, lower_left, lower_right],
                          ["upper_left", "upper_right", "middle", "lower_left", "lower_right"]):
        gray_part = get_grayscale(part)
        data = pytesseract.image_to_data(gray_part, output_type=pytesseract.Output.DICT)

     # Extracted text and line boxes
        extracted_text = ""
        current_line = []

        for i in range(len(data['text'])):
            word = data['text'][i].strip()
            if word:
                # Draw box around the word
                left, top, width, height = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
                draw.rectangle([(left, top), (left + width, top + height)], outline="red")

                # Check if the word is on a new line based on vertical distance
                if current_line and (top - current_line[-1][1] > height // 2):
                    # Draw box around the line
                    line_left = min(word_info[0] for word_info in current_line)
                    line_top = min(word_info[1] for word_info in current_line)
                    line_right = max(word_info[0] + word_info[2] for word_info in current_line)
                    line_bottom = max(word_info[1] + word_info[3] for word_info in current_line)

                    draw.rectangle([(line_left, line_top), (line_right, line_bottom)], outline="blue")

                    # Add the line text to the extracted text
                    line_text = ' '.join(word_info[4] for word_info in current_line)
                    extracted_text += line_text + "\n"

                    # Reset the current line
                    current_line = []

                # Add the word info to the current line
                current_line.append((left, top, width, height, word))
                # Check if there are remaining words after the loop
        if current_line:
            # Draw box around the last line
            line_left = min(word_info[0] for word_info in current_line)
            line_top = min(word_info[1] for word_info in current_line)
            line_right = max(word_info[0] + word_info[2] for word_info in current_line)
            line_bottom = max(word_info[1] + word_info[3] for word_info in current_line)

            draw.rectangle([(line_left, line_top), (line_right, line_bottom)], outline="blue")

            # Add the last line text to the extracted text
            line_text = ' '.join(word_info[4] for word_info in current_line)
            extracted_text += line_text + "\n"

        # Save the image with line boxes
        Image.fromarray(img).save(f"{name}_output.jpg")

        # Append extracted text for the current part
        extracted_texts.append(extracted_text.strip())
        print(f"Extracted Text from {name}:\n{extracted_text.strip()}")

    full_text = '\n'.join(extracted_texts)

    return full_text

def get_grayscale(img):
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

def extract_invoice_number(invoice_text):
    # Define regular expression pattern for invoice number
    invoice_number_patterns = [
      r"\b(?:INVOICE\s*#\s*(us-\d+))\b",
      r"\b(?:Invoice\s*number:\s*(\w+))\b",
      r"\b(?:Invoice\s*No\.?\s*(\w+))\b",
      r"\b(?:INVO-(\d+))\b",
      r"\b(?:Invoice\s*Number:\s*([^\n]+))\b",
      r"\b(?:Invoice\s*#\s*(\w+))\b",
      r"\b(?:Invoice\s*#\s*(\d+))\b",
      r"\b(?:Invoice\s*No\s*:\s*([^\n]+))\b",
      r"\b(?:Invoice\s*No\s* #\s*([^\n]+))\b",
      r"\b(?:([A-Za-z]+-[A-Za-z]+-\d+))\b",  # New pattern for ABC-OCT22-001 format
  ]
    invoice_number_pattern = '|'.join(invoice_number_patterns)


    # Search for pattern in the text
    invoice_number_match = re.search(invoice_number_pattern, invoice_text, re.IGNORECASE)

    # Extract information if found
    invoice_number = None
    if invoice_number_match:
        for group in invoice_number_match.groups():
            if group:
                invoice_number = group.strip()
                break

    return invoice_number

def extract_account_info(text):
    account_info_pattern = r'(?i)(?:BILLED\s*TO\s*:\s*([\s\S]+?)\n)|PAY TO:\s*([A-Za-z\s]+)|INVOICE TO[\s:]+([\s\S]+?)\n|\bBill\s*to\s*([\s\S]+?)(?=\n|$)|John Smith'
    # phone_pattern = r'\+\d{1,3}[-\s]*\d{1,3}[-\s]*\d{1,4}|\(\d{3}\) \d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b|\b(\d{3}-\d{3}-\d{3})\b'
    phone_pattern = r'\+\d{1,3}[-\s]*\d{1,3}[-\s]*\d{1,4}|\(\d{3}\) \d{3}-\d{4}|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b|\b(\d{3}-\d{3}-\d{3})\b|\+\(\d{2}\) \d{3} \d{4}'
    address_pattern = r'\d+\s+[a-zA-Z\s]+\s+[a-zA-Z]+,\s+[a-zA-Z\s]+\s*,\s*[a-zA-Z]{2}\s+\d{5}|\b(\d+\s+\S+\s+\S+,\s*\S+,\s*\S+,\s*\S+\s+\d{5})\b|(\d+\s+[^\n]+\n[^\n]+,\s*[A-Za-z]+\s+\d{5})|(?i)(?:INVOICE TO)[:\s]+([^\n]+)|\b\d{3}[^0-9]+\d{5}\b|\bAddress[:\s]*([^\n]+(?:\n[^\n]+)*\s\d{5})\b|\+\(\d{2}\) \d{3} \d{4}\n(.+)'
    account_info_matches = re.finditer(account_info_pattern, text)
    phone_match = re.search(phone_pattern, text)
    address_match = re.search(address_pattern, text)

    account_info = next((group.strip() for match in account_info_matches for group in match.groups() if group), '')
    phone = phone_match.group() if phone_match else ''
    address = address_match.group(1).strip() if address_match and address_match.group(1) else address_match.group(2).strip() if address_match and address_match.group(2) else ''

    print("Address",address_match)
    return account_info, phone, address


def extract_dates(invoice_text):
    date_patterns = [
        r"((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})",
        r"(\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4})",       # e.g., 25-11-2023
        r"(\d{4}/\d{1,2}/\d{1,2})",       # e.g., 2023/11/25
        r"(\d{1,2}/\d{1,2}/\d{4})",       # e.g., 11/25/2023
        r"(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December),?\s+\d{4})",
        r"(\d{4}-\d{1,2}-\d{1,2})",
        r"(\d{1,2}\s+\w+\s*,?\s*\d{4})",
        r"(\d{1,2}/\d{1,2}/\d{2})",
        r"(\d{4}-\d{2}-\d{2})",
        r"(\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4})",
        r"(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})",
        r"(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}",

    ]

    dates = []
    for pattern in date_patterns:
        date_matches = re.finditer(pattern, invoice_text, re.IGNORECASE)
        for match in date_matches:
            # Check if the group exists in the match object
            if match.lastindex is not None:
                dates.append(match.group(match.lastindex))

    return dates

def label_dates(dates):
    # Label the dates as "Issue Date" and "Due Date"
    issue_date = None
    due_date = None

    if len(dates) > 0:
        issue_date = dates[0]

    if len(dates) > 1:
        due_date = dates[1]

    return issue_date, due_date

def extract_names(invoice_text):
    # Define a pattern for extracting names
    name_pattern = r'\b(?:[A-Z][a-z]+(?: [A-Z][a-z]+)?)\b'

    # Find all matches for names in the text
    names = re.findall(name_pattern, invoice_text)

    return names

def extract_total(text):
    total_pattern = r'Total\s*[:\s]*([$€₹KčKe]*\s*(\d+(?:[.,]\d{1,2})?))'
    total_matches = re.findall(total_pattern, text)

    # Extracting the numeric part
    totals = total_matches[0][0] if total_matches else None

    return totals






def extract_transaction(invoice_text):
    # Define a pattern for extracting account name and number
    account_name_pattern = r'Account\s*Name:\s*([A-Za-z\s]+)|Account\s*Name\s*([A-Za-z\s]+)'
    account_number_pattern = r'(?i)\b(?:Account\s*No\.:\s*(\d{3}-\d{3}-\d{4})|Account\s*Number\s*(\d{4}\s*\d{4}))\b'
    payment_terms_pattern = r'Payment\s*terms:\s*([\s\S]+?)(?=\n|$)|Payment\s*Terms[:\s]*([\s\S]+?)(?=\n|$)'

    # Find all matches for account name and number in the text
    account_name_matches = re.findall(account_name_pattern, invoice_text)
    account_number_matches = re.findall(account_number_pattern, invoice_text)
    payment_matches = re.findall(payment_terms_pattern, invoice_text)

    # Trim extra spaces in tuples
    account_name = [name.strip() for group in account_name_matches for name in group if name]
    account_number = [num.strip() for group in account_number_matches for num in group if num]
    payment_terms = [term.strip() for group in payment_matches for term in group if term]

    # Modify the extracted data to handle empty lists
    account_name = account_name[0] if account_name else None
    account_number = account_number[0] if account_number else None
    payment_terms = payment_terms[0] if payment_terms else None

    # Return a tuple containing both matches
    return account_name, account_number, payment_terms


def extract_email(invoice_text):
    # Define regular expression pattern for invoice number
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b|Email\s*([\s\S]+?)[\r\n]+'
    # Search for pattern in the text
    email_match = re.search(email_pattern, invoice_text, re.IGNORECASE)

    # Extract information if found
    email = None
    if email_match:
        for group in email_match.groups():
            if group:
                email = group.strip()
                break

    return email

def extract_country(invoice_text):
    # Define a pattern for extracting country names
    country_pattern = r'\b(?:Afghanistan|Albania|Algeria|Andorra|Angola|Antigua and Barbuda|Argentina|Armenia|San Francisko|New York|Australia|Austria|Azerbaijan|Bahamas|Bahrain|Bangladesh|Barbados|Belarus|Belgium|Belize|Benin|Bhutan|Bolivia|Bosnia and Herzegovina|Botswana|Brazil|Brunei|Bulgaria|Burkina Faso|Burundi|Cabo Verde|Cambodia|Cameroon|Canada|Central African Republic|Chad|Chile|China|Colombia|Comoros|Congo|Costa Rica|Croatia|Cuba|Cyprus|Czechia|Denmark|Djibouti|Dominica|Dominican Republic|Ecuador|Egypt|El Salvador|Equatorial Guinea|Eritrea|Estonia|Eswatini|Ethiopia|Fiji|Finland|France|Gabon|Gambia|Georgia|Germany|Ghana|Greece|Grenada|Guatemala|Guinea|Guinea-Bissau|Guyana|Haiti|Honduras|Hungary|Iceland|India|Indonesia|Iran|Iraq|Ireland|Israel|Italy|Jamaica|Japan|Jordan|Kazakhstan|Kenya|Kiribati|Korea, North|Korea, South|Kosovo|Kuwait|Kyrgyzstan|Laos|Latvia|Lebanon|Lesotho|Liberia|Libya|Liechtenstein|Lithuania|Luxembourg|Macedonia|Madagascar|Malawi|Malaysia|Maldives|Mali|Malta|Marshall Islands|Mauritania|Mauritius|Mexico|Micronesia|Moldova|Monaco|Mongolia|Montenegro|Morocco|Mozambique|Myanmar|Namibia|Nauru|Nepal|Netherlands|New Zealand|Nicaragua|Niger|Nigeria|North Macedonia|Norway|Oman|Pakistan|Palau|Palestine|Panama|Papua New Guinea|Paraguay|Peru|Philippines|Poland|Portugal|Qatar|Romania|Russia|Rwanda|Saint Kitts and Nevis|Saint Lucia|Saint Vincent and the Grenadines|Samoa|San Marino|Sao Tome and Principe|Saudi Arabia|Senegal|Serbia|Seychelles|Sierra Leone|Singapore|Slovakia|Slovenia|Solomon Islands|Somalia|South Africa|South Sudan|Spain|Sri Lanka|Sudan|Suriname|Sweden|Switzerland|Syria|Taiwan|Tajikistan|Tanzania|Thailand|Timor-Leste|Togo|Tonga|Trinidad and Tobago|Tunisia|Turkey|Turkmenistan|Tuvalu|Uganda|Ukraine|United Arab Emirates|United Kingdom|United States|USA|UK|Uruguay|Uzbekistan|Vanuatu|Vatican City|Venezuela|Vietnam|Yemen|Zambia|Zimbabwe)\b'

    # Search for pattern in the text
    country_match = re.search(country_pattern, invoice_text, re.IGNORECASE)



    # Extract the country name if found
    country = country_match.group() if country_match else None

    return country

def extract_shipping(invoice_text):
    # Define a pattern for extracting country names
    ship_to = r'Name\s*([\s\S]+?)(?=\n|$)|SHIPPING TO:[\r\n]+\s*([^\r\n]+)'

    # Search for pattern in the text
    ship_name_match = re.search(ship_to, invoice_text, re.IGNORECASE)



    # Extract the country name if found
    ship_name = ship_name_match.group() if ship_name_match else None

    return ship_name


# Function to display images
# def display_images(images, titles):
#     plt.figure(figsize=(15, 10))
#     for i in range(len(images)):
#         plt.subplot(3, 3, i+1), plt.imshow(images[i], 'gray')
#         plt.title(titles[i])
#         plt.xticks([]), plt.yticks([])
#     # plt.show()

# Function to get grayscale image
def get_grayscale(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Function for skew correction
def deskew(image):
    coords = np.column_stack(np.where(image > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return rotated

# uploaded_image = files.upload()

# # Get the path of the uploaded image
# image_path = next(iter(uploaded_image))
#===============================================================================================================================

    
#================================================================================================================

def process_image(image):

    # Upload the PDF file
   
    # Loop through all images and extract text
   
      # Original Image
    #   display_images([cv2.cvtColor(image, cv2.COLOR_BGR2RGB)], ["Original Image"])

      # Preprocessing Steps
      gray = get_grayscale(image)
      deskewed = deskew(gray)

      # Display Preprocessed Images
    #   display_images([gray, deskewed], ["Grayscale", "Deskewed"])

      # Perform OCR on the preprocessed images
      text_gray = pytesseract.image_to_string(gray)
      text_deskewed = pytesseract.image_to_string(deskewed)



      # Extract invoice information

      # Upload the image file using Colab's files.upload()
      invoice_text = extract_text_and_boxes(image)
      print(invoice_text)
      print("####################################################################################")
      if invoice_text:


          # Extract contact information
          account_info, phone, address = extract_account_info(invoice_text)
          country = extract_country(invoice_text)
          email=extract_email(invoice_text)
          total=extract_total(invoice_text)
          # doc = nlp(invoice_text)
          acc_name,acc_number,payment=extract_transaction(invoice_text)
          ship_name=extract_shipping(invoice_text)
          # for ent in doc.ents:
            # print(ent.text, ent.start_char, ent.end_char, ent.label_)
          print("\nExtracted Account Information of OCR:")
          print("Billed To:", account_info)
          #----------------------------------------------------------------------------------------------------------------------------
          print("Phone:", phone)
          #----------------------------------------------------------------------------------------------------------------------------
          print("Address:", address)
          #----------------------------------------------------------------------------------------------------------------------------
          print("\nCountry:", country)
          print("\nEmail:", email)
          print("\nTotal:", total)
          #----------------------------------------------------------------------------------------------------------------------------
          # Extract Invoice Number
          invoice_number = extract_invoice_number(invoice_text)
          print("\nInvoice Number:", invoice_number)
          #----------------------------------------------------------------------------------------------------------------------------
          #Extract names
          names = extract_names(invoice_text)
          print("\nExtracted Names:",names)

          #----------------------------------------------------------------------------------------------------------------------------
          # Extract Dates
          dates = extract_dates(invoice_text)
          print("Dates:", dates)

          # Label Dates
          issue_date, due_date = label_dates(dates)
          print("Issue Date:", issue_date)
          print("Due Date:", due_date)

          print("Ship to",ship_name)
          print("Account number:", acc_number)
          print("Account names:", acc_name)
          print("Payment:", payment)
          #----------------------------------------------------------------------------------------------------------------------------
          data = {
              'Billed To': [account_info],
              'Phone': [phone],
              'Address': [address],
              'Invoice Number': [invoice_number],
              'Issue Date': [issue_date],
              'Due Date': [due_date],
              'Country': [country],
              'Total':[total],
              'Email':[email],
              'Ship to':[ship_name],
              'Account Number':[acc_number],
              'Account Name':[acc_name],
              'Payment':[payment],
          }
          return data
          df = pd.DataFrame(data)
          # Display the structured table
          print("\nExtracted Information Table:")
          print(tabulate(df, headers='keys', tablefmt='pretty', showindex=False))

          # Save the DataFrame to an Excel file
          excel_filename = 'invoice_data.xlsx'
          df.to_excel(excel_filename, index=False)
          # Download the Excel file
          # files.download(excel_filename)
      else:
          print("OCR could not extract text from the image.")

  # Display Extracted Text



          # Save the DataFrame to an Excel file
          excel_filename = 'invoice_data.xlsx'
          df.to_excel(excel_filename, index=False)
          # Download the Excel file
          # files.download(excel_filename)

  