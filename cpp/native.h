#pragma once
#include <string>
#include <vector>

struct File_item {
    std::wstring display_name;
    bool is_directory;
    bool is_hidden;
    uint64_t size;
    uint64_t time;
};

extern std::vector<File_item> get_file_items(const std::wstring& directory);