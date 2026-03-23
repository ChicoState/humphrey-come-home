# models.py
# Bryce Emery

# Temporary filler GeoDjango model.py using example from:
# ref:https://medium.com/@adityabhosale2008/building-a-location-based-search-with-docker-django-postgresql-postgis-and-geodjango-6456e3387d6b
# NOTE: This skeleton can be adapted to what we need.
#   I just wanted there to be some placeholder model for Django to migrate.

from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

class Restaurant(models.Model):
    brand = models.CharField(max_length=256)
    cuisine_type = models.CharField(max_length=128, null=True, blank=True)
    address = models.CharField(max_length=256)
    lon = models.FloatField(null=True, blank=True)
    lat = models.FloatField(null=True, blank=True)
    location = models.PointField(srid=4326, null=True, blank=True)
    def save(self, *args, **kwargs):
        if self.lon and self.lat:
            self.location = Point(self.lon, self.lat, srid=4326)
        super().save(*args, **kwargs)


