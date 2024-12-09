def copy(arr):
  array=[]
  for i in arr:
    array.append(i.copy())
  return array

def counting(arr,bagNo):
  dic={}
  for i in arr:
    j=i[bagNo]
    for k in j:
      if dic.get(k)==None:
        dic[k]=1 # dickkkkkkkk
      else:
        dic[k]+=1
  return dic

bagState=[
  ["R","R","B","B","B"], # bag "0"
  ["R","R","R","B"] # bag "1"
]
transformationI=[
  [0,1], # put a ball from bag "0" to bag "1"
  [0,1], # put a ball from bag "0" to bag "1"
  [1,0], # put a ball from bag "1" to bag "0"
]

def events(bags,transformation):
  possibilities=[copy(bags)]
  for transform in transformation:
    array=[]
    for possibility in possibilities:
      for i in range(len(possibility[transform[0]])):
        bag=copy(possibility)
        bag[transform[1]].append(bag[transform[0]].pop(i))
        array.append(bag)
    possibilities=array
  return possibilities



totalEvents=events(copy(bagState),copy(transformationI))
# we got all possible combinations, now lets calculate probability
balls=counting(totalEvents,1) # we are extracting last ball from bag "1"
print(f'{balls["B"]}/{balls["B"]+balls["R"]}')
