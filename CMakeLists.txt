cmake_minimum_required(VERSION 3.31)
project(kv_survey)

set(CMAKE_CXX_STANDARD 23)

add_executable(kv_survey cpp_scr/main.cpp)

target_include_directories(kv_survey PRIVATE ${PROJECT_SOURCE_DIR}/kv)

