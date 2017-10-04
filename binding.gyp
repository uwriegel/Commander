{
    "targets": [{
        "target_name": "affe",
        "sources": [ "cpp/native-node.cpp", "cpp/windows.cpp", "cpp/linux.cpp" ],
        "conditions": [
            ['OS=="win"', {'sources!': ['cpp/linux.cpp']}],
            ['OS=="linux"', {'sources!': ['cpp/windows.cpp']}],
        ],  
        "cflags": ["-Wall", "-std=c++14"]
    }]
}