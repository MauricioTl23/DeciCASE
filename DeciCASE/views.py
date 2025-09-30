from django.http import HttpResponse
from django.shortcuts import render

def main(request):
    return render(request, "mainmenu.html")

def save_objectives(request):
    mensaje = ""
    context = {}

    if request.method == 'POST':
        ob_s = request.POST.get('obligatorios', '')
        de_s = request.POST.get('deseados', '')
        es_s = request.POST.get('estrategias', '')

        # Guardamos valores para reinyectarlos al template
        context['obligatorios_val'] = ob_s
        context['deseados_val'] = de_s
        context['estrategias_val'] = es_s

        try:
            oblig = int(ob_s)
            des = int(de_s)
            estr = int(es_s)
        except (TypeError, ValueError):
            context['mensaje'] = "❌ Ingresa números válidos."
            return render(request, 'mainmenu.html', context)

        if oblig < 1 or des < 1 or estr < 2:
            context['mensaje'] = "❌ Objetivos deben ser mayores a 0 y estrategias mayores a 1."
            return render(request, 'mainmenu.html', context)

        # Éxito
        context['mensaje'] = f"✔ Guardado: Obligatorios={oblig}, Deseados={des}, Estrategias={estr}"
        context['disabled_btn'] = True
        return render(request, 'mainmenu.html', context)

    return render(request, 'mainmenu.html')