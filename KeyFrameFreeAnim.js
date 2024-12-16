class KeyFrameFreeAnimations{
  constructor(position,frequency,damp=1,velocity=0,time=0.001*window.performance.now()){
    this.k1=Math.pow(2*Math.PI*frequency,-2);
    this.k2=damp/(Math.PI*frequency);
    this._data=[{x:position,y:position,dy:velocity,t:time}];
    Object.defineProperty(this._data,"last",{
      get(){
        return this[this.length-1];
      }
    });
    this.discriminant=this.k2*this.k2-4*this.k1;
    this.requiresComplex=this.discriminant<0;
    if(this.requiresComplex){
      this.value1=-0.5*this.k2/this.k1;
      this.value2=0.5*Math.sqrt(-this.discriminant)/this.k1;
    }else{
      this.value1=0.5*(-this.k2+Math.sqrt(this.discriminant))/this.k1;
      this.value2=0.5*(-this.k2-Math.sqrt(this.discriminant))/this.k1;
    }
  }
  nextFrame(position,time){
    if(this._data.length>3){
      this._data.shift();
    }
    const A=(position-this._data.last.x)/(time-this._data.last.t);
    const B=(this._data.last.x*time-position*this._data.last.t)/(time-this._data.last.t);
    const m=this._data.last.y-A*this._data.last.t-B+A*this.k2;
    const n=this._data.last.dy-A;
    if(this.requiresComplex){
      const P=(this.value2*m*Math.cos(this.value2*this._data.last.t)+this.value1*m*Math.cos(this.value2*this._data.last.t)-n*Math.sin(this.value2*this._data.last.t))/(2*Math.exp(this.value1*this._data.last.t)*this.value2);
      const Q=(this.value1*m*Math.cos(this.value2*this._data.last.t)-this.value2*m*Math.sin(this.value2*this._data.last.t)-n*Math.cos(this.value2*this._data.last.t))/(2*Math.exp(this.value1*this._data.last.t)*this.value2);
      const newy=2*P*Math.exp(this.value1*time)*Math.cos(this.value2*time)-2*Q*Math.exp(this.value1*time)*Math.sin(this.value2*time)+A*time-this.k2*A+B;
      const newdy=2*(P*this.value1-Q*this.value2)*Math.exp(this.value1*time)*Math.cos(this.value2*time)-2*(P*this.value2+Q*this.value1)*Math.exp(this.value1*time)*Math.sin(this.value2*time)+A;
      if(isNaN(newy)){
        throw Error(newy);
      }
      this._data.push({x:position,y:newy,dy:newdy,t:time});
    }else{
      const P=(-this.value2*m+n)/(Math.exp(this.value1*this._data.last.t)*(this.value1-this.value2));
      const Q=(this.value1*m-n)/(Math.exp(this.value2*this._data.last.t)*(this.value1-this.value2));
      const newy=P*Math.exp(this.value1*time)+Q*Math.exp(this.value2*time)+A*time-this.k2*A+B;
      const newdy=P*this.value1*Math.exp(this.value1*time)+Q*this.value2*Math.exp(this.value2*time)+A;
      if(isNaN(newy)){
        throw Error(newy);
      }
      this._data.push({x:position,y:newy,dy:newdy,t:time});
    }
  }
}
