#!/bin/bash

target=$1
base=$HOME/deploy

git push --set-upstream --force ionic master

if [[ $target == "kcl" || $target == "sbbdl" ]]; then

    echo "Pushing ${target} to ionic"
    cd "${base}/${target}Mobile" || exit
    git push --set-upstream --force ionic master

else

    echo "You must specify one of: kcl, sbbdl"

fi
