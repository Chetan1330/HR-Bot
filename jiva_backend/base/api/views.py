from django.http import HttpResponse,JsonResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.models import UserDetails

from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods
from . serializers import UserDetailsSerializer,UserSerializer
from django.core.files.storage import FileSystemStorage
import json

import time
import hashlib
# Mongo db
from pymongo import MongoClient
import certifi
# end  mongo db
from django.views.decorators.csrf import csrf_exempt
client = MongoClient("mongodb+srv://jos:NntnPc7RvXPmGPOC@cluster0.qhtsoq1.mongodb.net/?retryWrites=true&w=majority",tlsCAFile=certifi.where())
dbname= client['users']
collection_name = dbname["user_details"]

@api_view(['GET'])
def getRoutes(request):
    details=UserDetails.objects.all()
    serialized=UserDetailsSerializer(details,many=True)
    return Response(serialized.data)
# @api_view(['Post'])
# @require_http_methods(['POST'])
@api_view(['POST'])
@csrf_exempt
def checkEmail(request):

    json_body=json.loads(request.body)
    user=User.objects.filter(email=json_body.get('email'))
    serialized_user=UserSerializer(user,many=True)

    # print(serialized_user)
    data={
        "data":serialized_user.data,
        "status":1,
        "message":"email found"
    }
    return Response(data)

@api_view(['POST'])
@csrf_exempt
def uploadVideo(request):
    file_obj = request.FILES['video']
    print(request.FILES)

    file_name=time.time()

    fs = FileSystemStorage()
    filename = fs.save(f'{file_name}.mkv', file_obj)
    uploaded_file_url = fs.url(filename)

    print(uploaded_file_url)
    # file_name=time.time()
    # with open(f'/intro_videos/{file_name}.mkv', 'wb') as destination:
    #     for chunk in file_obj.chunks():
    #         destination.write(chunk)

    # print(request.data)
    

    data={
        "file_name":f'{file_name}.mkv',
        "status":1,
        "message":"Email Uploaded successfully"
        }
    return Response(data)
@api_view(['POST'])
@csrf_exempt
def saveVideoLink(request):
    json_body=json.loads(request.body)

    res=User.objects.get(username=json_body.get('email'))
    UserDetails.objects.filter(user_id=res).update(video_link=json_body.get('videolink'))
    return Response({"text":"ok"})
@api_view(['POST'])
@csrf_exempt
def botRegister(request):
    json_body=json.loads(request.body)

    res=User.objects.filter(username=json_body.get('email'))

    if(res):
        data={
        "data":[],
        "status":0,
        "message":"Email already taken"
        }
        return Response(data)


    user=User.objects.create_user(username=json_body.get('email'),email=json_body.get('email'),
    first_name=json_body.get('first_name'),last_name=json_body.get('other_names'))

    user.save()

    hash = hashlib.sha1(json_body.get('email').encode("UTF-8")).hexdigest()
    # print()

    UserDetails.objects.create(video_link=json_body.get('videolink'),
    user_id=user, skills=json_body.get('skills'),
    phone_number=json_body.get('phone_number'),
    years_experience=json_body.get('experience'),
    profile_link=hash[:10])
    # _link
    # SAVE TO MONGO DB
    
    fname=json_body.get('first_name')
    mail=json_body.get('email')
    onames=json_body.get('other_names')
    link=json_body.get('videolink')
    skills=json_body.get('skills')
    experience=json_body.get('experience')
    has=hash[:10]
    user_1 = {
    "first_name" :fname ,
    "email" : mail,
    "other_nmae" :onames,
    "video_link" :link,
    "skilss":skills,
    "experience":experience,
    "profile_link":has,
    }
    collection_name.insert_one(user_1)



    # collection_name.insert(user_1)

    # END SAVE TO MONGO DB
    data={
        "link":hash[:10],
        "status":1,
        "message":"Successful"
        }
    return Response(data)
@api_view(['GET'])
def getProfile(request, link):
    print(link)
    details= UserDetails.objects.filter(profile_link=link).last()
    if(not details):
        data={
        "data":[],
        "status":0,
        "message":"No Records"
        }
        return Response(data)
    user= User.objects.filter(id=details.user_id.id).first()
    # print(details)
    serialized=UserDetailsSerializer(details,many=False)
    serilized_user= UserSerializer(user,many=False)
    data={
        "details":serialized.data,
        "user":serilized_user.data,
        "status":1,
        "message":"Successful"
        }
    return Response(data)
    # return Response({"sms":"ok"})
    