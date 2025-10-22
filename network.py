# -*- coding: utf-8 -*-
"""
Created on Thu Apr 24 07:49:59 2025

@author: cpers
"""

import numpy as np

n = [2, 4, 4, 1]

W = np.array([np.random.randn(x, y) for y, x in zip(n[:-1],n[1:]) ],dtype=object)
B = np.array([np.random.randn(x, 1) for x in n[1:]],dtype=object)
for i in range(0, len(n)-1):
    print(W[i].shape, B[i].shape)

X = np.array([
    [1, 0],
    [0, 1],
    [0, 0],
    [1, 1]
    ])
A = []
A.append(X.T)

y = np.array([
    1, 
    1,
    0,
    0
])

m = len(y)
Y=y.reshape(n[-1], m)


def sigmoid(z):
    return 1.0/(1.0+np.exp(-1*z))
def sigmoid_prime(z):
    return sigmoid(z)*(1-sigmoid(z))

def cost(y_hat, y):
    losses = -((y*np.log(y_hat)+(1-y)*np.log(1-y_hat)))
    m = y_hat.reshape(-1).shape[0]
    summed_losses = (1/m)*np.sum(losses, axis=1)
    return np.sum(summed_losses)
    
def forward(x, weights, biases):
    Z = []
    A = []
    A.append(x.T)
    Z.append(x.T)
    for i in range(0, len(n)-1):
        Z.append(weights[i] @ A[i] + biases[i]) # Z[i+1] = W[i] @ A[i] +B[i]
        A.append(sigmoid(Z[i+1]))                #A[i+1] = g(Z[i+1])
    return (Z, A)
                 
for epoch in range(0,100):
    Z, A = forward(X, W, B)
    #Back
    nabla_W = np.array([np.zeros(w.shape) for w in W],dtype=object)
    nabla_B = np.array([np.zeros(b.shape) for b in B],dtype=object)
    alpha = 0.1
    
    delta = (A[-1] - y)
    nabla_W[-1] = delta @ A[-2].T
    nabla_B[-1] = np.sum(delta, axis=1, keepdims=True)
    deltaA = W[-1].T @ delta
    
    for i in range(len(n)-3, 1,-1):
        delta = deltaA*sigmoid_prime(Z[i])
        nabla_W[i]= delta @ A[i-1].T 
        nabla_B[i] = np.sum(delta, axis=1, keepdims=True)
        deltaA = W[i] @ delta
        
    W = W - alpha/m*nabla_W
    B = B - alpha/m*nabla_B
    error = cost(A[-1], y)
    if epoch % 20 == 0 :
        print(f"Epoch {epoch}: cost = {error:4f}")
