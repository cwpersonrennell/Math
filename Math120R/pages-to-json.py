# -*- coding: utf-8 -*-
"""
Created on Fri Sep  1 16:17:29 2023

@author: cpers
"""

import os
result = {}
for root, dir_names, file_names in os.walk("./Stems"):
    if(len(file_names)>0):
        r = root.replace("./Stems\\","")
        s = r.split("\\")
        
        print(s)
        if(s[0].find("Chapter")>=0):
            try:
                result[s[0]]
            except KeyError:
                result[s[0]]={}
            try:
                result[s[0]][s[1]]
            except KeyError:
                result[s[0]][s[1]]=[]
            
            for file in file_names:
                result[s[0]][s[1]].append(file)
        
print(result)