from django.contrib import admin
from django.apps import apps

# Obtener todos los modelos de la aplicación
app_models = apps.get_app_config("api").get_models()

# Registrar cada modelo en el admin
for model in app_models:
    admin.site.register(model)
