from django.shortcuts import render,HttpResponse

# Create your views here.


def index(request):
    # template = loader.get_template('index.html')
    # context = {}
    # return HttpResponse(template.render(context, request))

    return render(request, 'index.html')
    #return HttpResponseRedirect(template.render(context, request))  # 跳转到index界面