from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

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
    location = models.PointField(srid = 4326, null = True, blank = True)
    
    def save(self, args, **kwargs):
        if self.longitude and self.latitude:
            self.location = Point(self.longitude, self.latitude, srid = 4326)
        super().save(args, **kwargs)

    def __str__(self):
        return self.name

class Animal(models.Model):
    intake_date = models.CharField(max_length=100, blank=True)
    breed = models.CharField(max_length=200, blank=True)
    color = models.CharField(max_length=200, blank=True)
    sex = models.CharField(max_length=50, blank=True)
    age = models.CharField(max_length=50, blank=True)
    note = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)

    animal_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    source_url = models.URLField(blank=True, null=True)
    shelter_location = models.CharField(max_length=100, blank=True)
    photo = models.URLField(blank=True)

    def __str__(self):
        return f"{self.animal_id} - {self.breed}"
    