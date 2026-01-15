# -*- coding: utf-8 -*-
"""
Created on February 2nd 2023

@author: cpers
"""

from pathlib import Path
import os
import re
import markdown
from bs4 import BeautifulSoup
import re

DEBUG = False
#URL = "https://cwpersonrennell.github.io/Math/Math120R/Content"
URL = "https://uamathematics.com/120R"
def FlattenStringArray(array,md = False):
    result = ""
    for i in range(0, len(array)):
        if(md):
            result += markdown.markdown(str(array[i]))
        else:
            result += str(array[i])
    return result

def CompileTab(content,name, n):
    tab = f"<details class='item' name='alpha' open style='--n: {n}'><summary class='subitem'>{name} </summary><div> {content} </div></details>"
    return tab

def CompileTabStyle(n):
    result = f"""<style>
        .grid{{
            display:grid;
            grid-template-columns:repeat({n},minmax(200px,1fr));
            grid-template-rows:auto 1fr;
            column-gap: 1rem;
            }}

         details{{
            display:grid;
            grid-template-columns:subgrid;
            grid-template-rows:subgrid;
            grid-column: 1 / -1;
            grid-row: 1 / span {n};
        }}

        details::details-content{{
          grid-row: 2;
          grid-column: 1 / -1;
          padding: 1rem;
          border-bottom: 2px solid black;
        }}
        
        details:not([open])::details-content{{
          display:none;
        }}
        
        summary{{
          grid-row: 1;
          display: grid;
          padding: 1rem;
          border-bottom:2px solid black;
          cursor:pointer;
          z-index: 1;
        }}
        
        details[open] summary{{
          font-weight:bold;
        }}"""
    for i in range(1,n+1):
        result+=f"""
        details:nth-of-type({i}) summary{{
            grid-column: {i} / span 1;
        }}
    """
    result +="""
        summary{
            grid-column: var(--n) / span 1;
          }
    
    </style>"""
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
    if len(tabs) == 0:
        result = FlattenStringArray(soup.contents)
        return [result,""]

    for i in range(0, len(tabs)):
        result += CompileTab(FlattenStringArray(tabs[i].contents, True),tabs[i].attrs['name'],i+1)
        
    return [result, CompileTabStyle(len(tabs))]

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
        
        next_page = "index.html"
        previous_page = "index.html"
        try:
            if(i<len(Stem_filepaths)):
                next_page = os.fspath(Stem_filepaths[i+1]).replace("Stems\\","").replace("\\","/")
            if(i>0):
                previous_page = os.fspath(Stem_filepaths[i-1]).replace("Stems\\","").replace("\\","/")
        except IndexError as e:
            print(e)
        #print(previous_page+"-->"+next_page)
        pathname= os.fspath(Stem_filepaths[i].absolute()).replace("Stems\\",directory+"\\")
        #Some older files from D2L doubled braces unneccessarily, this removes them.
        #body_contents = removeDoubleBraces(open(Stem_filepaths[i]).read())
        
        tabs, tab_style = CompileFile(Stem_filepaths[i])
        
        #Write the actual Source Html File        
        template_file = open(template_filename)
        contents = template_file.read().replace("{{{tab_style}}}", tab_style)
        contents = contents.replace("{{{tabs}}}", tabs)
        contents = contents.replace("{{{title}}}",Stem_filepaths[i].name.split(".html")[0])
        CreateAndWriteContentsToFile(contents,pathname)

def CreateLink(filepath,label):
    filepath = filepath.replace("\\","/")
    result = f'<a href="{URL}/{filepath}">{label}</a>'
    return result
        
def BuildProject(template_filename,top):
    Stem_filepaths, Stems = CompileStems()
    MakeTargetDirectoriesFromStems(Stems,top)
    for root, dirs, files in os.walk(".\Stems"):
        new_root = root.replace("Stems",top)
        top_root = root.replace("Stems",top)
        index_file = open(f"{new_root}\index.html", "w")
        index_file.write("")
        new_root = root.replace(".\\Stems\\","")
        if(new_root == ".\\Stems"):new_root = "Home"
        index = CreateLink(f"{new_root}\index.html",new_root)
        #body = f"<title>{new_root}</title><h1>{new_root}</h1>"
        body = ""
        template_file = open("index-template.html","r")
        index_contents = template_file.read()
        
        root_link = CreateLink("index.html", "Home")
        breadcrumb = f'<div><em>{root_link} / '
        
        link_list = f"<ul>\n"
        if(len(files)>0):
            breadcrumb+=CreateLink(f"{new_root}\index.html",new_root)
            for i in range(0,len(files)):
                source_filename = f"{root}\{files[i]}"
                target_filename = f"{top_root}\{files[i]}"
                
                source_file = open(source_filename,"r")
                template_file = open(template_filename)
                
                tabs, tab_style = CompileFile(source_filename)
                contents = template_file.read().replace("{{{tab_style}}}", tab_style)
                contents = contents.replace("{{{tabs}}}", tabs)
                contents = contents.replace("{{{title}}}",new_root)
                contents = contents.replace("{{{breadcrumb}}}",breadcrumb+f" / {files[i].replace('.html','')}</em></div>")
                next_page=CreateLink("index.html","Next")
                previous_page=CreateLink("index.html","Back")
                try:
                    if(i<len(files)-1):
                        next_page = CreateLink(f"{new_root}\{files[i+1]}","Next")
                    if(i>0):
                        previous_page = CreateLink(f"{new_root}\{files[i-1]}","Back")
                except IndexError as e:
                    print(e)
                
                contents = contents.replace("{{{previous_page}}}",previous_page)
                contents = contents.replace("{{{next_page}}}", next_page)
                
                CreateAndWriteContentsToFile(contents,target_filename)
                source_file.close()
                template_file.close()
                
                link_list +="<li>"+CreateLink(f"{new_root}\{files[i]}",files[i].replace(".html",""))+"</li>\n"
        if(len(dirs)>0):
            for i in range(0, len(dirs)):
                link_list+="<li>"+CreateLink(dirs[i]+"/index.html",dirs[i])+"</li>\n"
        link_list +=f"</ul>\n"
        body+=breadcrumb +"</em></div>\n"
        body+=link_list
        index_contents=index_contents.replace("{{{body}}}",body)
        index_contents = index_contents.replace("{{{title}}}",new_root)
        index_file.write(index_contents)
        index_file.close()
            
        
#GenerateFilesFromStemAndTemplate("new-main-body-template.html","Content")
BuildProject("new-main-body-template.html","120R")