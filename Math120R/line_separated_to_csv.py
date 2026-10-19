# -*- coding: utf-8 -*-
"""
Created on Fri Jan 23 10:15:55 2026

@author: cpers
"""

from pathlib import Path
import os

data_file = open("sea_level_data.dat","r")
output_file = open("sea_level_data.csv","w")

contents = data_file.read()
lines = contents.split("\n")
output = ""
for line in lines:
    line_contents = line.split(" ")
    for element in line_contents:
        if len(element)>0:
            output+=f"{element}, "
    output=output[0:-2] #remove trailing comma and space
    output+="\n"
    

print(output)

data_file.close()
output_file.write(output)
output_file.close()