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
    location = models.PointField(srid = 4326, null = True, blank = True)
    
    def save(self, args, **kwargs):
        if self.longitude and self.latitude:
            self.location = Point(self.longitude, self.latitude, srid = 4326)
        super().save(args, **kwargs)

    def __str__(self):
        return self.name
