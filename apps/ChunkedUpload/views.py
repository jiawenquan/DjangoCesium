# encoding: utf-8
import os, shutil,copy
import time
from libs import ajax
from django.http import HttpResponse
from .models import Document
from . import models


def index(request):
    """分片上传"""

    if request.method == 'POST':
        # print("分片上传")

        upload_file = request.FILES.get('file')  # 获取分片
        task = request.POST.get('task_id')  # 获取文件唯一标识符
        print("分片",task)
        real_file_name = upload_file._name
        chunk = request.POST.get('chunk', 0)
        print("分片上传", chunk)
        filename = './media/file/%s%s' % (task, chunk)
        if not os.path.exists(filename):
            try:
                with open(filename, 'wb') as f:
                    # for obj in upload_file.chunks():
                    #     f.write(obj)
                    f.write(upload_file.read())
                    f.close()
            except Exception as e:
                print(e, 111)

    documents = Document.objects.all()
    return ajax.ajax_template(request, 'web_upload/web_upload.html', {'documents': documents})


def upload_success(request):
    """所有分片上传成功"""

    print("所有分片上传成功")

    task = request.POST.get('task_id')
    print("所有分片", task)
    ext = request.POST.get('ext', '')
    print('ext:', ext)
    upload_type = request.POST.get('type')
    print('upload_type:', upload_type)
    name = request.POST.get('name')
    print('name:', name)
    if len(ext) == 0 and upload_type:
        ext = upload_type.split('/')[1]
    chunk = 0
    with open("./media/file/%s" % name, 'wb') as target_file:  # 创建新文件
        while True:
            try:
                filename = './media/file/%s%s' % (task, chunk)
                source_file = open(filename, 'rb')  # 按序打开每个分片
                target_file.write(source_file.read())  # 读取分片内容写入新文件
                source_file.close()
                os.remove(filename)  # 删除该分片，节约空间
            except Exception as e:
                #找不到碎片文件跳出循环
                print(e, 222)
                break
            chunk += 1
        target_file.close()

        # 系统当前时间年份
        year = time.strftime('%Y')
        # 月份
        month = time.strftime('%m')
        # 日期
        day = time.strftime('%d')
        # 具体时间 小时分钟毫秒
        mdhms = time.strftime('%m%d%H%M%S')
        print("年", year)
        mymovefile("./media/file/%s" % name, "./media/file/"+year+"/"+month+"/"+day+"/"+mdhms+"/%s" % name)

        # 把路径储存入数据库中
        models.Document.objects.create(docfile= "/media/file/"+year+"/"+month+"/"+day+"/"+mdhms+"/%s" % name, filename=str(name))

        return HttpResponse("上传成功")

    return ajax.ajax_data(name)


def list_exist(request):
    """判断该文件上传了多少个分片"""
    name = request.POST.get('filename')
    chunk = 0
    data = {}
    filename = "./file/%s" % name

    # 判断上传的文件是否存在
    if os.path.exists(filename):
        data['flag_exist'] = True
        data['file_path'] = filename
    else:
        data['flag_exist'] = False
    list = []
    while True:
        if os.path.exists("./media/file/%s%s" % (name, chunk)):
            list.append(chunk)
        else:
            break
        chunk += 1
    data['list'] = list
    # print('判断该文件上传了多少个分片',data)
    return ajax.ajax_data(data)

#移动文件到新文件路径
def mymovefile(srcfile, dstfile):
    if not os.path.isfile(srcfile):
        print("%s not exist!" % (srcfile))
    else:
        fpath, fname = os.path.split(dstfile)  # 分离文件名和路径
        if not os.path.exists(fpath):
            os.makedirs(fpath)  # 创建路径
        shutil.move(srcfile, dstfile)  # 移动文件
        print("move %s -> %s" % (srcfile, dstfile))

#复制文件到新文件路径
def mycopyfile(srcfile, dstfile):
    if not os.path.isfile(srcfile):
        print("%s not exist!" % (srcfile))
    else:
        fpath, fname = os.path.split(dstfile)  # 分离文件名和路径
        if not os.path.exists(fpath):
            os.makedirs(fpath)  # 创建路径
        shutil.copyfile(srcfile, dstfile)  # 复制文件
        print("copy %s -> %s" % (srcfile, dstfile))
