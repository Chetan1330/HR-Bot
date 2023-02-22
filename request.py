# from pymongo import MongoClient
# import certifi

# client = MongoClient("mongodb+srv://jos:NntnPc7RvXPmGPOC@cluster0.qhtsoq1.mongodb.net/?retryWrites=true&w=majority",tlsCAFile=certifi.where())

# dbname= client['users']

# collection_name = dbname["user_details"]

# user_1 = {
#     "first_name" : "json_body.get('first_name')",
#     "email" : "json_body.get('email')",
#     "other_nmae" :"json_body.get('other_names')",
#     "video_link" :"json_body.get('videolink')",
#     "skilss":"json_body.get('skills')",
#     "experience":"json_body.get('experience')",
#     "profile_link":"hash[:10]",
    
#     }



# collection_name.insert_many([user_1])

import requests
from icecream import ic
data={
            "email":"validemail@valid.com",
            "first_name":"firstname",
            "other_names":"othernames",
            "phone_number":"phonenumber",
            "experience":"experience",
            "skills":"ML,Laravel",
            "videolink":"videolink"
        }

print("avc")
res=requests.post('https://hiring-api.roycehub.com/api/'+"botregister",json=data)
ic(res.content)
ic(res.json())
