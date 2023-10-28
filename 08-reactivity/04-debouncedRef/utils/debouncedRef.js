import { ref, watch } from 'vue';
import debounce from 'lodash/debounce';

/**
 * @template T
 * @param {Ref<T>} source - Исходный ref
 * @param {number} wait - Ожидание в миллисекундах для debounce
 * @returns {Ref<T>} - Новый ref, обновляющийся с debounce при обновлении исходного ref-а
 */
export function debouncedRef(source, wait) {
  const debounced = ref(undefined); // ...
  // ...
  let debounsTimer

  watch(
    ()=>source.value,
    (n,o)=>{
      clearTimeout(debounsTimer)
      debounsTimer = setTimeout(()=>{
        debounced.value = n
      },wait)
    },
    {
      immediate:true,
      
  })

  debounced.value = source.value
  

  return debounced;
}
