from PIL import Image,ImageFilter,ImageChops, ImageEnhance
import math

def fetchKernelValue(kernel,id):
  if id==0:
    return kernel[1][2]
  elif id==1:
    return kernel[0][2]
  elif id==2:
    return kernel[0][1]
  elif id==3:
    return kernel[0][0]
  elif id==4:
    return kernel[1][0]
  elif id==5:
    return kernel[2][0]
  elif id==6:
    return kernel[2][1]
  elif id==7:
    return kernel[2][2]

def putKernelValue(kernel,id,val):
  if id==0:
    kernel[1][2]=val
  elif id==1:
    kernel[0][2]=val
  elif id==2:
    kernel[0][1]=val
  elif id==3:
    kernel[0][0]=val
  elif id==4:
    kernel[1][0]=val
  elif id==5:
    kernel[2][0]=val
  elif id==6:
    kernel[2][1]=val
  elif id==7:
    kernel[2][2]=val

def matrixMul(mat,vec):
  return [
    mat[0][0]*vec[0]+mat[0][1]*vec[1],
    mat[1][0]*vec[0]+mat[1][1]*vec[1]
  ]

def kernelRotater3x3(kernel,theta,error):
  if error<1e-6:
    raise BaseException("Error is too small, computation not possible")
  theta=math.fmod(theta,2*math.pi)
  mat=[
    [math.cos(theta),-math.sin(theta)],
    [math.sin(theta),math.cos(theta)]
  ]
  vecs=[
    [1,0],[1,1],[0,1],
    [-1,1],[-1,0],[-1,-1],
    [0,-1],[1,-1]
  ]
  finalKernel=[
    [None,None,None],
    [None,kernel[1][1],None],
    [None,None,None]
  ]
  minDist=math.sqrt(2)*math.sqrt(2-math.sqrt(2))+1e-8
  for i in range(8):
    result=matrixMul(mat,vecs[i])
    suitableResults=[]
    for j in range(8):
      difference=[
        result[0]-vecs[j][0],
        result[1]-vecs[j][1]
      ]
      distance=math.hypot(difference[0],difference[1])
      if distance<minDist:
        if distance<1e-10:
          suitableResults=[[j,None]]
          break
        else:
          suitableResults.append([j,math.pow(distance,-1/error)])
    if len(suitableResults)==1:
      suitableId=suitableResults[0][0]
      putKernelValue(
        finalKernel,
        suitableId,
        fetchKernelValue(kernel,i)
        +(0 if 
          fetchKernelValue(finalKernel,suitableId) is None 
        else 
          fetchKernelValue(finalKernel,suitableId)
        )
      )
    else:
      totalDistance=0
      for results in suitableResults:
        totalDistance+=0 if results[1] is None else results[1]
      for results in suitableResults:
        putKernelValue(
          finalKernel,
          results[0],
          results[1]*fetchKernelValue(kernel,i)/totalDistance
          +(0 if 
            fetchKernelValue(finalKernel,results[0]) is None 
          else 
            fetchKernelValue(finalKernel,results[0])
          )
        )
  return finalKernel

def getFilter3x3(inputKernel):
  kernel=[
    inputKernel[0][0],
    inputKernel[0][1],
    inputKernel[0][2],
    inputKernel[1][0],
    inputKernel[1][1],
    inputKernel[1][2],
    inputKernel[2][0],
    inputKernel[2][1],
    inputKernel[2][2]
  ]
  return ImageFilter.Kernel(
    size=(3,3),
    kernel=kernel,
    scale=1,offset=0
  )
  

edgeKernel=[
  [-1,-1,-1],
  [-1,8,-1],
  [-1,-1,-1]
]
boxBlurKernel=[
  [1/9,1/9,1/9],
  [1/9,1/9,1/9],
  [1/9,1/9,1/9]
]
mixBlurKernel=[
  [1/12,1/6,1/12],
  [1/6,0,1/6],
  [1/12,1/6,1/12]
]
sobelHorizontalKernel=[
  [-1,0,1],
  [-2,0,2],
  [-1,0,1]
]
sobelVerticalKernel=[
  [-1,-2,-1],
  [0,0,0],
  [1,2,1]
]
prewittHorizontalKernel=[
  [-1,0,1],
  [-1,0,1],
  [-1,0,1]
]
prewittVerticalKernel=[
  [-1,-1,-1],
  [0,0,0],
  [1,1,1]
]
laplacianEdgeKernel=[
  [0,1,0],
  [1,-4,1],
  [0,1,0]
]

def getSobelImageEdges(img,err):
  return ImageChops.subtract(
    Image.blend(
      Image.blend(
        ImageChops.add(
          img.filter(getFilter3x3(kernelRotater3x3(sobelVerticalKernel,math.pi/4,err))),
          img.filter(getFilter3x3(kernelRotater3x3(sobelVerticalKernel,-3*math.pi/4,err))),
          scale=1,offset=0
        ),
        ImageChops.add(
          img.filter(getFilter3x3(kernelRotater3x3(sobelHorizontalKernel,math.pi/4,err))),
          img.filter(getFilter3x3(kernelRotater3x3(sobelHorizontalKernel,-3*math.pi/4,err))),
          scale=1,offset=0
        ),
        alpha=0.5
      ),
      Image.blend(
        ImageChops.add(
          img.filter(getFilter3x3(sobelVerticalKernel)),
          img.filter(getFilter3x3(kernelRotater3x3(sobelVerticalKernel,math.pi,err))),
          scale=1,offset=0
        ),
        ImageChops.add(
          img.filter(getFilter3x3(sobelHorizontalKernel)),
          img.filter(getFilter3x3(kernelRotater3x3(sobelHorizontalKernel,math.pi,err))),
          scale=1,offset=0
        ),
        alpha=0.5
      ),
      alpha=0.5
    ),
    ImageEnhance.Brightness(img.filter(getFilter3x3(laplacianEdgeKernel))).enhance(0.5),
  scale=1,offset=0
  )

def getPrewittImageEdges(img,err):
  return ImageChops.subtract(
    Image.blend(
      Image.blend(
        ImageChops.add(
          img.filter(getFilter3x3(kernelRotater3x3(prewittVerticalKernel,math.pi/4,err))),
          img.filter(getFilter3x3(kernelRotater3x3(prewittVerticalKernel,-3*math.pi/4,err))),
          scale=1,offset=0
        ),
        ImageChops.add(
          img.filter(getFilter3x3(kernelRotater3x3(prewittHorizontalKernel,math.pi/4,err))),
          img.filter(getFilter3x3(kernelRotater3x3(prewittHorizontalKernel,-3*math.pi/4,err))),
          scale=1,offset=0
        ),
        alpha=0.5
      ),
      Image.blend(
        ImageChops.add(
          img.filter(getFilter3x3(prewittVerticalKernel)),
          img.filter(getFilter3x3(kernelRotater3x3(prewittVerticalKernel,math.pi,err))),
          scale=1,offset=0
        ),
        ImageChops.add(
          img.filter(getFilter3x3(prewittHorizontalKernel)),
          img.filter(getFilter3x3(kernelRotater3x3(prewittHorizontalKernel,math.pi,err))),
          scale=1,offset=0
        ),
        alpha=0.5
      ),
      alpha=0.5
    ),
    ImageEnhance.Brightness(img.filter(getFilter3x3(laplacianEdgeKernel))).enhance(0.5),
  scale=1,offset=0
  )

