"use strict";
const EventDispatcher=function(reference){
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
};
