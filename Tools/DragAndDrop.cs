using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Tools
{
    class DragAndDrop
    {
        public static DragAndDrop Current { get; } = new DragAndDrop();

        public void Initialize(IntPtr hwnd)
        {
            var cp = Marshal.GetFunctionPointerForDelegate<OnDragOverDelegate>(onDragOver);
            var cp2 = Marshal.GetFunctionPointerForDelegate<OnDragLeaveDelegate>(onDragLeave);
            var cp3 = Marshal.GetFunctionPointerForDelegate<OnDropDelegate>(onDrop);
            InitializeDragAndDrop(hwnd, cp, cp2, cp3);
            var module = LoadLibrary("Api.dll");
        }

        public void BeginStartDrag(string commanderId, string[] filesToDrag)
        {
            // Dispatcher.BeginInvoke((Action)(() => StartDrag(commanderId, filesToDrag)));
        }

        void StartDrag(string commanderId, string[] filesToDrag)
        {
            //var effect = Dispatcher.WindowElement.DoDragDrop(new DataObject(DataFormats.FileDrop, filesToDrag),
            //    DragDropEffects.Copy | DragDropEffects.Move | DragDropEffects.Link);
            //EventSession.DragFinished(commanderId, effect == DragDropEffects.Move);
        }

        bool OnDragOver(int x, int y)
        {
            EventSession.DragOver(x, y);
            return true;
        }

        void OnDragLeave()
        {
            EventSession.DragLeave();
        }

        void OnDrop(int x, int y, DragDropKind dragDropKind, [MarshalAs(UnmanagedType.LPWStr)] string filesString)
        {
            EventSession.DragLeave();
            var pathes = filesString.Split(new[] { "|" }, StringSplitOptions.RemoveEmptyEntries);
            var items = (from n in pathes
                         where Directory.Exists(n)
                         let i = new DirectoryInfo(n)
                         select new
                         {
                             parent = i.Parent.FullName,
                             item = Item.CreateDirectoryItem(i.Name, i.LastWriteTime, false)
                         }).Concat(
            (from n in pathes
             where File.Exists(n)
             let i = new FileInfo(n)
             select new
             {
                 parent = i.DirectoryName,
                 item = Item.CreateFileItem(i.Name, i.FullName, i.Extension, i.LastWriteTime, i.Length, false)
             })).ToArray();
            if (items.Length == 0)
                return;

            if (items.Any(n => string.Compare(n.parent, items[0].parent, true) != 0))
            {
                MessageBox.Show("Fehler");
                return;
            }

            EventSession.Drop(x, y, dragDropKind, items[0].parent, items.Select(n => n.item).ToArray());
        }

        DragAndDrop()
        {
            onDragOver = new OnDragOverDelegate(OnDragOver);
            onDragLeave = new OnDragLeaveDelegate(OnDragLeave);
            onDrop = new OnDropDelegate(OnDrop);
        }

        OnDragOverDelegate onDragOver;
        OnDragLeaveDelegate onDragLeave;
        OnDropDelegate onDrop;

        delegate bool OnDragOverDelegate(int x, int y);
        delegate void OnDragLeaveDelegate();
        delegate void OnDropDelegate(int x, int y, DragDropKind dragDropKind, [MarshalAs(UnmanagedType.LPWStr)] string files);
        [DllImport("Api.dll", EntryPoint = "initialize_drag_and_drop")]
        static extern void InitializeDragAndDrop(IntPtr hwnd, IntPtr onDragOverCallback, IntPtr onDragLeaveCallback, IntPtr onDropCallback);
        [DllImport("kernel32.dll")]
        static extern IntPtr LoadLibrary([MarshalAs(UnmanagedType.LPStr)] string fileName);
    }
}
