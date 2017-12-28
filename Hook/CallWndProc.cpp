#include "stdafx.h"
#include "ManagedBridge.h"

LRESULT __stdcall CallWndProc(int code, WPARAM wParam, LPARAM lParam)
{
	if (code == HC_ACTION)
	{
		auto cwp = (CWPSTRUCT*)lParam;
		if (cwp->message == WM_NCCREATE)
		{
			wchar_t name[200];
			GetClassName(cwp->hwnd, name, sizeof(name) - 1);
			if (wcscmp(name, L"Chrome_WidgetWin_1") == 0)
				StartManaged(cwp->hwnd);
		}
	}
	return CallNextHookEx(0, code, wParam, lParam);
}