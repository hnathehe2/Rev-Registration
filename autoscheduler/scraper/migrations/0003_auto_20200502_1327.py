# Generated by Django 2.2.6 on 2020-05-02 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scraper', '0002_auto_20200421_2215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='title',
            field=models.CharField(db_index=True, max_length=100),
        ),
    ]
