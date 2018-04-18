Cesium 倾斜模型的展示 


前端webupload +Django后台实现大文件分片、断点续传、Django项目。 
The front-end webupload uploader + Django backstage implementation of large file sharding, Breakpoint continuingly, Django project.




初始项目 Django2.0.3   python3.6


成功 测试上传3G大小的文件

没写modle ORM 上传文件 路径的映射 欢迎完善 

表单 提交的token  csrf 问题未解决   暂时注释掉  settings.py 里的如下代码  
MIDDLEWARE_CLASSES = (
    #'django.middleware.csrf.CsrfViewMiddleware',
)

redis 缓存上传碎片的方式注释了  想尝试这个可以自己打开去配置

1. Clone the repo.


    git clone git@github.com:jiawenquan/DjangoCesium.git
    cd DjangoCesium/

2. Install the requirements (I suggest using a virtualenv).


    virtualenv ven
    source venv/bin/activate
    pip install -r requirements.txt


3. Run the server.


    ./manage.py runserver

4. Go to `127.0.0.1:8000 <http://127.0.0.1:8000>`__ .Show Cesium Demo 3Dtiles .
    Go to `127.0.0.1:8000/upload/ <http://127.0.0.1:8000/upload/>`__ and upload a file.

qq 1173551915  