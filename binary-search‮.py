"""
from math import modf

def evaluate(arr):
  return arr[0]/arr[1]

def distance(target,destination):
  return evaluate(destination)-target

def selector(arr):
  return [arr[0][0]+arr[1][0],arr[0][1]+arr[1][1]]

def search(num):
  fraction,integer=modf(num)
  approx,dist=[[0,1],[1,1]],1
  history=[]
  while dist>0.000001:
    approximation=selector(approx)
    history.append(approximation)
    mockdist=distance(fraction,approximation)
    dist=abs(mockdist)
    if mockdist<0:
      approx[1]=approximation
    elif mockdist>0:
      approx[0]=approximation
    else:
      return history
  return history
"""

import math

def Num(num):
  return num[0]/num[1]

def Revshift(arr,shift):
  array=[]
  for i in range(len(arr)-1,-1,-1):
    array.append([arr[i][0]+shift*arr[i][1],arr[i][1]])
  return array

def approximater(number,Len):
  fract=math.fmod(number,1)
  numMin,numMax,approxList=[0,1],[1,1],[[1,1]]
  for i in range(Len):
    center=[numMin[0]+numMax[0],numMin[1]+numMax[1]]
    distFromMin=math.fabs(Num(numMin)-fract)
    distFromMax=math.fabs(Num(numMax)-fract)
    distFromCenter=math.fabs(Num(center)-fract)
    if distFromCenter<=distFromMin and distFromCenter<=distFromMax:
      if approxList[len(approxList)-1]!=center:
        approxList.append(center)
      if fract<Num(center):
        numMax=center
      elif fract>Num(center):
        numMin=center
      else:
        break
    elif distFromMin<distFromCenter:
      if approxList[len(approxList)-1]!=numMin:
        approxList.append(numMin)
      numMax=center
    elif distFromMax<distFromCenter:
      if approxList[len(approxList)-1]!=numMax:
        approxList.append(numMax)
      numMin=center
    else:
      print("something went wrong")
      return Revshift(approxList,math.floor(number))
  return Revshift(approxList,math.floor(number))
