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
print(path)
Stem_filepaths = list(path.glob("Stems/*/*.html"))
Stem_filepaths.extend(list(path.glob("Stems/*/*/*.html")))
Stems=list(path.glob("Stems/*[!.html]/"))
Stems.extend(list(path.glob("Stems/*/*[!.html]/")))

for i in range(0,len(Stems)):
    pathname= os.fspath(Stems[i].absolute()).replace("Stems\\","")
    print("STEMS",pathname)
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

def CreateAndWriteContentsToFile(content,filename):
    try:
        newFile = open(filename,'w')
        originalFile = open(filename,'r')
        if originalFile.read!=content:
            newFile.write(content)
        newFile.close()
        originalFile.close()
    except:
        print("Error Creating/Writing the File: ",filename)
            

def makeHTMLFilesFromStems():
    for i in range(0,len(Stem_filepaths)):
        #Collect the filename and rename them to the new locations
        pathname= os.fspath(Stem_filepaths[i].absolute()).replace("Stems\\","")
        D2Lpathname= os.fspath(Stem_filepaths[i].absolute()).replace("Stems","D2LPages")
        
        #Some older files from D2L doubled braces unneccessarily, this removes them.
        body_contents = removeDoubleBraces(open(Stem_filepaths[i]).read())
        
        #Create the appropriate href for the link in the D2L stub.
        D2Lsrc=D2Lpathname.split("D2LPages\\")[1]
        
        #Write the actual Source Html File        
        template_file = open("main-body-template.html")
        new_contents = template_file.read().replace("{{{body}}}",body_contents).replace("{{{title}}}",Stem_filepaths[i].name.split(".html")[0])
        new_contents = new_contents.replace("{{{src}}}",D2Lsrc)
        CreateAndWriteContentsToFile(new_contents,pathname)
        
        #Write the HTML stub for D2L integration (copy paste into D2L new file for link to HTML source)
        D2Ltemplate_file = open("D2L-template.html")
        new_contents = D2Ltemplate_file.read().replace("{{{src}}}",D2Lsrc)
        D2Ltemplate_file.close()
        CreateAndWriteContentsToFile(new_contents,D2Lpathname)
        
        
makeHTMLFilesFromStems()