cmake_minimum_required(VERSION 3.31)
project(untitled1)

set(CMAKE_CXX_STANDARD 23)

add_executable(untitled1 cpp_scr/main.cpp)

target_include_directories(untitled1 PRIVATE ${PROJECT_SOURCE_DIR}/kv)