from django.contrib.auth.models import Group, User
from rest_framework import serializers
from . import models


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class PacienteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Paciente
