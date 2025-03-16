export function isClassInRestrictionList(restrictionsList:string[],classList:DOMTokenList):boolean{
  for (const restriction in restrictionsList){
    if(classList.contains(restriction)){
      return true;
    }
  }
  return false;
}

export function isIdInRestrictionList(id:string,restrictionsList:string[]):boolean{
  for (const restriction in restrictionsList){
    if(id === restriction){
      return true;
    }
  }
  return false;
}