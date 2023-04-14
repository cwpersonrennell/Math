content = r"""
Solve for \(w\):
\[
\frac{ {a}w^3-{b}w^2 }{ {c}w-{d} }=0
\]
"""
a=1
b=2
c=3
d=5
context=vars()

def texWriter(content,context):
    result = content
    for var in context:
        result=result.replace("{"+var+"}",str(context[var]))
    return result
        
print(texWriter(content,context))