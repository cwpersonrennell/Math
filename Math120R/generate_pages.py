# -*- coding: utf-8 -*-
"""
Created on February 2nd 2023

@author: cpers
"""

from pathlib import Path
import os
import re
DEBUG = False

def debug(text):
    if(DEBUG): print("DEBUGGING.... ",text)

def removeDoubleBraces(string):
    regex = re.compile("\{\{-?\w*\}\}")
    bracesList = regex.findall(string)
    for i in range(0,len(bracesList)):
        string=string.replace(bracesList[i],"{"+bracesList[i].strip("{}")+"}")
    return string    

def CompileStems():
    path=Path(".")
    debug(path)
    Stem_filepaths = list(path.glob("Stems/*/*.html"))
    Stem_filepaths.extend(list(path.glob("Stems/*/*/*.html")))
    Stems=list(path.glob("Stems/*[!.html]/"))
    Stems.extend(list(path.glob("Stems/*/*[!.html]/")))
    return [Stem_filepaths,Stems]

def MakeTargetDirectoriesFromStems(Stems,target):
    for i in range(0,len(Stems)):
        pathname=os.fspath(Stems[i]).replace("Stems\\","")
        #Skip folders/files marked with "X" 
        debug("PATHNAME: "+pathname)
        if(pathname[0]=='X'):
            debug("SKIPPING: "+pathname)
            continue
        pathname= os.fspath(Stems[i].absolute()).replace("Stems\\","")
        debug("STEMS"+pathname)
        targetpathname= os.fspath(Stems[i].absolute()).replace("Stems",target)
        try:
            os.mkdir(pathname)
        except OSError as e:
            print(e)
        try:
            os.mkdir(targetpathname)
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
            

def GenerateFilesFromStemAndTemplate(template_filename,directory):
    Stem_filepaths, Stems = CompileStems()
    MakeTargetDirectoriesFromStems(Stems,directory)
    for i in range(0,len(Stem_filepaths)):
        
        #Collect the filename and rename them to the new locations
        pathname=os.fspath(Stem_filepaths[i]).replace("Stems\\","")
        #Skip folders/files marked with "X" 
        debug("PATHNAME: "+pathname)
        if(pathname[0]=='X'):
            debug("SKIPPING: "+pathname)
            continue
        #filename = os.path.basename(Stem_filepaths[i])
        
        next_page = ""
        previous_page = ""
        if(i<len(Stem_filepaths)):
            next_page = os.fspath(Stem_filepaths[i+1]).replace("Stems\\","").replace("\\","/")
        if(i>0):
            previous_page = os.fspath(Stem_filepaths[i-1]).replace("Stems\\","").replace("\\","/")
        
        print(previous_page+"-->"+next_page)
        pathname= os.fspath(Stem_filepaths[i].absolute()).replace("Stems\\",directory+"\\")
        #Some older files from D2L doubled braces unneccessarily, this removes them.
        body_contents = removeDoubleBraces(open(Stem_filepaths[i]).read())
    
        #Write the actual Source Html File        
        template_file = open(template_filename)
        new_contents = template_file.read().replace("{{{body}}}",body_contents).replace("{{{title}}}",Stem_filepaths[i].name.split(".html")[0])
        new_contents = new_contents.replace("{{{next_page}}}",next_page);
        new_contents = new_contents.replace("{{{previous_page}}}",previous_page);
        CreateAndWriteContentsToFile(new_contents,pathname)
        
        
        
GenerateFilesFromStemAndTemplate("new-main-body-template.html","Content")