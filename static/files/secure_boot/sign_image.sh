#!/bin/sh
umask 077

CMDLINE="root=/dev/mapper/ubuntu-root ro quiet splash vt.handoff=7"

. /etc/lsb-release
CODENAME="$(tr '[:lower:]' '[:upper:]' <<< ${DISTRIB_CODENAME:0:1})${DISTRIB_CODENAME:1}"

build_image () {
  KERNEL=$1
  INITRD=$2
  LOADER=$3
  CMDLINE_FILE=$(mktemp /tmp/output.XXXXXXXXXX)
  IMAGE_FILE=$(mktemp /tmp/output.XXXXXXXXXX)
  echo -n $CMDLINE > $CMDLINE_FILE

  objcopy \
  --add-section .osrel=/etc/os-release --change-section-vma .osrel=0x20000 \
  --add-section .cmdline=$CMDLINE_FILE --change-section-vma .cmdline=0x30000 \
  --add-section .linux=$KERNEL --change-section-vma .linux=0x2000000 \
  --add-section .initrd=$INITRD --change-section-vma .initrd=0x3000000 \
  /usr/lib/systemd/boot/efi/linuxx64.efi.stub $IMAGE_FILE

  mkdir /boot/efi/EFI/$LOADER || true

  sbsign --key /boot/keys/DB.key --cert /boot/keys/DB.crt --output /boot/efi/EFI/$LOADER/BOOTX64.EFI $IMAGE_FILE

  rm $IMAGE_FILE
  rm $CMDLINE_FILE
}

echo "Building signed kernel image"
build_image /boot/vmlinuz /boot/initrd.img ${DISTRIB_ID}${CODENAME}

echo "Building fallback signed kernel image"
build_image /boot/vmlinuz.old /boot/initrd.img.old ${DISTRIB_ID}${CODENAME}Fallback