from django.db import models

# Create your models here.
class Shelter(models.Model):
    name = models.CharField(max_length = 255)
    address = models.CharField(max_length = 500)
    city = models.CharField(max_length = 100)
    state = models.CharField(max_length = 50)
    zip_code = models.CharField(max_length = 20)
    latitude = models.FloatField(blank = True, null = True)
    longitude = models.FloatField(blank = True, null = True)
    website = models.URLField(blank = True, null = True)
    phone = models.CharField(max_length = 50, blank = True, null = True)

    def __str__(self):
        return self.name
