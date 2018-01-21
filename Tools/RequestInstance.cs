using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Tools
{
    public static class Constants
    {
        public const string NotModified = "Fri, 01 Jun 2012 08:28:30 GMT";
    }

    public interface IExtension
    {
        bool OnError(Exception e, IService service);
        void Request(ISession session, string method, Dictionary<string, string> urlParameters);
        void ServiceRequest(IService service);
        void Shutdown();
    }

    public interface IWebSockets
    {
        void Closed(IWebSocketSender sender);
        void Initialize(IWebSocketSender sender, string token);
    }

    public interface IService
    {
        string UrlRoot { get; }
        string Url { get; }
        string Method { get; }

        T GetInput<T>();
        void SendResult(object result);
    }

    public interface ISession
    {
        string UrlRoot { get; }

        void AddHeader(string name, string value);
        void Close();
        T GetJson<T>();
        void ReadStream(Stream stream);
        string ReadString();
        bool Redirect(string url);
        void SendBytes(byte[] bytes);
        void SendBytes(byte[] bytes, int offset, int length);
        void SendError(string htmlHead, string htmlBody, int errorCode, string errorText);
        void SendFile(string path);
        void SendHeader(int contentLength = -1);
        void SendHtml(Stream html, int length);
        void SendHtmlString(string html);
        void SendJson(object jsonResult);
        void SendJsonStream(Stream stream);
        void SendJsonString(string json);
        void SendOK(string responseText);
        void SendRange(Stream stream, long fileLength, string contentType);
        void SendStream(Stream stream, string contentType, string lastModified, bool noCache);
        void SendXml(XElement xml);
        void Write(byte[] bytes);
        void Write(byte[] bytes, int offset, int length);
    }

    public class RequestInstance : IExtension, IWebSockets
    {
        #region IExtension Members

        public bool OnError(Exception e, IService service)
        {
            return true;
        }

        public void ServiceRequest(IService service)
        {
            switch (service.Method)
            {
                case "getItems":
                    GetItems(service);
                    break;
                case "processItem":
                    ProcessItem(service);
                    break;
                case "createFolder":
                    CreateFolder(service);
                    break;
                case "rename":
                    Rename(service);
                    break;
                case "showHidden":
                    ShowHidden(service);
                    break;
                case "startExplorer":
                    StartExplorer(service);
                    break;
                case "checkFileOperation":
                    CheckFileOperation(service);
                    break;
                case "runOperation":
                    RunOperation(service);
                    break;
                case "cancel":
                    Cancel(service);
                    break;
                case "startServices":
                    StartServices(service);
                    break;
                case "stopServices":
                    StopServices(service);
                    break;
                case "extendedRename":
                    ExtendedRename(service);
                    break;
                case "startDrag":
                    StartDrag(service);
                    break;
            }
        }
        
        public void Request(ISession session, string method, Dictionary<string, string> urlParameters) 
        {
            switch (method)
            {
                case "Icon":
                    GetIcon(session, urlParameters["file"].ToLower());
                    break;
                case "File":
                    var b64 = urlParameters["path"];
                    var data = Convert.FromBase64String(b64);
                    var halfDecodedString = Encoding.UTF8.GetString(data);
                    var decodedString = Uri.UnescapeDataString(halfDecodedString);
                    try
                    {
                        session.SendFile(decodedString);
                    }
                    catch { }
                    break;
            }
        }

        public void Shutdown()
        {
        }

        public void Initialize(IWebSocketSender sender, string token)
        {
            EventSession.GetEvents(sender);
        }

        public void Closed(IWebSocketSender sender)
        {
        }

        #endregion 

        #region Methods	

        void ProcessItem(IService service)
        {
            var input = service.GetInput<ProcessItem>();
            if (input.openWith)
            {
                var p = Process.Start("rundll32.exe", $"shell32, OpenAs_RunDLL {input.file}");
                Api.SetActiveWindow(p.MainWindowHandle);
                Api.SetForegroundWindow(p.MainWindowHandle);
            }
            else if (input.showProperties)
            {
                var info = new Api.SHELLEXECUTEINFO()
                {
                    lpVerb = "properties",
                    lpFile = input.file,
                    nShow = Api.SW_SHOW,
                    fMask = Api.SEE_MASK_INVOKEIDLIST
                };
                info.cbSize = System.Runtime.InteropServices.Marshal.SizeOf(info);
                Api.ShellExecuteEx(ref info);
                Api.SetActiveWindow(info.hwnd);
                Api.SetForegroundWindow(info.hwnd);
            }
            else
            {
                var p = new Process();
                p.StartInfo.UseShellExecute = true;
                p.StartInfo.ErrorDialog = true;
                p.StartInfo.FileName = input.file;
                p.Start();
            }

            service.SendResult(new object());
        }

        void GetIcon(ISession session, string iconExtension)
        {
            var iconHandle = IntPtr.Zero;
            try
            {
                for (var i = 0; i < 4; i++)
                {
                    var shinfo = new Api.SHFILEINFO();
                    Api.SHGetFileInfo(iconExtension,
                        Api.FILE_ATTRIBUTE_NORMAL, ref shinfo, (uint)Marshal.SizeOf(shinfo),
                        (int)(Api.SHGetFileInfoConstants.SHGFI_ICON |
                        Api.SHGetFileInfoConstants.SHGFI_SMALLICON |
                        Api.SHGetFileInfoConstants.SHGFI_USEFILEATTRIBUTES |
                        Api.SHGetFileInfoConstants.SHGFI_TYPENAME));
                    if (shinfo.hIcon == IntPtr.Zero)
                    {
                        var watt = Marshal.GetLastWin32Error();
                        if (watt == 997)
                        {
                            Thread.Sleep(20);
                            continue;
                        }
                        throw new Exception("Fehler");
                    }
                    iconHandle = shinfo.hIcon;
                    break;
                }

                using (var icon = Icon.FromHandle(iconHandle))
                {
                    using (var bitmap = icon.ToBitmap())
                    {
                        var ms = new System.IO.MemoryStream();
                        bitmap.Save(ms, ImageFormat.Png);
                        ms.Position = 0;
                        session.SendStream(ms, "image/png", Constants.NotModified, false);
                    }
                }
            }
            catch (Exception)
            {
                session.SendError("Nicht gefunden", "Nicht gefunden", 404, "Not Found");
            }
            finally
            {
                Api.DestroyIcon(iconHandle);
            }
        }

        void CreateFolder(IService service)
        {
            var result = new CheckFileOperationResult();
            var input = service.GetInput<NewName>();
            switch (input.directory)
            {
                case "Dienste":
                case "drives":
                    result.Result = OperationCheckResult.Incompatible;
                    service.SendResult(result);
                    break;
                default:
                    try
                    {
                        FolderCreator.Create(input);
                    }
                    catch (AlreadyExistsException)
                    {
                        result.Result = OperationCheckResult.AlreadyExists;
                        service.SendResult(result);
                        break;
                    }
                    catch (UnauthorizedAccessException)
                    {
                        result.Result = OperationCheckResult.Unauthorized;
                        service.SendResult(result);
                        break;
                    }
                    result.Result = OperationCheckResult.OK;
                    service.SendResult(result);
                    break;
            }
        }

        void Rename(IService service)
        {
            var result = OperationCheckResult.ServiceNotSupported;
            var item = service.GetInput<NewName>();
            switch (item.directory)
            {
                case "Dienste":
                case "drives":
                    result = OperationCheckResult.Incompatible;
                    break;
                case "Favoriten":
                    if (!item.makeCopy)
                        result = OperationCheckResult.CopyToFavorites;
                    else
                        result = OperationCheckResult.AlreadyExists;
                    break;
                default:
                    var newItem = Path.Combine(item.directory, item.newName);
                    if (File.Exists(newItem) || Directory.Exists(newItem))
                        result = OperationCheckResult.AlreadyExists;
                    else
                    {
                        var fo = new FileOperation(item.directory, item.makeCopy ? Api.FileFuncFlags.FO_COPY : Api.FileFuncFlags.FO_RENAME);
                        OperationRunner.Operate(() =>
                        {
                            fo.Rename(item.oldName, item.newName);
                        }, () =>
                        {
                            foreach (var id in item.idsToRefresh)
                                EventSession.Refresh(id);
                        });

                        result = OperationCheckResult.OK;
                    }
                    break;
            }
            service.SendResult(result);
        }

        void ShowHidden(IService service)
        {
            showHidden = service.GetInput<ShowHidden>().show;
            service.SendResult(new object());
        }

        void StartExplorer(IService service)
        {
            var se = service.GetInput<StartExplorerInput>();

            var p = Process.Start("explorer.exe", $"{se.directory}");
            Api.SetActiveWindow(p.MainWindowHandle);
            Api.SetForegroundWindow(p.MainWindowHandle);
            service.SendResult(new object());
        }

        void Cancel(IService service)
        {
            cancellationTokenSource?.Cancel();
            service.SendResult(new object());
        }

        void CheckFileOperation(IService service)
        {
            var result = new CheckFileOperationResult();
            cancellationTokenSource?.Cancel();
            cancellationTokenSource = new CancellationTokenSource();
            var cfo = service.GetInput<CheckFileOperation>();
            try
            {
                switch (cfo.operation)
                {
                    case "copy":
                        currentOperation = new CopyOperation(cfo.sourceDir, cfo.targetDir, cfo.items);
                        break;
                    case "move":
                        currentOperation = new MoveOperation(cfo.sourceDir, cfo.targetDir, cfo.items);
                        break;
                    case "delete":
                        currentOperation = new DeleteOperation(cfo.sourceDir, cfo.items);
                        break;
                }

                if (!currentOperation.CheckSelection())
                    result.Result = OperationCheckResult.NoSelection; // Es sind keine gültigen Elemente ausgewählt
                else if (!currentOperation.CheckCompatibility())
                    result.Result = OperationCheckResult.Incompatible; // Sie können diese Elemente nicht in diesen Zielordner kopieren/verschieben (Dateien nach drives)
                else if (!currentOperation.CheckDirectories())
                    result.Result = OperationCheckResult.IdenticalDirectories; // Die Ordner sind identisch
                else if (!currentOperation.CheckSubordinates())
                    result.Result = OperationCheckResult.SubordinateDirectory; // Der Zielordner ist dem Quellordner untergeordnet
                else
                {
                    result.ConflictItems = currentOperation.Prepare(cancellationTokenSource.Token);
                    result.Result = OperationCheckResult.OK;
                }
                result.Exception = currentOperation.CheckException();
                if (cancellationTokenSource.Token.IsCancellationRequested)
                    throw new CancelledException();
            }
            catch (ServiceNotSupportedException)
            {
                result.Result = OperationCheckResult.ServiceNotSupported;
            }
            catch (CancelledException)
            {
                result.Result = OperationCheckResult.Cancelled;
            }
            catch (FavoriteException) when (cfo.operation == "copy" && cfo.items.Length == 1 && cfo.items[0].Kind == Kind.Directory)
            {
                result.Result = OperationCheckResult.CopyToFavorites;
            }
            catch (FavoriteException)
            {
                result.Result = OperationCheckResult.Incompatible;
            }
            catch (Exception e)
            {
                // TODO:
                var emil = e;
            }

            service.SendResult(result);
        }

        void RunOperation(IService service)
        {
            try
            {
                var operate = service.GetInput<Operate>();
                currentOperation.Operate(operate.ignoreConflicts, () =>
                {
                    foreach (var id in operate.idsToRefresh)
                        EventSession.Refresh(id);
                });
                currentOperation = null;
            }
            catch (Exception)
            {
            }
            finally
            {
                service.SendResult(new object());
            }
        }

        void StartServices(IService service)
        {
            var input = service.GetInput<Item[]>();
            ServiceStateProcessor.StartServices(input.Select(n => n.ServiceName).ToArray());
            service.SendResult(new object());
        }

        void StopServices(IService service)
        {
            var input = service.GetInput<Item[]>();
            ServiceStateProcessor.StopServices(input.Select(n => n.ServiceName).ToArray());
            service.SendResult(new object());
        }

        void ExtendedRename(IService service)
        {
            try
            {
                var input = service.GetInput<ItemsInput>();
                Tools.ExtendedRename.Execute(input);
                service.SendResult(OperationCheckResult.OK);
            }
            catch
            {
                service.SendResult(OperationCheckResult.Cancelled);
            }
        }

        void StartDrag(IService service)
        {
            var input = service.GetInput<ItemsInput>();
            var files = input.Items.Select(n => Path.Combine(input.Directory, n.Name));
            DragAndDrop.Current.BeginStartDrag(input.CommanderId, files.ToArray());
            service.SendResult(new object());
        }

        void GetItems(IService service)
        {
            ItemResult itemResult = null;
            try
            {
                var input = service.GetInput<GetItems>();

                if (serviceStates.TryRemove(input.Id, out var ssp))
                    ssp.Dispose();

                IEnumerable<Item> dirIoItems;
                switch (input.Directory)
                {
                    case "drives":
                        var items = System.IO.DriveInfo.GetDrives()
                            .Where(n => n.IsReady)
                            .OrderBy(n => n.Name).Select(n => Item.CreateDriveItem(n.Name, n.VolumeLabel, n.TotalSize,
                            n.DriveType == DriveType.Network ? "images/networkdrive.png" : "images/drive.png"))
                            .Concat(new[]
                            {
                                Item.CreateDriveItem("Registry", null, 0, "images/registry.png"),
                                Item.CreateDriveItem("Dienste", null, 0, "images/service.png"),
                                Item.CreateDriveItem("History", null, 0, "images/history.png"),
                                Item.CreateDriveItem("Favoriten", null, 0, "images/favorite.png")
                            }).ToArray();
                        itemResult = new ItemResult("drives", items);
                        break;
                    case "Dienste":
                        try
                        {
                            var services = ServiceController.GetServices();
                            dirIoItems = services.OrderBy(n => n.DisplayName).Select(n => Item.CreateServiceItem(n));
                            items = Enumerable.Repeat<Item>(Item.CreateParentItem("drives"), 1).Concat(dirIoItems).ToArray();
                            itemResult = new ItemResult("Dienste", items);
                            serviceStates[input.Id] = new ServiceStateProcessor(services, input.Id);
                        }
                        catch (Exception)
                        {
                        }
                        break;
                    case "Registry":
                        itemResult = new ItemResult("Registry", new Item[]
                        {
                            Item.CreateParentItem("drives"),
                            Item.CreateDriveItem("HKEY_CLASSES_ROOT",  null, 0, "images/registry.png"),
                            Item.CreateDriveItem("HKEY_CURRENT_USER",  null, 0, "images/registry.png"),
                            Item.CreateDriveItem("HKEY_LOCAL_MACHINE",  null, 0, "images/registry.png"),
                        }.ToArray());
                        break;
                    default:
                        if (input.Directory.StartsWith("HKEY_"))
                        {
                            var regType = Registry.Type.ClassesRoot;
                            if (input.Directory.StartsWith("HKEY_CLASSES_ROOT"))
                                regType = Registry.Type.ClassesRoot;
                            else if (input.Directory.StartsWith("HKEY_CURRENT_USER"))
                                regType = Registry.Type.CurrentUser;
                            else if (input.Directory.StartsWith("HKEY_LOCAL_MACHINE"))
                                regType = Registry.Type.LocalMachine;
                            items = Registry.Current.GetItems(regType, input.Directory);
                            itemResult = new ItemResult(input.Directory, items);
                            break;
                        }
                        var di = new DirectoryInfo(input.Directory);

                        var directories = from n in di.SafeGetDirectories()
                                          let isHidden = FileAttributes.IsHidden(n.Attributes)
                                          where showHidden ? true : !isHidden
                                          select Item.CreateDirectoryItem(n.Name, n.LastWriteTime, isHidden);
                        var files = from n in di.SafeGetFiles()
                                    let isHidden = FileAttributes.IsHidden(n.Attributes)
                                    where showHidden ? true : !isHidden
                                    select Item.CreateFileItem(n.Name, n.FullName, n.Extension, n.LastWriteTime, n.Length, isHidden);

                        dirIoItems = directories;
                        string parent = null;
                        if (di.Parent != null)
                            parent = di.Parent.FullName;
                        else
                            parent = "drives";
                        items = Enumerable.Repeat<Item>(Item.CreateParentItem(parent), 1).Concat(dirIoItems).Concat(files).ToArray();
                        itemResult = new ItemResult(di.FullName, items);
                        EventSession.UpdateItems(input.Directory, input.Id, input.RequestNumber, items);
                        break;
                }
            }
            catch (UnauthorizedAccessException)
            {
                // TODO:
                // httpSession.SendError("Tut nich", "Tut nich", 500, "UnauthorizedAccessException");
            }
            catch (Exception)
            {
            }
            if (itemResult == null)
                itemResult = new ItemResult();
            service.SendResult(itemResult);
        }

        //void Uac()
        //{
        //    var exe = Assembly.GetExecutingAssembly().Location;
        //    var elevation = Path.Combine((new FileInfo(exe)).DirectoryName, "elevation.exe");
        //    var info = new ProcessStartInfo(elevation)
        //    {
        //        Arguments = "exit",
        //        Verb = "runas",
        //        UseShellExecute = true,
        //    };

        //    var process = new Process
        //    {
        //        EnableRaisingEvents = true,
        //        StartInfo = info
        //    };
        //    process.Start();
        //}

        #endregion

        #region Fields	

        Operation currentOperation;
        CancellationTokenSource cancellationTokenSource;
        bool showHidden;
        ConcurrentDictionary<string, ServiceStateProcessor> serviceStates = new ConcurrentDictionary<string, ServiceStateProcessor>();

        #endregion
    }
}
