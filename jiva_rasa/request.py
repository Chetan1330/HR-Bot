# import os
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail

# message = Mail(
#     from_email='test@roycetechnologies.co.ke',
#     to_emails='habivrobin3@gmail.com',
#     subject='First Email',
#     html_content='This is the first email')
# try:
#     sg = SendGridAPIClient("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")
#     response = sg.send(message)
#     print(response.status_code)
#     print(response.body)
#     print(response.headers)
# except Exception as e:
#     print(e.message)

import requests
data={
            "email":"email",
            "first_name":"firstname",
            "other_names":"othernames",
            "phone_number":"phonenumber",
            "experience":"experience",
            "skills":"skills",
            "videolink":"videolink"
        }

print("avc")
res=requests.post('http://localhost:8000/api/'+"botregister",json=data).json()
print(res)
print("res")
# if res['status']==0:
#     print(0)
# else:
#     print