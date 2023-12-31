#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <vector>
#include <cmath>

double Num(std::vector<uint64_t>& num){
  return static_cast<double>(num[0])/num[1];
}

std::vector<std::vector<uint64_t>> Revshift(std::vector<std::vector<uint64_t>> &arr,int shift){
  std::vector<std::vector<uint64_t>> array;
  for(int i=arr.size()-1;i>=0;--i){
    array.push_back({arr[i][0]+shift*arr[i][1],arr[i][1]});
  }
  return array;
}

std::vector<std::vector<uint64_t>> approximater(double number,int Len){
  double fract=fmod(number,1.0);
  std::vector<uint64_t> numMin={0,1};
  std::vector<uint64_t> numMax={1,1};
  std::vector<std::vector<uint64_t>> approxList={{1,1}};

  for (int i=0;i<Len;++i){
    std::vector<uint64_t> center={(numMin[0]+numMax[0]),(numMin[1]+numMax[1])};
    double distFromMin=std::fabs(Num(numMin)-fract);
    double distFromMax=std::fabs(Num(numMax)-fract);
    double distFromCenter=std::fabs(Num(center)-fract);

    if(distFromCenter<=distFromMin && distFromCenter<=distFromMax){
      if(approxList.back()!=center){
        approxList.push_back(center);
      }
      if(fract<Num(center)){
        numMax=center;
      }else if(fract>Num(center)){
        numMin=center;
      }else{
        break;
      }
    }else if(distFromMin<distFromCenter){
      if(approxList.back()!=numMin){
        approxList.push_back(numMin);
      }
      numMax=center;
    }else if(distFromMax<distFromCenter){
      if (approxList.back()!=numMax){
        approxList.push_back(numMax);
      }
      numMin=center;
    }else{
      return Revshift(approxList,static_cast<int>(std::floor(number)));
    }
  }

  return Revshift(approxList,static_cast<int>(std::floor(number)));
}

namespace py=pybind11;

PYBIND11_MODULE(approx,m){
  m.def("Revshift",&Revshift);
  m.def("approximater",&approximater);
}

//g++ -O3 -Wall -shared -std=c++11 -fPIC -I$(python3 -m pybind11 --includes) $(python3-config --cflags) $(python3-config --ldflags) binary-search‮.cpp -o approx`python3-config --extension-suffix`
