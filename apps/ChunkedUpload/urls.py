"""DjangoChunkedUploadDemo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.views.generic import RedirectView
from apps.ChunkedUpload import views                      # 文件形式的分片上传
from apps.ChunkedUpload import rd_view                    # redis 形式的分片上传
urlpatterns = [


    path('', views.index),  # 一个分片上传后被调用
    path('success/', views.upload_success),  # 所有分片上传成功后被调用
    path('file_exist/', views.list_exist),  # 判断文件的分片是否存在
]


#urlpatterns = [
#    path('', rd_view.index),  # 一个分片上传后被调用
#    path('success/', rd_view.upload_success),  # 所有分片上传成功后被调用
#    path('file_exist/', rd_view.file_exist),  # 判断文件的分片是否存在
#]