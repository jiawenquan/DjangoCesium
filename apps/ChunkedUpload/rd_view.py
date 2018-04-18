# encoding: utf-8

import os
from libs import ajax
import redis

REDIS_HOST = '192.168.7.250'
REDIS_DB_ID = 6
REDIS_PORT = 6379
REDIS_PASSWORD = "jxtbkt2013!"


def get_redis_conn():
    return redis.Redis(host=REDIS_HOST, db=REDIS_DB_ID, port=REDIS_PORT, password=REDIS_PASSWORD, charset='gbk')



def index(request):
    """分片上传"""
    if request.method == 'POST':
        upload_file = request.FILES.get('file')
        real_file_name = upload_file._name
        chunk = request.POST.get('chunk', 0)
        try:
            r = get_redis_conn()
        except:
            print ('DatabaseError')
        list_key = "%s_list" % real_file_name
        list_tmp = r.get(list_key)
        if not list_tmp:
            list_tmp = []
        else:
            list_tmp = eval(list_tmp)
        list_tmp.append(chunk)
        r.set(list_key, list_tmp)
        key = '%s%s' % (real_file_name, chunk)
        r.set(key, upload_file.read())
    return ajax.ajax_template(request, 'web_upload/web_upload.html', {})

def upload_success(request):
    """所有分片上传成功"""
    name = request.POST.get('name')
    chunk = 0
    try:
        r = get_redis_conn()
    except:
        print ('DatabaseError')
    with open("./apps/web/upload/%s" % name, 'wb') as target_file:  # 创建新文件
        while True:
            try:
                key = '%s%s' % (name, chunk)
                data = r.get(key)
                if data:
                    target_file.write(data)  # 读取分片内容写入新文件
                else:
                    break
                r.delete(key)
            except Exception as e:
                print (e, 222)
                break
            chunk += 1
        target_file.close()
        list_key = "%s_list" % name
        r.delete(list_key)
    return ajax.ajax_data(name)

def file_exist(request):
    """判断文件知否存在"""
    filename = request.POST.get('filename')
    key = "%s_list" % filename
    data = {}
    filename = "./apps/web/upload/%s" % filename
    if os.path.exists(filename):
        data['flag_exist'] = True
        data['file_path'] = filename
    else:
        data['flag_exist'] = False

    list_tmp = []
    r = get_redis_conn()
    list_data = r.get(key)
    if list_data:
        list_tmp = eval(list_data)
        list_tmp = list(set([int(i) for i in list_tmp]))
    data['list'] = list_tmp
    return ajax.ajax_data(data)