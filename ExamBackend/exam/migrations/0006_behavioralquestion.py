# Generated by Django 4.2.20 on 2025-03-25 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("exam", "0005_alter_result_behaviourmarks_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="BehavioralQuestion",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("question_text", models.TextField()),
            ],
        ),
    ]
