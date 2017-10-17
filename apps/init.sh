#!/bin/bash

target=$1
base=$HOME/deploy

mkdir -p $base

if [[ $target == "kcl" || $target == "sbbdl" ]]; then

    echo "Preparing build for ${target}"

    cd $base

    git clone https://github.com/tadl/tadlMobile4.git ${target}Mobile

    cd ${target}Mobile

    npm install

    git remote add ionic git@git.ionicjs.com:tadltech/${target}.git

    ionic cordova platform add ios
    ionic cordova platform add android
    ionic cordova resources

else
    echo "You must specify one of: kcl, sbbdl"
fi

