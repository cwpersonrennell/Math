# -*- coding: utf-8 -*-
"""
Created on February 2nd 2023

@author: cpers
"""

from pathlib import Path
import os

path=Path(".")
Stem_filepaths = list(path.glob("Stems/*/*.html"))
Stems=list(path.glob("Stems/*"))
for i in range(0,len(Stems)):
    pathname= os.fspath(Stems[i].absolute()).replace("Stems\\","")

    try:
        os.mkdir(pathname)
    except OSError as e:
        print(e)

Chapter_filepaths = []

template_file = open("main-body-template.html")

for i in range(0,len(Stem_filepaths)):
    pathname= os.fspath(Stem_filepaths[i].absolute()).replace("Stems\\","")
    body_contents = open(Stem_filepaths[i]).read()
    template_file = open("main-body-template.html")
    new_contents = template_file.read().replace("{{{body}}}",body_contents).replace("{{{title}}}",Stem_filepaths[i].name.split(".html")[0])
    try:
        originalFile=open(pathname,"w")
        if originalFile.read() == new_contents:
            continue
    except:
        pass
    
    newFile = open(pathname,'w')
    newFile.write(new_contents)
    newFile.close()

