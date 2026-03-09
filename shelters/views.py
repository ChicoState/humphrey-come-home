from django.shortcuts import render
from .models import Animal

# Create your views here.
def home(request):
    return render(request, "shelters/home.html")

def animal_list(request):
    animals = Animal.objects.order_by("-photo", "animal_id")
    return render(request, "shelters/animals.html", {"animals": animals})
