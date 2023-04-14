# -*- coding: utf-8 -*-
"""
Created on Tue Feb 14 14:08:57 2023

@author: cpers
"""

from pathlib import Path
import os
import re
import random

def writeExam(sectionNumber, examNumber, examDate, directions,questions):
    examTemplate = open("Exam Template.tex")
    examBody = examTemplate.read()
    examTemplate.close()
    Macros={
            "!!!SectionNumber!!!":sectionNumber,
            "!!!ExamNumber!!!":examNumber,
            "!!!ExamDate!!!":examDate,
            "!!!Directions!!!":directions,
            "!!!Questions!!!":""
            }
    for question in questions:
        content=open(question).read()
        Macros["!!!Questions!!!"]+=r"\question "+content+"\n"
    for key in Macros:
        value = Macros[key]
        examBody=examBody.replace(key,value)
    
    newExam=open("Math 120R-"+Macros["!!!SectionNumber!!!"]+" "+Macros["!!!ExamDate!!!"]+".tex",'w')
    newExam.write(examBody)
    newExam.close()

