#!/usr/bin/python3

# Just me learning how base64 encoding worked, and implementing it before realising Python had a native library for it.

import re
b64_set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

def str_to_b64(string: str):
    """Convert string of characters into bitstring of ASCII."""
    bin_str = ""
    for char in string:
        if ord(char) < 128:
            # Ignore non-ASCII characters.
            bin_str += format(ord(char), "08b")

    bin_len = len(bin_str)
    pad_char = ""

    # Pad string if length is not multiple of 6.
    if bin_len % 6 == 2:
        bin_str += "0000"
        pad_char += "=="
    elif bin_len % 6 == 4:
        bin_str += "00"
        pad_char += "="
    
    # Easier to split string by matching regular expressions:
    bin_list = re.findall("......", bin_str)
    return "".join(b64_set[int(bin_el, 2)] for bin_el in bin_list) + pad_char

def b64_to_str(b64: str):
    """Convert b64 string to an ASCII bitstring."""
    # Handle padding bits.
    for i in range(2):
        if b64[-1] == '=':
            b64 = b64[:-1]
    bin_str = "".join(format(b64_set.index(b64_char), "06b") for b64_char in b64)
    bin_list = re.findall("........", bin_str)
    string = "".join(chr(int(bin_el, 2)) for bin_el in bin_list)
    return string