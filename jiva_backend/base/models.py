from django.db import models

from django.contrib.auth.models import User

# Create your models here.

class UserDetails(models.Model):
    user_id=models.ForeignKey(User,on_delete=models.CASCADE)
    skills=models.CharField(max_length=180)
    phone_number=models.CharField(max_length=50)
    profile_link=models.CharField(max_length=100)
    years_experience=models.CharField(max_length=50)
    video_link=models.CharField(max_length=100,blank=True,null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

   