#!/bin/bash

target=$1
base=$HOME/deploy

mkdir -p $base

if [[ $target == "kcl" || $target == "sbbdl" ]]; then

    echo "Preparing build for ${target}"

    echo "Changing to workdir: ${base}"
    cd $base

    echo "Removing previous build (if exists)"
    rm -rf ${target}Mobile

    echo "Checking out tadlMobile4 as ${target}Mobile"
    git clone https://github.com/tadl/tadlMobile4.git ${target}Mobile

    echo "Changing to workdir: ${target}Mobile"
    cd ${target}Mobile

    echo "Copying ${target} configs and settings to app"
    cp -Rv apps/${target}/* .

    echo "Running npm install"
    npm install

    echo "Adding ionic remote: git@git.ionicjs.com:tadltech/${target}.git"
    git remote add ionic git@git.ionicjs.com:tadltech/${target}.git

    echo "Adding ios platform"
    ionic cordova platform add ios

    echo "Adding android platform"
    ionic cordova platform add android

    echo "Done! You may now cd ${base}/${target}Mobile and do 'ionic serve' to test!"

else
    echo "You must specify one of: kcl, sbbdl"
fi

