(module
  ;; Import memory from JavaScript
  (import "env" "memory" (memory 1))

  ;; Array sorting (simple bubble sort for now)
  (func $arraySort (param $ptr i32) (param $len i32)
    (local $i i32)
    (local $j i32)
    (local $temp f64)
    
    ;; Outer loop
    (loop $outer
      (local.set $j (i32.const 0))
      
      ;; Inner loop
      (loop $inner
        (if (i32.lt_u (local.get $j) 
            (i32.sub (local.get $len) (i32.const 1)))
          (then
            ;; Compare adjacent elements
            (if (f64.gt 
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
                  (local.get $temp))
              )
            )
            (local.set $j (i32.add (local.get $j) (i32.const 1)))
            (br $inner)
          )
        )
      )
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (if (i32.lt_u (local.get $i) (local.get $len))
        (then (br $outer))
      )
    )
  )

  ;; Binary search
  (func $arrayBinarySearch 
    (param $ptr i32) (param $len i32) (param $target f64) 
    (result i32)
    (local $left i32)
    (local $right i32)
    (local $mid i32)
    (local $value f64)
    
    ;; Initialize bounds
    (local.set $left (i32.const 0))
    (local.set $right (local.get $len))
    
    ;; Binary search loop
    (loop $search
      (if (i32.lt_u (local.get $left) (local.get $right))
        (then
          ;; Calculate midpoint
          (local.set $mid 
            (i32.div_u 
              (i32.add (local.get $left) (local.get $right))
              (i32.const 2)))
          
          ;; Load value at midpoint
          (local.set $value 
            (f64.load 
              (i32.add (local.get $ptr)
                (i32.mul (local.get $mid) (i32.const 8)))))
          
          ;; Compare with target
          (if (f64.eq (local.get $value) (local.get $target))
            (then (return (local.get $mid)))
            (else
              (if (f64.lt (local.get $value) (local.get $target))
                (then
                  (local.set $left 
                    (i32.add (local.get $mid) (i32.const 1))))
                (else
                  (local.set $right (local.get $mid)))
              )
            )
          )
          (br $search)
        )
      )
    )
    ;; Not found
    (i32.const -1)
  )

  ;; String comparison
  (func $stringCompare 
    (param $ptr1 i32) (param $len1 i32) 
    (param $ptr2 i32) (param $len2 i32)
    (result i32)
    (local $i i32)
    (local $char1 i32)
    (local $char2 i32)
    
    ;; Compare characters
    (loop $compare
      (if (i32.and 
            (i32.lt_u (local.get $i) (local.get $len1))
            (i32.lt_u (local.get $i) (local.get $len2)))
        (then
          ;; Load characters
          (local.set $char1 
            (i32.load8_u 
              (i32.add (local.get $ptr1) (local.get $i))))
          (local.set $char2
            (i32.load8_u
              (i32.add (local.get $ptr2) (local.get $i))))
          
          ;; Compare characters
          (if (i32.ne (local.get $char1) (local.get $char2))
            (then
              (return
                (i32.sub 
                  (local.get $char1)
                  (local.get $char2))))
          )
          
          (local.set $i (i32.add (local.get $i) (i32.const 1)))
          (br $compare)
        )
      )
    )
    
    ;; Compare lengths if common prefix matches
    (i32.sub (local.get $len1) (local.get $len2))
  )

  ;; String encoding (simple UTF-8)
  (func $stringEncode (param $ptr i32) (param $len i32) (result i32)
    (local $i i32)
    (local $outPtr i32)
    (local $char i32)
    (local $bytesWritten i32)
    
    ;; Output buffer starts after input
    (local.set $outPtr 
      (i32.add (local.get $ptr)
        (i32.mul (local.get $len) (i32.const 2))))
    
    ;; Encode characters
    (loop $encode
      (if (i32.lt_u (local.get $i) (local.get $len))
        (then
          ;; Load character
          (local.set $char
            (i32.load8_u
              (i32.add (local.get $ptr) (local.get $i))))
          
          ;; Simple UTF-8 encoding
          (if (i32.lt_u (local.get $char) (i32.const 128))
            (then
              ;; ASCII character
              (i32.store8
                (i32.add (local.get $outPtr) (local.get $bytesWritten))
                (local.get $char))
              (local.set $bytesWritten 
                (i32.add (local.get $bytesWritten) (i32.const 1))))
            (else
              ;; Multi-byte character (simplified)
              (i32.store8
                (i32.add (local.get $outPtr) (local.get $bytesWritten))
                (i32.or
                  (i32.const 0xC0)
                  (i32.shr_u (local.get $char) (i32.const 6))))
              (i32.store8
                (i32.add (local.get $outPtr)
                  (i32.add (local.get $bytesWritten) (i32.const 1)))
                (i32.or
                  (i32.const 0x80)
                  (i32.and (local.get $char) (i32.const 0x3F))))
              (local.set $bytesWritten 
                (i32.add (local.get $bytesWritten) (i32.const 2)))))
          
          (local.set $i (i32.add (local.get $i) (i32.const 1)))
          (br $encode)
        )
      )
    )
    
    ;; Return number of bytes written
    (local.get $bytesWritten)
  )

  ;; Export functions
  (export "arraySort" (func $arraySort))
  (export "arrayBinarySearch" (func $arrayBinarySearch))
  (export "stringCompare" (func $stringCompare))
  (export "stringEncode" (func $stringEncode))
)
