cmake_minimum_required(VERSION 3.13.0)

project(FinlyApp)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set Android specific variables
set(CMAKE_SYSTEM_NAME Android)
set(CMAKE_SYSTEM_VERSION 23)
set(CMAKE_ANDROID_ARCH_ABI ${ANDROID_ABI})
set(CMAKE_ANDROID_NDK ${ANDROID_NDK})
set(CMAKE_ANDROID_STL_TYPE c++_shared)

# Set build type if not specified
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

# Set compiler flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra")
set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -g -O0")
set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -O3")

# Add React Native JSI
add_library(jsi SHARED IMPORTED)
set_target_properties(jsi PROPERTIES IMPORTED_LOCATION
    ${REACT_ANDROID_DIR}/jni/fbjni/jni/${ANDROID_ABI}/libjsi.so)

# Add React Native JNI
add_library(reactnativejni SHARED IMPORTED)
set_target_properties(reactnativejni PROPERTIES IMPORTED_LOCATION
    ${REACT_ANDROID_DIR}/jni/${ANDROID_ABI}/libreactnativejni.so)

# Add your native libraries here
# Example:
# add_library(your-lib SHARED
#     your-source.cpp
# )

# Link libraries
# Example:
# target_link_libraries(your-lib
#     jsi
#     reactnativejni
# ) 