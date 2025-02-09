(module
  (import "env" "memory" (memory 1))

  (func $arraySort (param $ptr i32) (param $len i32)
    (local $i i32)
    (local $j i32)
    (local $temp f64)
    
    (loop $outer
      (local.set $j (i32.const 0))
      (loop $inner
        (if (i32.lt_u (local.get $j) (i32.sub (local.get $len) (i32.const 1)))
          (then
            (if (f64.gt 
                (f64.load (i32.add (local.get $ptr) (i32.mul (local.get $j) (i32.const 8))))
                (f64.load (i32.add (local.get $ptr) (i32.mul (i32.add (local.get $j) (i32.const 1)) (i32.const 8)))))
              (then
                (local.set $temp (f64.load (i32.add (local.get $ptr) (i32.mul (local.get $j) (i32.const 8)))))
                (f64.store (i32.add (local.get $ptr) (i32.mul (local.get $j) (i32.const 8)))
                          (f64.load (i32.add (local.get $ptr) (i32.mul (i32.add (local.get $j) (i32.const 1)) (i32.const 8)))))
                (f64.store (i32.add (local.get $ptr) (i32.mul (i32.add (local.get $j) (i32.const 1)) (i32.const 8)))
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
        (br $outer)
      )
    )
  )

  (export "arraySort" (func $arraySort))
)
