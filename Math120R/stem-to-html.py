# -*- coding: utf-8 -*-
"""
Created on February 2nd 2023

@author: cpers
"""

from pathlib import Path
import os
import re

def removeDoubleBraces(string):
    regex = re.compile("\{\{-?\w*\}\}")
    bracesList = regex.findall(string)
    for i in range(0,len(bracesList)):
        string=string.replace(bracesList[i],"{"+bracesList[i].strip("{}")+"}")
    return string    

path=Path(".")
Stem_filepaths = list(path.glob("Stems/*/*.html"))
Stem_filepaths.extend(list(path.glob("Stems/*/*/*.html")))
Stems=list(path.glob("Stems/*[!.html]/"))
Stems.extend(list(path.glob("Stems/*/*[!.html]/")))

for i in range(0,len(Stems)):
    pathname= os.fspath(Stems[i].absolute()).replace("Stems\\","")
    D2Lpathname= os.fspath(Stems[i].absolute()).replace("Stems","D2LPages")
    try:
        os.mkdir(pathname)
    except OSError as e:
        print(e)
    try:
        os.mkdir(D2Lpathname)
    except OSError as e:
        print(e)


template_file = open("main-body-template.html")


def makeHTMLFilesFromStems():
    for i in range(0,len(Stem_filepaths)):
        pathname= os.fspath(Stem_filepaths[i].absolute()).replace("Stems\\","")
        D2Lpathname= os.fspath(Stem_filepaths[i].absolute()).replace("Stems","D2LPages")
        body_contents = removeDoubleBraces(open(Stem_filepaths[i]).read())
        D2Lsrc=D2Lpathname.split("D2LPages\\")[1]
        
        template_file = open("main-body-template.html")
        new_contents = template_file.read().replace("{{{body}}}",body_contents).replace("{{{title}}}",Stem_filepaths[i].name.split(".html")[0])
        try:
            originalFile=open(pathname,"r")
            if originalFile.read() != new_contents:
                newFile = open(pathname,'w')
                newFile.write(new_contents)
                newFile.close()  
        except:
            pass
        originalFile.close()
        template_file.close()
        
        template_file = open("D2L-template.html")
        new_contents = template_file.read().replace("{{{src}}}",D2Lsrc)
        try:
            originalFile = open(D2Lpathname,'r')
            if originalFile.read() != new_contents:
                print("Writing D2L Page...")
                newFile = open(D2Lpathname,'w')
                newFile.write(new_contents)
                newFile.close()
        except:
            pass
        
        originalFile.close()
        template_file.close()
        
makeHTMLFilesFromStems()