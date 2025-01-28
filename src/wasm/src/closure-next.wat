(module
  ;; Memory for array and string operations
  (memory 1)
  (export "memory" (memory 0))

  ;; Array sorting (bubble sort implementation)
  (func $arraySort (param $ptr i32) (param $len i32)
    (local $i i32)
    (local $j i32)
    (local $temp f64)
    
    (block $sort_done
      (loop $outer
        (local.set $j (i32.const 0))
        (block $inner_done
          (loop $inner
            (br_if $inner_done 
              (i32.ge_u (local.get $j) 
                (i32.sub (local.get $len) (i32.const 1))))
            
            ;; Compare adjacent elements
            (if 
              (f64.gt 
                (f64.load (i32.add (local.get $ptr) 
                  (i32.mul (local.get $j) (i32.const 8))))
                (f64.load (i32.add (local.get $ptr) 
                  (i32.mul (i32.add (local.get $j) (i32.const 1)) 
                    (i32.const 8)))))
              (then
                ;; Swap elements
                (local.set $temp 
                  (f64.load (i32.add (local.get $ptr) 
                    (i32.mul (local.get $j) (i32.const 8)))))
                (f64.store 
                  (i32.add (local.get $ptr) 
                    (i32.mul (local.get $j) (i32.const 8)))
                  (f64.load (i32.add (local.get $ptr) 
                    (i32.mul (i32.add (local.get $j) (i32.const 1)) 
                      (i32.const 8)))))
                (f64.store 
                  (i32.add (local.get $ptr) 
                    (i32.mul (i32.add (local.get $j) (i32.const 1)) 
                      (i32.const 8)))
                  (local.get $temp))))
            
            (local.set $j (i32.add (local.get $j) (i32.const 1)))
            (br $inner)))
        
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br_if $outer 
          (i32.lt_u (local.get $i) (local.get $len))))))
  
  ;; Binary search
  (func $arrayBinarySearch 
    (param $ptr i32) (param $len i32) (param $target f64) 
    (result i32)
    (local $left i32)
    (local $right i32)
    (local $mid i32)
    (local $value f64)
    
    (local.set $left (i32.const 0))
    (local.set $right (local.get $len))
    
    (block $search_done
      (loop $search
        (br_if $search_done 
          (i32.ge_s (local.get $left) (local.get $right)))
        
        (local.set $mid 
          (i32.div_u 
            (i32.add (local.get $left) (local.get $right)) 
            (i32.const 2)))
        
        (local.set $value 
          (f64.load (i32.add (local.get $ptr) 
            (i32.mul (local.get $mid) (i32.const 8)))))
        
        (if (f64.eq (local.get $value) (local.get $target))
          (then 
            (return (local.get $mid)))
          (else
            (if (f64.lt (local.get $value) (local.get $target))
              (then
                (local.set $left 
                  (i32.add (local.get $mid) (i32.const 1))))
              (else
                (local.set $right (local.get $mid))))
            (br $search)))))
    
    (i32.const -1))
  
  ;; String comparison
  (func $stringCompare 
    (param $ptr1 i32) (param $len1 i32) 
    (param $ptr2 i32) (param $len2 i32) 
    (result i32)
    (local $i i32)
    (local $char1 i32)
    (local $char2 i32)
    
    (block $compare_done
      (loop $compare
        (br_if $compare_done 
          (i32.or
            (i32.ge_u (local.get $i) (local.get $len1))
            (i32.ge_u (local.get $i) (local.get $len2))))
        
        (local.set $char1 
          (i32.load8_u (i32.add (local.get $ptr1) (local.get $i))))
        (local.set $char2 
          (i32.load8_u (i32.add (local.get $ptr2) (local.get $i))))
        
        (if (i32.ne (local.get $char1) (local.get $char2))
          (then
            (return 
              (i32.sub (local.get $char1) (local.get $char2)))))
        
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $compare)))
    
    (i32.sub (local.get $len1) (local.get $len2)))
  
  ;; String encoding (simple UTF-8)
  (func $stringEncode 
    (param $ptr i32) (param $len i32) 
    (result i32)
    (local $i i32)
    (local $char i32)
    (local $outPtr i32)
    
    (local.set $outPtr 
      (i32.add (local.get $ptr) (local.get $len)))
    
    (block $encode_done
      (loop $encode
        (br_if $encode_done 
          (i32.ge_u (local.get $i) (local.get $len)))
        
        (local.set $char 
          (i32.load8_u (i32.add (local.get $ptr) (local.get $i))))
        
        ;; Simple pass-through for ASCII
        (i32.store8 
          (i32.add (local.get $outPtr) (local.get $i))
          (local.get $char))
        
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $encode)))
    
    (local.get $outPtr))

  ;; Export functions
  (export "arraySort" (func $arraySort))
  (export "arrayBinarySearch" (func $arrayBinarySearch))
  (export "stringCompare" (func $stringCompare))
  (export "stringEncode" (func $stringEncode)))
