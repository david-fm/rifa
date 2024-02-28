# Generated by Django 5.0.2 on 2024-02-28 18:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Creador',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='creadores/logos/')),
                ('support_link', models.URLField(blank=True, null=True)),
                ('support_type', models.PositiveSmallIntegerField(blank=True, choices=[(0, ''), (1, 'Gmail'), (2, 'Whatsapp'), (3, 'Instagram'), (4, 'Facebook')], default=0, null=True)),
            ],
        ),
    ]
