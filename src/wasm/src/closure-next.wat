(module
  ;; Memory for array and string operations (128 pages = 8MB)
  (memory 128)
  (export "memory" (memory 0))

  ;; Function declarations
  (type $get_element_type (func (param i32 i32) (result f64)))
  (type $set_element_type (func (param i32 i32 f64)))
  (type $swap_elements_type (func (param i32 i32 i32)))
  (type $partition_type (func (param i32 i32 i32) (result i32)))
  (type $quicksort_type (func (param i32 i32 i32)))
  (type $array_sort_type (func (param i32 i32)))
  (type $binary_search_type (func (param i32 i32 f64) (result i32)))
  (type $string_compare_type (func (param i32 i32 i32 i32) (result i32)))
  (type $string_encode_type (func (param i32 i32) (result i32)))
  (type $traverse_dom_type (func (param i32) (result i32)))
  (type $get_attribute_type (func (param i32 i32 i32) (result i32)))
  (type $dispatch_event_type (func (param i32 i32 i32) (result i32)))
  (type $calc_addr_type (func (param i32 i32) (result i32)))
  (type $compare_type (func (param f64 f64) (result i32)))

  ;; Helper function to compare two f64 values
  (func $compare (type $compare_type)
    (if (f64.lt (local.get 0) (local.get 1))
      (then (return (i32.const -1)))
      (else
        (if (f64.gt (local.get 0) (local.get 1))
          (then (return (i32.const 1)))
          (else (return (i32.const 0)))))))

  ;; Helper function to calculate array address
  (func $calcAddr (type $calc_addr_type)
    (i32.add (local.get 0)
      (i32.mul (local.get 1) (i32.const 8))))

  ;; Helper function to get array element at index
  (func $getElement (type $get_element_type)
    (f64.load (call $calcAddr (local.get 0) (local.get 1))))

  ;; Helper function to set array element at index
  (func $setElement (type $set_element_type)
    (f64.store 
      (call $calcAddr (local.get 0) (local.get 1))
      (local.get 2)))

  ;; Helper function to swap elements
  (func $swapElements (type $swap_elements_type)
    (local $addr1 i32)
    (local $addr2 i32)
    (local $val1 f64)
    (local $val2 f64)
    
    ;; Calculate addresses
    (local.set $addr1 (call $calcAddr (local.get 0) (local.get 1)))
    (local.set $addr2 (call $calcAddr (local.get 0) (local.get 2)))
    
    ;; Load values
    (local.set $val1 (f64.load (local.get $addr1)))
    (local.set $val2 (f64.load (local.get $addr2)))
    
    ;; Store swapped values
    (f64.store (local.get $addr1) (local.get $val2))
    (f64.store (local.get $addr2) (local.get $val1))
    
    ;; Return success
    (i32.const 0))

  ;; Partition function for quicksort
  (func $partition (type $partition_type)
    (local $pivot_val f64)
    (local $curr_val f64)
    (local $i i32)
    (local $j i32)
    (local $cmp i32)
    
    ;; Load pivot value
    (local.set $pivot_val (f64.load (call $calcAddr (local.get 0) (local.get 2))))
    
    ;; Initialize indices
    (local.set $i (i32.sub (local.get 1) (i32.const 1)))
    (local.set $j (local.get 1))
    
    (block $partition_done
      (loop $partition_loop
        (br_if $partition_done (i32.ge_s (local.get $j) (local.get 2)))
        
        ;; Load current value
        (local.set $curr_val 
          (f64.load (call $calcAddr (local.get 0) (local.get $j))))
        
        ;; Compare values
        (local.set $cmp (call $compare (local.get $curr_val) (local.get $pivot_val)))
        
        (if (i32.le_s (local.get $cmp) (i32.const 0))
          (then
            (local.set $i (i32.add (local.get $i) (i32.const 1)))
            (call $swapElements (local.get 0) (local.get $i) (local.get $j))))
        
        (local.set $j (i32.add (local.get $j) (i32.const 1)))
        (br $partition_loop)))
    
    ;; Place pivot in correct position
    (local.set $i (i32.add (local.get $i) (i32.const 1)))
    (call $swapElements (local.get 0) (local.get $i) (local.get 2))
    (local.get $i))

  ;; Quicksort implementation
  (func $quicksort (type $quicksort_type)
    (local $pi i32)
    (if (i32.lt_s (local.get 1) (local.get 2))
      (then
        ;; Get partition index
        (local.set $pi 
          (call $partition 
            (local.get 0) 
            (local.get 1) 
            (local.get 2)))
        
        ;; Sort left partition
        (call $quicksort 
          (local.get 0) 
          (local.get 1) 
          (i32.sub (local.get $pi) (i32.const 1)))
        
        ;; Sort right partition
        (call $quicksort 
          (local.get 0) 
          (i32.add (local.get $pi) (i32.const 1)) 
          (local.get 2)))))

  ;; Main array sort function (using quicksort)
  (func $arraySort (type $array_sort_type)
    (if (i32.gt_s (local.get 1) (i32.const 1))
      (then
        (call $quicksort 
          (local.get 0) 
          (i32.const 0) 
          (i32.sub (local.get 1) (i32.const 1))))))
  
  ;; Binary search
  (func $arrayBinarySearch (type $binary_search_type)
    (local $left i32)
    (local $right i32)
    (local $mid i32)
    (local $curr_val f64)
    (local $target_val f64)
    (local $addr i32)
    (local $cmp i32)
    
    ;; Store target value
    (local.set $target_val (local.get 2))
    
    ;; Initialize search bounds
    (local.set $left (i32.const 0))
    (local.set $right (i32.sub (local.get 1) (i32.const 1)))
    
    (block $search_done
      (loop $search
        (br_if $search_done 
          (i32.gt_s (local.get $left) (local.get $right)))
        
        ;; Calculate midpoint
        (local.set $mid 
          (i32.div_u 
            (i32.add (local.get $left) (local.get $right)) 
            (i32.const 2)))
        
        ;; Calculate address and load value
        (local.set $addr (call $calcAddr (local.get 0) (local.get $mid)))
        (local.set $curr_val (f64.load (local.get $addr)))
        
        ;; Compare values
        (local.set $cmp (call $compare (local.get $curr_val) (local.get $target_val)))
        
        (if (i32.eq (local.get $cmp) (i32.const 0))
          (then 
            (return (local.get $mid)))
          (else
            (if (i32.lt_s (local.get $cmp) (i32.const 0))
              (then
                (local.set $left 
                  (i32.add (local.get $mid) (i32.const 1))))
              (else
                (local.set $right 
                  (i32.sub (local.get $mid) (i32.const 1)))))
            (br $search)))))
    
    (i32.const -1))
  
  ;; String comparison
  (func $stringCompare (type $string_compare_type)
    (local $i i32)
    (local $char1 i32)
    (local $char2 i32)
    
    (block $compare_done
      (loop $compare
        (br_if $compare_done 
          (i32.or
            (i32.ge_u (local.get $i) (local.get 1))
            (i32.ge_u (local.get $i) (local.get 3))))
        
        (local.set $char1 
          (i32.load8_u (i32.add (local.get 0) (local.get $i))))
        (local.set $char2 
          (i32.load8_u (i32.add (local.get 2) (local.get $i))))
        
        (if (i32.ne (local.get $char1) (local.get $char2))
          (then
            (return 
              (i32.sub (local.get $char1) (local.get $char2)))))
        
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $compare)))
    
    (i32.sub (local.get 1) (local.get 3)))
  
  ;; String encoding (simple UTF-8)
  (func $stringEncode (type $string_encode_type)
    (local $i i32)
    (local $char i32)
    (local $outPtr i32)
    
    (local.set $outPtr 
      (i32.add (local.get 0) (local.get 1)))
    
    (block $encode_done
      (loop $encode
        (br_if $encode_done 
          (i32.ge_u (local.get $i) (local.get 1)))
        
        (local.set $char 
          (i32.load8_u (i32.add (local.get 0) (local.get $i))))
        
        ;; Simple pass-through for ASCII
        (i32.store8 
          (i32.add (local.get $outPtr) (local.get $i))
          (local.get $char))
        
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $encode)))
    
    (local.get $outPtr))

  ;; DOM tree traversal
  (func $traverseDOM (type $traverse_dom_type)
    (local $childPtr i32)
    (local $siblingPtr i32)
    (local $visited i32)
    
    ;; Visit current node
    (local.set $visited (i32.const 1))
    
    ;; Get first child pointer
    (local.set $childPtr 
      (i32.load (i32.add (local.get 0) (i32.const 8))))
    
    ;; Traverse children if they exist
    (if (local.get $childPtr)
      (then
        (local.set $visited 
          (i32.add 
            (local.get $visited)
            (call $traverseDOM (local.get $childPtr))))))
    
    ;; Get next sibling pointer
    (local.set $siblingPtr 
      (i32.load (i32.add (local.get 0) (i32.const 16))))
    
    ;; Traverse siblings if they exist
    (if (local.get $siblingPtr)
      (then
        (local.set $visited 
          (i32.add 
            (local.get $visited)
            (call $traverseDOM (local.get $siblingPtr))))))
    
    (local.get $visited))

  ;; Attribute handling
  (func $getAttribute (type $get_attribute_type)
    (local $attrPtr i32)
    (local $attrCount i32)
    (local $i i32)
    
    ;; Get attributes pointer
    (local.set $attrPtr 
      (i32.load (i32.add (local.get 0) (i32.const 24))))
    
    ;; Get attribute count
    (local.set $attrCount 
      (i32.load (local.get $attrPtr)))
    
    ;; Search through attributes
    (block $search_done
      (loop $search
        (br_if $search_done 
          (i32.ge_u (local.get $i) (local.get $attrCount)))
        
        ;; Compare attribute name
        (if (call $stringCompare
              (i32.add 
                (local.get $attrPtr)
                (i32.mul (i32.add (local.get $i) (i32.const 1))
                  (i32.const 16)))
              (local.get 2)
              (local.get 1)
              (local.get 2))
          (then
            ;; Return attribute value pointer
            (return 
              (i32.add 
                (local.get $attrPtr)
                (i32.mul (i32.add (local.get $i) (i32.const 1))
                  (i32.const 16))))))
        
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $search)))
    
    (i32.const 0))

  ;; Event system
  (func $dispatchEvent (type $dispatch_event_type)
    (local $currentPtr i32)
    (local $handlerCount i32)
    (local $i i32)
    (local $handled i32)
    
    ;; Start at target node
    (local.set $currentPtr (local.get 0))
    
    ;; Bubble up through parents
    (block $bubble_done
      (loop $bubble
        (br_if $bubble_done (i32.eqz (local.get $currentPtr)))
        
        ;; Get handler count
        (local.set $handlerCount 
          (i32.load (i32.add (local.get $currentPtr) (i32.const 32))))
        
        ;; Execute handlers
        (local.set $i (i32.const 0))
        (block $handlers_done
          (loop $handlers
            (br_if $handlers_done 
              (i32.ge_u (local.get $i) (local.get $handlerCount)))
            
            ;; Check event type match
            (if (call $stringCompare
                  (i32.add 
                    (local.get $currentPtr)
                    (i32.mul (i32.add (local.get $i) (i32.const 1))
                      (i32.const 24)))
                  (local.get 2)
                  (local.get 1)
                  (local.get 2))
              (then
                (local.set $handled (i32.const 1))))
            
            (local.set $i (i32.add (local.get $i) (i32.const 1)))
            (br $handlers)))
        
        ;; Move to parent
        (local.set $currentPtr 
          (i32.load (local.get $currentPtr)))
        (br $bubble)))
    
    (local.get $handled))

  ;; Export functions
  (export "arraySort" (func $arraySort))
  (export "arrayBinarySearch" (func $arrayBinarySearch))
  (export "stringCompare" (func $stringCompare))
  (export "stringEncode" (func $stringEncode))
  (export "traverseDOM" (func $traverseDOM))
  (export "getAttribute" (func $getAttribute))
  (export "dispatchEvent" (func $dispatchEvent)))
