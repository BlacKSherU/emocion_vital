# Generated by Django 5.2 on 2025-06-01 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_cita_notas_cita_resultado'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cita',
            old_name='Paciente',
            new_name='paciente',
        ),
        migrations.AddField(
            model_name='cita',
            name='acompañantes',
            field=models.ManyToManyField(related_name='acompañantes', to='api.paciente', verbose_name='acompañantes'),
        ),
    ]
