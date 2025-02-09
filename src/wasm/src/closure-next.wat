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

  ;; Helper function to get array element at index
  (func $getElement (type $get_element_type)
    (f64.load (i32.add (local.get 0) 
      (i32.mul (local.get 1) (i32.const 8)))))

  ;; Helper function to set array element at index
  (func $setElement (type $set_element_type)
    (f64.store 
      (i32.add (local.get 0) 
        (i32.mul (local.get 1) (i32.const 8)))
      (local.get 2)))

  ;; Helper function to swap elements
  (func $swapElements (type $swap_elements_type)
    (local $temp f64)
    (local.set $temp (call $getElement (local.get 0) (local.get 1)))
    (call $setElement 
      (local.get 0) 
      (local.get 1) 
      (call $getElement (local.get 0) (local.get 2)))
    (call $setElement (local.get 0) (local.get 2) (local.get $temp)))

  ;; Partition function for quicksort
  (func $partition (type $partition_type)
    (local $pivot f64)
    (local $i i32)
    (local $j i32)
    
    ;; Use last element as pivot
    (local.set $pivot (call $getElement (local.get 0) (local.get 2)))
    (local.set $i (i32.sub (local.get 1) (i32.const 1)))
    
    ;; Partition array around pivot
    (local.set $j (local.get 1))
    (block $partition_done
      (loop $partition_loop
        (br_if $partition_done (i32.ge_s (local.get $j) (local.get 2)))
        
        (if (f64.le 
              (call $getElement (local.get 0) (local.get $j))
              (local.get $pivot))
          (then
            (local.set $i (i32.add (local.get $i) (i32.const 1)))
            (call $swapElements 
              (local.get 0) 
              (local.get $i) 
              (local.get $j))))
        
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
  (func $arraySort (param $ptr i32) (param $len i32)
    (if (i32.gt_s (local.get $len) (i32.const 1))
      (then
        (call $quicksort 
          (local.get $ptr) 
          (i32.const 0) 
          (i32.sub (local.get $len) (i32.const 1)))))))
  
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

  ;; DOM tree traversal
  (func $traverseDOM (param $nodePtr i32) (result i32)
    (local $childPtr i32)
    (local $siblingPtr i32)
    (local $visited i32)
    
    ;; Visit current node
    (local.set $visited (i32.const 1))
    
    ;; Get first child pointer
    (local.set $childPtr 
      (i32.load (i32.add (local.get $nodePtr) (i32.const 8))))
    
    ;; Traverse children if they exist
    (if (local.get $childPtr)
      (then
        (local.set $visited 
          (i32.add 
            (local.get $visited)
            (call $traverseDOM (local.get $childPtr))))))
    
    ;; Get next sibling pointer
    (local.set $siblingPtr 
      (i32.load (i32.add (local.get $nodePtr) (i32.const 16))))
    
    ;; Traverse siblings if they exist
    (if (local.get $siblingPtr)
      (then
        (local.set $visited 
          (i32.add 
            (local.get $visited)
            (call $traverseDOM (local.get $siblingPtr))))))
    
    (local.get $visited))

  ;; Attribute handling
  (func $getAttribute (param $nodePtr i32) (param $attrNamePtr i32) (param $attrNameLen i32) (result i32)
    (local $attrPtr i32)
    (local $attrCount i32)
    (local $i i32)
    
    ;; Get attributes pointer
    (local.set $attrPtr 
      (i32.load (i32.add (local.get $nodePtr) (i32.const 24))))
    
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
              (local.get $attrNameLen)
              (local.get $attrNamePtr)
              (local.get $attrNameLen))
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
  (func $dispatchEvent (param $targetPtr i32) (param $eventTypePtr i32) (param $eventTypeLen i32) (result i32)
    (local $currentPtr i32)
    (local $handlerCount i32)
    (local $i i32)
    (local $handled i32)
    
    ;; Start at target node
    (local.set $currentPtr (local.get $targetPtr))
    
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
                  (local.get $eventTypeLen)
                  (local.get $eventTypePtr)
                  (local.get $eventTypeLen))
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
  (export "dispatchEvent" (func $dispatchEvent))
