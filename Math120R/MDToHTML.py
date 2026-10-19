# -*- coding: utf-8 -*-
"""
Created on Fri Mar 27 10:45:49 2026

@author: cpers
"""

from pathlib import Path
import os
import re
import markdown
from bs4 import BeautifulSoup
import re

def FlattenStringArray(array,md = False):
    result = ""
    for i in range(0, len(array)):
        if(md):
            result += markdown.markdown(str(array[i]))
        else:
            result += str(array[i])
    return result

def EscapeLatex(source):
    result =source.replace("\n\\[\n","\n\\\\[\n")
    result =result.replace("\\]","\\\\]")
    a = r"\s\("
    result =re.sub(a,r" \(",result)
    result =result.replace("\\)","\\\\)")
    result = result.replace("\\\\\n","\\\\\\\\\n")
    result = result.replace("\\\\\\hline\n","\\\\\\\\\\hline\n")
    
    print(result)
    print("###########################")
    return result
    
def CompileFile(filename):
    file = open(filename, 'r')
    source = file.read()
    #source = EscapeLatex(source)
    html = markdown.markdown(source, extensions=['md_in_html'])
    if(filename.find("02")!=-1):
        EscapeLatex(source)
        #print(html)
    soup = BeautifulSoup(html, 'html.parser')
    tabs = soup.select("section")
    result = ""