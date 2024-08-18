from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    username = models.CharField(max_length= 20, blank=True, null=True)
    email = models.EmailField(('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return "{}".format(self.email)


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    title = models.CharField(max_length=5)
    dob = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=255)
    country = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    zip = models.CharField(max_length=5)
    photo = models.ImageField(upload_to='uploads', blank=True)


class Command(models.Model):
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=20, null=True, blank=True, default=None)
    
    image = models.ImageField(upload_to='lists/%Y/%m/%d/', blank=False, null=False)
    uploaded_at = models.DateTimeField(editable=False, default=timezone.now)
    
    # Address fields
    home_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    
    # Contact details
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    
    ORDER_STATE_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    order_state = models.CharField(max_length=10, choices=ORDER_STATE_CHOICES, default='PENDING')
    
    comment_client = models.TextField(blank=True, null=True)
    comment_admin = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Command {self.id}: {self.image.name}"