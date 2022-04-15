#!/bin/bash

if [[ -z "$1" ]]; then
    echo "Usage: $0 module [module...]"
    exit 1
fi

KERNELVER=${KERNELVER:-$(uname -r)}

do_sign() {
    /lib/modules/$KERNELVER/build/scripts/sign-file sha256 /boot/keys/DB.key /boot/keys/DB.crt "$1"
}

for module in $@; do
    echo "Signing module: $module"
    module_basename=${module:0:-3}
    module_suffix=${module: -3}
    if [[ "$module_suffix" == ".xz" ]]; then
        unxz $module
        do_sign $module_basename
        xz -f $module_basename
    elif [[ "$module_suffix" == ".gz" ]]; then
        gunzip $module
        do_sign $module_basename
        gzip -9f $module_basename
    else
        do_sign $module
    fi    
done
