#include "stdafx.h"
#include "ManagedBridge.h"
#import "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\mscorlib.tlb" raw_interfaces_only rename("ReportEvent", "ReportEvent2") rename("or", "oder")
#include <metahost.h>
using namespace mscorlib;
#pragma comment(lib, "mscoree.lib")

void StartManaged(HWND hwnd)
{
	auto pid = GetCurrentProcessId();
	wchar_t affe[200];
	wsprintf(affe, L"%d", pid);
	MessageBox(0, affe, L"", MB_OK);
	
	auto module = LoadLibrary(L"hook");
	wchar_t path[MAX_PATH];
	GetModuleFileName(module, path, MAX_PATH);
	FreeLibrary(module);

	auto pos = wcsrchr(path, L'\\');
	pos[0] = 0;
	wcscat(path, L"\\commander.exe");

	ICLRMetaHost *meta_host = nullptr;
	auto hr = CLRCreateInstance(CLSID_CLRMetaHost, IID_ICLRMetaHost, (void**)&meta_host);

	// Get the ICLRRuntimeInfo corresponding to a particular CLR version.It
	// supersedes CorBindToRuntimeEx with STARTUP_LOADER_SAFEMODE.
	ICLRRuntimeInfo *runtime_info= nullptr;
	hr = meta_host->GetRuntime(L"v4.0.30319", IID_ICLRRuntimeInfo, (void**)&runtime_info);
	meta_host->Release();

	// Load the CLR into the current process and return a runtime interface 
	// pointer. ICorRuntimeHost and ICLRRuntimeHost are the two CLR hosting  
	// interfaces supported by CLR 4.0. Here we demo the ICorRuntimeHost 
	// interface that was provided in .NET v1.x, and is compatible with all 
	// .NET Frameworks. 
	ICorRuntimeHost *cor_runtime_host = nullptr;
	hr = runtime_info->GetInterface(CLSID_CorRuntimeHost, IID_ICorRuntimeHost, (void**)&cor_runtime_host);
	runtime_info->Release();

	hr = cor_runtime_host->Start();

	IUnknown* app_domain_thunk = nullptr;
	hr = cor_runtime_host->GetDefaultDomain(&app_domain_thunk);
	cor_runtime_host->Release();

	_AppDomain* default_app_domain = nullptr;
	hr = app_domain_thunk->QueryInterface(__uuidof(default_app_domain), (void**)&default_app_domain);
	app_domain_thunk->Release();

	BSTR assembly_name = SysAllocString(L"mscorlib");
	_Assembly* assembly{ nullptr };
	hr = default_app_domain->Load_2(assembly_name, &assembly);
	SysFreeString(assembly_name);
	default_app_domain->Release();

	BSTR class_name = SysAllocString(L"System.Reflection.Assembly");
	mscorlib::_Type* type;
	hr = assembly->GetType_2(class_name, &type);
	assembly->Release();
	SysFreeString(class_name);

	SAFEARRAY* static_method_args = SafeArrayCreateVector(VT_VARIANT, 0, 1);
	LONG index{ 0 };
	VARIANT args;
	args.vt = VT_BSTR;
	args.bstrVal = SysAllocString(path);
	hr = SafeArrayPutElement(static_method_args, &index, &args);

	BSTR static_method_name = SysAllocString(L"LoadFrom");
	VARIANT vtEmpty;
	vtEmpty.vt = VT_EMPTY;
	VARIANT return_value;
	hr = type->InvokeMember_3(static_method_name, static_cast<BindingFlags>(BindingFlags_InvokeMethod | BindingFlags_Static | BindingFlags_Public),
		nullptr, vtEmpty, static_method_args, &return_value);
	VariantClear(&args);
	SysFreeString(static_method_name);
	type->Release();
	SafeArrayDestroy(static_method_args);
	
	static_method_args = SafeArrayCreateVector(VT_VARIANT, 0, 2);
	index = 0;
	args.vt = VT_BSTR;
	args.bstrVal = SysAllocString(path);
	hr = SafeArrayPutElement(static_method_args, &index, &args);
	VARIANT arg2;
	arg2.vt = VT_I8;
	arg2.llVal = reinterpret_cast<long long>(hwnd); 
	index = 1;
	hr = SafeArrayPutElement(static_method_args, &index, &arg2);

	_Assembly* commander_Assembly = static_cast<_Assembly*>(return_value.pdispVal);
	VariantClear(&return_value);
	class_name = SysAllocString(L"Starter");
	hr = commander_Assembly->GetType_2(class_name, &type);
	commander_Assembly->Release();
	SysFreeString(class_name);
	static_method_name = SysAllocString(L"start");
	hr = type->InvokeMember_3(static_method_name, static_cast<BindingFlags>(BindingFlags_InvokeMethod | BindingFlags_Static | BindingFlags_Public),
		nullptr, vtEmpty, static_method_args, nullptr);
	VariantClear(&args);
	SysFreeString(static_method_name);
	SafeArrayDestroy(static_method_args);
}