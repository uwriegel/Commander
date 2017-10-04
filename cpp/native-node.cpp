#include <node.h>
#include <uv.h>
#include <locale>
#include <string>
#include <vector>
#include <codecvt>
#include "native.h"
using namespace std;
using namespace v8;

string ws2utf8(const wstring &input) {
	wstring_convert<codecvt_utf8<wchar_t>> utf8conv;
	return utf8conv.to_bytes(input);
}

wstring utf82ws(const string &input) {
	wstring_convert<codecvt_utf8<wchar_t>> utf8conv;
	return utf8conv.from_bytes(input);
}

struct Work {
    uv_work_t  request;
    Persistent<Function> callback;
  
    wstring directory;
    vector<File_item> results;
};

static void WorkAsync(uv_work_t *req) {
    auto work = static_cast<Work*>(req->data);
    // this is the worker thread, lets build up the results
    // allocated results from the heap because we'll need
    // to access in the event loop later to send back
    work->results = get_file_items(work->directory);
}

static void WorkAsyncComplete(uv_work_t *req, int status)
{
    auto isolate = Isolate::GetCurrent();
    HandleScope handleScope(isolate); 

    auto work = static_cast<Work*>(req->data);

    Local<Array> result_list = Array::New(isolate);
    int i{0};
    for(auto item: work->results) {
        Local<Object> result = Object::New(isolate);
        result->Set(String::NewFromUtf8(isolate, "displayName"), 
            String::NewFromUtf8(isolate, ws2utf8(item.display_name).c_str())); 
        result->Set(String::NewFromUtf8(isolate, "size"), Number::New(isolate, static_cast<double>(item.size)));
        result->Set(String::NewFromUtf8(isolate, "time"), Date::New(isolate, static_cast<double>(item.time)));
        result->Set(String::NewFromUtf8(isolate, "isDirectory"), Boolean::New(isolate, item.is_directory));
        result->Set(String::NewFromUtf8(isolate, "isHidden"), Boolean::New(isolate, item.is_hidden));
        result_list->Set(i++, result);
    }

    // set up return arguments
    Handle<Value> argv[] = { Null(isolate), result_list };

    // execute the callback
    Local<Function>::New(isolate, 
        work->callback)->Call(isolate->GetCurrentContext()->Global(), 
        2, argv);

    // Free up the persistent function callback
    work->callback.Reset();

    delete work;    
}

void get_files(const FunctionCallbackInfo<Value>&args) {
    auto isolate = args.GetIsolate();

    auto work = new Work{0};
    work->request.data = work;

    String::Utf8Value s(args[0]);
    string str(*s);
    work->directory = utf82ws(str);
 
    work->callback.Reset(isolate, Local<Function>::Cast(args[1])); 
    uv_queue_work(uv_default_loop(), &work->request, WorkAsync, WorkAsyncComplete);
    
    args.GetReturnValue().Set(Undefined(isolate));
}

void init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "getFiles", get_files);
}
  
NODE_MODULE(affe, init)