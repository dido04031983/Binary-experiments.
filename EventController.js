"use strict";
/*const EventDispatcher=function(reference){
  if(reference.ptrTracker){
    console.warn(`Pre-defined zoom and swipe listener on ${reference} object. ignoring this call.`);
    return reference;
  }
  reference.ptrTracker={
    scale:1,
    rotation:0,
    shift:{x:0,y:0},
    noBackSwipe:null,
    maxPointersStepped:0,
    eventStartPos:{x:null,y:null,time:null}
  };
  reference.addEventListener("touchstart",function(Event){
    const ptrTracker=this.ptrTracker;
    const viewportMin=1/Math.min(window.visualViewport.width,visualViewport.height);
    if(ptrTracker.maxPointersStepped<Event.touches.length){
      ptrTracker.maxPointersStepped=Event.touches.length;
    }
    for(let id=0;id<Event.touches.length;++id){
      const value=Event.touches[id];
      ptrTracker["ptr"+id]=value;
      ptrTracker["ptr"+id].Coords={
        x:(2*value.clientX-window.visualViewport.width)*viewportMin,
        y:(window.visualViewport.height-2*value.clientY)*viewportMin
      };
      if(ptrTracker.maxPointersStepped==1){
        ptrTracker.eventStartPos={...ptrTracker["ptr"+id].Coords,time:Event.timeStamp};
        ptrTracker.noBackSwipe=null;
      }
    }
  },false);
  reference.addEventListener("touchmove",function(Event){
    const ptrTracker=this.ptrTracker;
    const viewportMin=1/Math.min(window.visualViewport.width,visualViewport.height);
    if(Event.touches.length==2 && ptrTracker.maxPointersStepped==2){
      const pointer0Coords={
        x:(2*Event.touches[0].clientX-window.visualViewport.width)*viewportMin,
        y:(window.visualViewport.height-2*Event.touches[0].clientY)*viewportMin
      };
      const pointer1Coords={
        x:(2*Event.touches[1].clientX-window.visualViewport.width)*viewportMin,
        y:(window.visualViewport.height-2*Event.touches[1].clientY)*viewportMin
      }
      const distance=Math.hypot(ptrTracker.ptr1.Coords.x-ptrTracker.ptr0.Coords.x,ptrTracker.ptr1.Coords.y-ptrTracker.ptr0.Coords.y);
      const newDistance=Math.hypot(pointer1Coords.x-pointer0Coords.x,pointer1Coords.y-pointer0Coords.y);
      const angle=Math.atan2(ptrTracker.ptr1.Coords.y-ptrTracker.ptr0.Coords.y,ptrTracker.ptr1.Coords.x-ptrTracker.ptr0.Coords.x);
      const newAngle=Math.atan2(pointer1Coords.y-pointer0Coords.y,pointer1Coords.x-pointer0Coords.x);
      const center={
        x:0.5*(ptrTracker.ptr0.Coords.x+ptrTracker.ptr1.Coords.x),
        y:0.5*(ptrTracker.ptr0.Coords.y+ptrTracker.ptr1.Coords.y)
      }
      const newCenter={
        x:0.5*(pointer0Coords.x+pointer1Coords.x),
        y:0.5*(pointer0Coords.y+pointer1Coords.y)
      };
      const values={
        scale:null,
        deltaScale:newDistance/distance,
        rotation:null,
        deltaRotation:newAngle-angle,
        shift:{x:null,y:null},
        deltaShift:{
          x:newCenter.x-center.x,
          y:newCenter.y-center.y
        }
      };
      values.scale=ptrTracker.scale=ptrTracker.scale*values.deltaScale;
      values.rotation=ptrTracker.rotation=ptrTracker.rotation+values.deltaRotation;
      values.shift=ptrTracker.shift={x:ptrTracker.shift.x+values.deltaShift.x,y:ptrTracker.shift.y+values.deltaShift.y};
      this.dispatchEvent(new CustomEvent("zoom",{
        detail:values,
        bubbles:true,
        composed:true
      }));
      ptrTracker.ptr0=Event.touches[0];
      ptrTracker.ptr1=Event.touches[1];
      ptrTracker.ptr0.Coords=pointer0Coords;
      ptrTracker.ptr1.Coords=pointer1Coords;
    }else{
      for(let id=0;id<Event.touches.length;++id){
        const value=Event.touches[id];
        const coords={
          x:(2*value.clientX-window.visualViewport.width)*viewportMin,
          y:(window.visualViewport.height-2*value.clientY)*viewportMin
        };
        if(ptrTracker.maxPointersStepped==1 && Math.hypot(coords.x-ptrTracker.eventStartPos.x,coords.y-ptrTracker.eventStartPos.y)>Math.hypot(ptrTracker["ptr"+id].Coords.x-ptrTracker.eventStartPos.x,ptrTracker["ptr"+id].Coords.y-ptrTracker.eventStartPos.y)){
          if(ptrTracker.noBackSwipe==null){
            ptrTracker.noBackSwipe=true;
          }
          ptrTracker.noBackSwipe&=true;
        }else{
          ptrTracker.noBackSwipe=false;
        }
        ptrTracker["ptr"+id]=value;
        ptrTracker["ptr"+id].Coords=coords;
      }
    }
  },false);
  reference.addEventListener("touchend",function(Event){
    const ptrTracker=this.ptrTracker;
    if(Event.touches.length==0){
      ptrTracker.maxPointersStepped=0;
      if(ptrTracker.noBackSwipe && Event.timeStamp-ptrTracker.eventStartPos.time<200){
        const distance=Math.hypot(ptrTracker.ptr0.Coords.x-ptrTracker.eventStartPos.x,ptrTracker.ptr0.Coords.y-ptrTracker.eventStartPos.y);
        const angle=Math.atan2(ptrTracker.ptr0.Coords.y-ptrTracker.eventStartPos.y,ptrTracker.ptr0.Coords.x-ptrTracker.eventStartPos.x);
        this.dispatchEvent(new CustomEvent("swipe",{
          detail:{
            startPos:ptrTracker.eventStartPos,
            endPos:ptrTracker.ptr0.Coords,
            distance,angle
          },
          bubbles:true,
          composed:true
        }));
      }
    }
  },true);
  return reference;
};*/

const EventInterface=function(element,options){
  class Pointer{
    constructor(){
      this.reset();
    }
    get secondLatest(){
      return this.last==null?this.first:this.secondLast;
    }
    get latest(){
      return this.last==null?this.secondLast==null?this.first:this.secondLast:this.last;
    }
    pointerPush(data){
      if(this.secondLast==null){
        this.secondLast=data;
      }else if(this.last==null){
        this.last=data;
      }else{
        this.secondLast=this.last;
        this.last=data;
      }
    }
    importData(pointer){
      this.first=pointer.first;
      this.secondLast=pointer.secondLast;
      this.last=pointer.last;
    }
    reset(){
      this.first=null;
      this.secondLast=null;
      this.last=null;
    }
  }
  if(options.swipeActionMinTime<0 || options.swipeActionMaxTime<0 || options.swipeActionMaxTime<50+options.swipeActionMinTime){
    console.error("unable to bind element to paper controls.",element);
    throw new Error("Invalid options for Event Interface");
  }
  const settings={
    swipeActionMinTime:options.swipeActionMinTime,
    swipeActionMaxTime:options.swipeActionMaxTime
  };
  const iObject={
    extract:function(pointer,time){
      return {
        id:pointer.identifier,
        clientX:pointer.clientX,
        clientY:pointer.clientY,
        timeStamp:time
      };
    },
    parseSwipe:function(captures){
      if(captures.first==null || captures.secondLast==null || captures.last==null){
        return {isSwipe:false};
      }
      const deltaTime=captures.last.timeStamp-captures.first.timeStamp;
      if(deltaTime<settings.swipeActionMinTime || deltaTime>settings.swipeActionMaxTime){
        return {isSwipe:false};
      }
      const avgInitialVector={
        x:captures.first.clientX,
        y:captures.first.clientY
      };
      const instantInitialVector={
        x:captures.secondLast.clientX,
        y:captures.secondLast.clientY
      };
      const finalVector={
        x:captures.last.clientX,
        y:captures.last.clientY
      };
      return {
        isSwipe:true,
        data:{
          detail:{
            deltaTime,finalVector,
            avgInitialVector,
            get avgDropVector(){
              if(this._avgDropVector==undefined){
                this._avgDropVector={
                  x:this.finalVector.x-this.avgInitialVector.x,
                  y:this.finalVector.y-this.avgInitialVector.y
                };
              }
              return this._avgDropVector;
            },
            get avgDropLength(){
              if(this._avgDropLength==undefined){
                this._avgDropLength=Math.hypot(this.avgDropVector.x,this.avgDropVector.y);
              }
              return this._avgDropLength;
            },
            get avgDropVelocity(){
              if(this._avgDropVelocity==undefined){
                this._avgDropVelocity={
                  x:this.avgDropVector.x/this.deltaTime,
                  y:this.avgDropVector.y/this.deltaTime
                };
              }
              return this._avgDropVelocity;
            },
            get avgDropSpeed(){
              if(this._avgDropSpeed==undefined){
                this._avgDropSpeed=Math.hypot(this.avgDropVelocity.x,this.avgDropVelocity.y);
              }
              return this._avgDropSpeed;
            },
            get avgDropAngle(){
              if(this._avgDropAngle==undefined){
                this._avgDropAngle=Math.atan2(-this.avgDropVector.y,this.avgDropVector.x);
              }
              return this._avgDropAngle;
            },
            instantInitialVector,
            get instantDropVector(){
              if(this._instantDropVector==undefined){
                this._instantDropVector={
                  x:this.finalVector.x-this.instantInitialVector.x,
                  y:this.finalVector.y-this.instantInitialVector.y
                };
              }
              return this._instantDropVector;
            },
            get instantDropLength(){
              if(this._instantDropLength==undefined){
                this._instantDropLength=Math.hypot(this.instantDropVector.x,this.instantDropVector.y);
              }
              return this._instantDropLength;
            },
            get instantDropVelocity(){
              if(this._instantDropVelocity==undefined){
                this._instantDropVelocity={
                  x:this.instantDropVector.x/this.deltaTime,
                  y:this.instantDropVector.y/this.deltaTime
                };
              }
              return this._instantDropVelocity;
            },
            get instantDropSpeed(){
              if(this._instantDropSpeed==undefined){
                this._instantDropSpeed=Math.hypot(this.instantDropVelocity.x,this.instantDropVelocity.y);
              }
              return this._instantDropSpeed;
            },
            get instantDropAngle(){
              if(this._instantDropAngle==undefined){
                this._instantDropAngle=Math.atan2(-this.instantDropVector.y,this.instantDropVector.x);
              }
              return this._instantDropAngle;
            },
          },
          bubbles:true,
          cancelable:true
        }
      };
    },
    parseSlide:function(captures,isOnSwipe){
      const secondLatest=captures.secondLatest;
      const latest=captures.latest;
      const deltaTime=latest.timeStamp-secondLatest.timeStamp;
      const initialPointerPosition={
        x:secondLatest.clientX,
        y:secondLatest.clientY
      };
      const finalPointerPosition={
        x:latest.clientX,
        y:latest.clientY
      };
      return {
        detail:{
          deltaTime,isOnSwipe,
          initialPointerPosition,
          finalPointerPosition,
          get slideVector(){
            if(this._slideVector==undefined){
              this._slideVector={
                x:this.finalPointerPosition.x-this.initialPointerPosition.x,
                y:this.finalPointerPosition.y-this.initialPointerPosition.y
              };
            }
            return this._slideVector;
          },
          get slidingDistance(){
            if(this._slidingDistance==undefined){
              this._slidingDistance=Math.hypot(this.slideVector.x,this.slideVector.y);
            }
            return this._slidingDistance;
          },
          get slidingVelocity(){
            if(this._slidingVelocity==undefined){
              this._slidingVelocity={
                x:this.slideVector.x/this.deltaTime,
                y:this.slideVector.y/this.deltaTime
              };
            }
            return this._slidingVelocity;
          },
          get slidingSpeed(){
            if(this._slidingSpeed==undefined){
              this._slidingSpeed=Math.hypot(this.slidingVelocity.x,this.slidingVelocity.y);
            }
            return this._slidingSpeed;
          },
          get slidingAngle(){
            if(this._slidingAngle==undefined){
              this._slidingAngle=Math.atan2(-this.slideVector.y,this.slideVector.x);
            }
            return this._slidingAngle;
          }
        },
        bubbles:true,
        cancelable:true
      };
    },
    parsePaperControls:function(pointers,changedPointerId){
      const capture1=pointers.pointer1;
      const capture2=pointers.pointer2;
      const deltaTime=Math.max(capture2.latest.timeStamp,capture1.latest.timeStamp)
        -(changedPointerId==1?capture2.latest.timeStamp:changedPointerId==2?capture1.latest.timeStamp:
        Math.max(capture2.secondLatest.timeStamp,capture1.secondLatest.timeStamp));
      const initialStartPoint={
        x:changedPointerId==2?capture1.latest.clientX:capture1.secondLatest.clientX,
        y:changedPointerId==2?capture1.latest.clientY:capture1.secondLatest.clientY
      };
      const initialEndPoint={
        x:changedPointerId==1?capture2.latest.clientX:capture2.secondLatest.clientX,
        y:changedPointerId==1?capture2.latest.clientY:capture2.secondLatest.clientY
      };
      const initialVector={
        x:initialEndPoint.x-initialStartPoint.x,
        y:initialEndPoint.y-initialStartPoint.y
      };
      const finalVector={
        x:capture2.latest.clientX-capture1.latest.clientX,
        y:capture2.latest.clientY-capture1.latest.clientY
      };
      return {
        scaleData:{
          detail:{
            deltaTime,
            initialVector,finalVector,
            get initialGripLength(){
              if(this._initialGripLength==undefined){
                this._initialGripLength=Math.hypot(this.initialVector.x,this.initialVector.y);
              }
              return this._initialGripLength;
            },
            get finalGripLength(){
              if(this._finalGripLength==undefined){
                this._finalGripLength=Math.hypot(this.finalVector.x,this.finalVector.y);
              }
              return this._finalGripLength;
            },
            get scalingFactor(){
              if (this._scalingFactor==undefined){
                this._scalingFactor=this.finalGripLength/this.initialGripLength;
              }
              return this._scalingFactor;
            }
          },
          bubbles:true,
          cancelable:true
        },
        rotateData:{
          detail:{
            deltaTime,
            initialVector,finalVector,
            get initialRotationAngle(){
              if(this._initialRotationAngle==undefined){
                this._initialRotationAngle=-Math.atan2(-this.initialVector.y,this.initialVector.x);
              }
              return this._initialRotationAngle;
            },
            get finalRotationAngle(){
              if(this._finalRotationAngle==undefined){
                this._finalRotationAngle=-Math.atan2(-this.finalVector.y,this.finalVector.x);
              }
              return this._finalRotationAngle;
            },
            get deltaAngle(){
              if(this._deltaAngle==undefined){
                this._deltaAngle=this.finalRotationAngle-this.initialRotationAngle;
              }
              return this._deltaAngle;
            },
            get angularSpeed(){
              if(this._angularSpeed==undefined){
                this._angularSpeed=1000*this.deltaAngle/this.deltaTime;
              }
              return this._angularSpeed;
            }
          },
          bubbles:true,
          cancelable:true
        },
        shiftData:{
          detail:{
            deltaTime,
            initialStartPoint,initialEndPoint,
            finalStartPoint:{
              x:capture1.latest.clientX,
              y:capture1.latest.clientY
            },
            finalEndPoint:{
              x:capture2.latest.clientX,
              y:capture2.latest.clientY
            },
            initialCenter:{
              x:0.5*(initialStartPoint.x+initialEndPoint.x),
              y:0.5*(initialStartPoint.y+initialEndPoint.y)
            },
            finalCenter:{
              x:0.5*(capture1.latest.clientX+capture2.latest.clientX),
              y:0.5*(capture1.latest.clientY+capture2.latest.clientY)
            },
            get shiftVector(){
              if(this._shiftVector==undefined){
                this._shiftVector={
                  x:this.finalCenter.x-this.initialCenter.x,
                  y:this.finalCenter.y-this.initialCenter.y
                };
              }
              return this._shiftVector;
            },
            get deltaShift(){
              if(this._deltaShift==undefined){
                this._deltaShift=Math.hypot(this.shiftVector.x,this.shiftVector.y);
              }
              return this._deltaShift;
            },
            get shiftingVelocity(){
              if(this._shiftingVelocity==undefined){
                this._shiftingVelocity={
                  x:this.shiftVector.x/this.deltaTime,
                  y:this.shiftVector.y/this.deltaTime
                };
              }
              return this._shiftingVelocity;
            },
            get shiftingSpeed(){
              if(this._shiftingSpeed==undefined){
                this._shiftingSpeed=Math.hypot(this.shiftingVelocity.x,this.shiftingVelocity.y);
              }
              return this._shiftingSpeed;
            }
          },
          bubbles:true,
          cancelable:true
        }
      };
    },
    reset:function(){
      this.twoPointers=false;
      this.threePointers=false;
      this.pointerInfo.pointer1.reset();
      this.pointerInfo.pointer2.reset();
    },
    pointerInfo:{
      pointer1:new Pointer(),
      pointer2:new Pointer()
    }
  };
  iObject.reset();
  element.addEventListener("touchstart",function(e){
    if(iObject.threePointers){
      return;
    }
    if(e.touches.length==1){
      iObject.pointerInfo.pointer1.first=iObject.extract(e.touches[0],e.timeStamp);
    }else if(e.touches.length==2){
      if(iObject.twoPointers){
        iObject.pointerInfo.pointer2.first=iObject.extract(e.changedTouches[0],e.timeStamp);
        /*paper resume event*/
      }else{
        iObject.pointerInfo.pointer1.reset();
        iObject.pointerInfo.pointer1.first=iObject.extract(e.touches[0],e.timeStamp);
        iObject.pointerInfo.pointer2.first=iObject.extract(e.touches[1],e.timeStamp);
        /*paper start event*/
        iObject.twoPointers=true;
      }
    }else if(e.touches.length==3){
      /*paper forced end event*/
      iObject.threePointers=true;
    }
  });
  element.addEventListener("touchmove",function(e){
    if(iObject.threePointers){
      return;
    }
    if(e.touches.length==1){
      iObject.pointerInfo.pointer1.pointerPush(iObject.extract(e.touches[0],e.timeStamp));
      const parsedSlideData=iObject.parseSlide(iObject.pointerInfo.pointer1,!iObject.twoPointers);
      element.dispatchEvent(new CustomEvent("slide",parsedSlideData));
    }else if(e.touches.length==2){
      if(e.changedTouches==1){
        iObject.pointerInfo[`pointer${e.changedTouches[0].id+1}`].pointerPush(iObject.extract(e.changedTouches[0],e.timeStamp));
      }else{
        iObject.pointerInfo.pointer1.pointerPush(iObject.extract(e.touches[iObject.pointerInfo.pointer1.first.id==e.touches[0].identifier?0:1],e.timeStamp));
        iObject.pointerInfo.pointer2.pointerPush(iObject.extract(e.touches[iObject.pointerInfo.pointer2.first.id==e.touches[0].identifier?0:1],e.timeStamp));
      }
      const parsedPaperData=iObject.parsePaperControls(iObject.pointerInfo,e.changedTouches==1?e.changedTouches[0].id+1:null);
      parsedPaperData.shiftData.detail.scale=parsedPaperData.scaleData.detail;
      parsedPaperData.shiftData.detail.rotate=parsedPaperData.rotateData.detail;
      element.dispatchEvent(new CustomEvent("scale",parsedPaperData.scaleData));
      element.dispatchEvent(new CustomEvent("rotate",parsedPaperData.rotateData));
      element.dispatchEvent(new CustomEvent("shift",parsedPaperData.shiftData));
    }
  });
  element.addEventListener("touchend",function(e){
    if(e.touches.length==0){
      if(iObject.threePointers){
        return iObject.reset();
      }
      if(iObject.twoPointers){
        /*paper end event*/
      }else{
        const parsedSwipeData=iObject.parseSwipe(iObject.pointerInfo.pointer1);
        if(parsedSwipeData.isSwipe){
          element.dispatchEvent(new CustomEvent("swipe",parsedSwipeData.data));
        }
      }
      iObject.reset();
    }else if(e.touches.length==1){
      if(iObject.threePointers){
        return;
      }
      /*paper pause event*/
      if(e.changedTouches[0].identifier==iObject.pointerInfo.pointer1.first.id){
        iObject.pointerInfo.pointer1.importData(iObject.pointerInfo.pointer2);
      }
      iObject.pointerInfo.pointer2.reset();
    }
  });
};
