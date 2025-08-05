#!/bin/bash

cd android
./gradlew clean
./gradlew assembleRelease

# Move APK to dist directory
mkdir -p ../dist
mv app/build/outputs/apk/release/app-release.apk ../dist/finly-app.apk

echo "Build completed! APK available at dist/finly-app.apk"