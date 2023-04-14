# -*- coding: utf-8 -*-
"""
Created on Wed Feb 22 09:06:56 2023

@author: Chris
"""

from sympy import *
from random import randint, seed
              
        
#seed(1)
x1 = Rational(randint(0,10),randint(1,5))
x1 = (Rational(1,1) if x1==0 else x1)
y1 = Rational(randint(-10,10), randint(1,5))
y1 = (1 if y1==0 else y1)
s  = ("-"if y1<0 else "+")
x2 = randint(-10,int(x1-1))
y2 = randint(-10,10)
y2 = (y1+1 if y2==y1 else y2)

x, y = symbols('x y')

m = Rational(y2-y1,x2-x1)
expr = x-x1

line = m*expr+y1

def pointSlope(m,x1,y1):
    x = symbols("x")
    print(latex(m)+"("+latex(x-x1)+")"+s+latex(abs(y1)))


name = "chris"
text = "Hello {name} glad you could make it. Here is the deal, $y={m!s}{x}{y1:+} $"
print(locals())
print(text.format(**locals()))
