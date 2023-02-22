from rest_framework import serializers
from base.models import UserDetails, User


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model= UserDetails
        # fields=["id","created_at"]
        fields="__all__"
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields="__all__"