"use strict";
const zoomDispatcher=function(reference){
  if(reference.pointerTracker){
    console.warn(`Pre-defined zoom listener on ${reference} object. ignoring this call.`);
    return;
  }
  reference.pointerTracker={
    scale:1,
    rotation:0,
    shift:{x:0,y:0},
    maxPointersStepped:0
  };
  reference.addEventListener("touchstart",function(Event){
    const viewportMin=1/Math.min(window.visualViewport.width,visualViewport.height);
    if(this.pointerTracker.maxPointersStepped<Event.touches.length){
      this.pointerTracker.maxPointersStepped=Event.touches.length;
    }
    for(let id=0;id<Event.touches.length;++id){
      const value=Event.touches[id];
      this.pointerTracker["pointer"+id]=value;
      this.pointerTracker["pointer"+id].Coords={
        x:(2*value.clientX-window.visualViewport.width)*viewportMin,
        y:(window.visualViewport.height-2*value.clientY)*viewportMin
      };
    }
  });
  reference.addEventListener("touchmove",function(Event){
    const viewportMin=1/Math.min(window.visualViewport.width,visualViewport.height);
    if(Event.touches.length==2 && this.pointerTracker.maxPointersStepped==2){
      const pointer0Coords={
        x:(2*Event.touches[0].clientX-window.visualViewport.width)*viewportMin,
        y:(window.visualViewport.height-2*Event.touches[0].clientY)*viewportMin
      };
      const pointer1Coords={
        x:(2*Event.touches[1].clientX-window.visualViewport.width)*viewportMin,
        y:(window.visualViewport.height-2*Event.touches[1].clientY)*viewportMin
      }
      const distance=Math.hypot(this.pointerTracker.pointer1.Coords.x-this.pointerTracker.pointer0.Coords.x,this.pointerTracker.pointer1.Coords.y-this.pointerTracker.pointer0.Coords.y);
      const newDistance=Math.hypot(pointer1Coords.x-pointer0Coords.x,pointer1Coords.y-pointer0Coords.y);
      const angle=Math.atan2(this.pointerTracker.pointer1.Coords.y-this.pointerTracker.pointer0.Coords.y,this.pointerTracker.pointer1.Coords.x-this.pointerTracker.pointer0.Coords.x);
      const newAngle=Math.atan2(pointer1Coords.y-pointer0Coords.y,pointer1Coords.x-pointer0Coords.x);
      const center={
        x:0.5*(this.pointerTracker.pointer0.Coords.x+this.pointerTracker.pointer1.Coords.x),
        y:0.5*(this.pointerTracker.pointer0.Coords.y+this.pointerTracker.pointer1.Coords.y)
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
      values.scale=this.pointerTracker.scale=this.pointerTracker.scale*values.deltaScale;
      values.rotation=this.pointerTracker.rotation=this.pointerTracker.rotation+values.deltaRotation;
      values.shift=this.pointerTracker.shift={x:this.pointerTracker.shift.x+values.deltaShift.x,y:this.pointerTracker.shift.y+values.deltaShift.y};
      this.dispatchEvent(new CustomEvent("zoom",{
        detail:values,
        bubbles:true,
        composed:true
      }));
      this.pointerTracker.pointer0=Event.touches[0];
      this.pointerTracker.pointer1=Event.touches[1];
      this.pointerTracker.pointer0.Coords=pointer0Coords;
      this.pointerTracker.pointer1.Coords=pointer1Coords;
    }else{
      for(let id=0;id<Event.touches.length;++id){
        const value=Event.touches[id];
        this.pointerTracker["pointer"+id]=value;
        this.pointerTracker["pointer"+id].Coords={
          x:(2*value.clientX-window.visualViewport.width)*viewportMin,
          y:(window.visualViewport.height-2*value.clientY)*viewportMin
        };
      }
    }
  });
  reference.addEventListener("touchend",function(Event){
    if(Event.touches.length==0){
      this.pointerTracker.maxPointersStepped=0;
    }
  });
};
