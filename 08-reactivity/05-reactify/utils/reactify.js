import { forEach } from 'lodash';
import { computed, isRef } from 'vue';

/**
 * @template T
 * @param {function(...[*]): T} func - Исходная функция вычисления
 * @returns {function(...[*]): ComputedRef<T>} - Функция вычисления от ref-ов, возвращающая вычисляемое значение computed
 */
export function reactify(func) {
  // ...

  return (...arg)=>{return computed( ()=>{ 
    let adaptiveArgs = []
    for(let a of arg){
      if(isRef(a)) a = a.value  
      adaptiveArgs.push(a)
    } 
    return func(...adaptiveArgs) 
  } 
  )};

}
