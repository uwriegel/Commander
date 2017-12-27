#include "stdafx.h"

void logge(const wchar_t* text)
{
	auto handle = OpenEventLog(nullptr, L"Application");
	ReportEvent(handle, EVENTLOG_WARNING_TYPE, 7, 12, nullptr, 1, 0, &text, nullptr);
	CloseEventLog(handle);
}

void Start() 
{
	logge(L"Das war toll!");
}

