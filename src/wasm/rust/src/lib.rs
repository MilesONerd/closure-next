use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn array_sort(ptr: *mut f64, len: usize) {
    let slice = unsafe { std::slice::from_raw_parts_mut(ptr, len) };
    slice.sort_by(|a, b| a.partial_cmp(b).unwrap());
}

#[wasm_bindgen]
pub fn array_binary_search(ptr: *const f64, len: usize, target: f64) -> i32 {
    let slice = unsafe { std::slice::from_raw_parts(ptr, len) };
    match slice.binary_search_by(|x| x.partial_cmp(&target).unwrap()) {
        Ok(index) => index as i32,
        Err(_) => -1,
    }
}

#[wasm_bindgen]
pub fn string_compare(ptr1: *const u8, len1: usize, ptr2: *const u8, len2: usize) -> i32 {
    let str1 = unsafe { std::slice::from_raw_parts(ptr1, len1) };
    let str2 = unsafe { std::slice::from_raw_parts(ptr2, len2) };
    
    for (i, (&c1, &c2)) in str1.iter().zip(str2.iter()).enumerate() {
        if c1 != c2 {
            return (c1 as i32) - (c2 as i32);
        }
    }
    
    (len1 as i32) - (len2 as i32)
}

#[wasm_bindgen]
pub fn string_encode(ptr: *const u8, len: usize) -> *mut u8 {
    let input = unsafe { std::slice::from_raw_parts(ptr, len) };
    let mut output = Vec::with_capacity(len * 2); // Worst case for simple UTF-8
    
    for &byte in input {
        if byte < 128 {
            output.push(byte);
        } else {
            output.push(0xC0 | (byte >> 6));
            output.push(0x80 | (byte & 0x3F));
        }
    }
    
    let ptr = output.as_mut_ptr();
    std::mem::forget(output); // Prevent deallocation
    ptr
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_array_sort() {
        let mut data = vec![3.0, 1.0, 4.0, 1.0, 5.0, 9.0];
        unsafe {
            array_sort(data.as_mut_ptr(), data.len());
        }
        assert_eq!(data, vec![1.0, 1.0, 3.0, 4.0, 5.0, 9.0]);
    }

    #[test]
    fn test_array_binary_search() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let result = unsafe {
            array_binary_search(data.as_ptr(), data.len(), 3.0)
        };
        assert_eq!(result, 2);
    }
}
