#include "stdafx.h"

void Start() 
{
	auto module = LoadLibrary(L"Hook.dll");
	auto proc = (HOOKPROC)GetProcAddress(module, "CallWndProc");
	auto hook = SetWindowsHookEx(WH_CALLWNDPROC, proc, module, 0);
	Sleep(500);
	UnhookWindowsHookEx(hook);
	FreeLibrary(module);
}

