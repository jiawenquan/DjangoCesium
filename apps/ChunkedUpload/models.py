from django.db import models
import os
# Create your models here.


class Document(models.Model):
    filename=models.CharField(max_length=20)
    #docfile = models.FileField(upload_to='documents/%Y/%m/%d')
    docfile = models.CharField(max_length=100)
    # file = models.FileField(upload_to='')
    def __str__(self):
        #list_display = ('id', 'title', 'content')
        return self.filename