# encoding: utf-8
__author__ = 'jia'
__date__ = '2018/4/13 0013 16:17'


import simplejson
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader


def ajax_data(data):
    """
    返回json数据
    """
    # print('原始data：',data)
    data = simplejson.dumps(data)
    # print('Jsondata：', data)
    return HttpResponse(data, content_type="application/json")

def ajax_template(request, html_path, data):
    """
    返回渲染页面
    """
    t = loader.get_template(html_path)
    s = t.render(data, request)
    return HttpResponse(s)

def go_url(url):
    """
    url跳转
    """
    return HttpResponseRedirect(url)