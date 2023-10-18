let list=[{value:240,root:"a"},{value:204,root:"b"},{value:170,root:"c"}];
const operand=function(a,b){
  return (~(a&b))&0xff;
};
const RootCodeUsage=function(New,Old){
  if(New.length<Old.length){
    console.log("swap",New,Old);
    return true;
  }
  return false;
}
const UpdateList=function(){
  let templist=[];
  for(let i=0;i<list.length-1;i++){
    for(let j=i+1;j<list.length;j++){
      let result=operand(list[i].value,list[j].value);
      let root=`(${list[i].root}+${list[j].root})`;
      let lastId=null;
      if(!list.some(function(element,id){lastId=id;return element.value==result;})){
        if(!templist.some(function(element,id){lastId=id;return element.value==result;})){
          templist.push({value:result,root});
        }else{
          if(RootCodeUsage(root,templist[lastId].root)){
            templist[lastId]={value:result,root};
          }
        }
      }else{
        if(RootCodeUsage(root,list[lastId].root)){
          list[lastId]={value:result,root};
        }
      }
    }
  }
  templist.forEach(function(element){
    list.push(element);
  });
  list.sort(function(a,b){return a.value-b.value;});
};

addEventListener("dblclick",UpdateList);
