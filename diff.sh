#!/bin/bash
TAG1=$1
TAG2=$2
PRE=src/main/java/org/elasticsearch
OUT=diff${TAG1}${TAG2}.txt
list=("indices/recovery/RecoveryTarget.java" \
"indices/recovery/RecoverySource.java" \
"cluster/routing/allocation/AllocationService.java" \
"cluster/routing/allocation/allocator/EvenShardsCountAllocator.java" \
"gateway/local/LocalGatewayAllocator.java" \
)

if [ "$#" -ne 2 ]
then
	echo "Need two parameters"
	exit
fi

echo "This is the diff file for $TAG1 and $TAG2" > $OUT

for file in ${list[@]}
do
	echo $file
	git diff $TAG1 $TAG2 -- $PRE/$file >> $OUT
	echo "########################################################################" >> $OUT
done
