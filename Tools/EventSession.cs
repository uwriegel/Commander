using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Tools
{
    public interface IWebSocketSender
    {
        int Id { get; }

        void Close();
        void Send(string payload);
        void SendJson(object jsonObject);
    }

    class EventSession
    {
        public static void GetEvents(IWebSocketSender session)
        {
            EventSession.session = session;
        }

        public static void UpdateItems(string directory, string id, int requestNumber, Item[] items)
        {
            try
            {
                if (!sessions.TryGetValue(id, out var session))
                {
                    session = new EventSession();
                    sessions[id] = session;
                }
                Interlocked.Exchange(ref session.requestNumber, requestNumber);
                ThreadPool.QueueUserWorkItem(n => session.UpdateItem(directory, id, items, requestNumber));
            }
            catch (Exception e)
            {
                var test = e;
            }
        }

        public static void Refresh(string id)
        {
            try
            {
                EventSession.session.SendJson(new Event
                {
                    Id = id,
                    Refresh = true
                });
            }
            catch (Exception e)
            {
                var test = e;
            }
        }

        public static void DragOver(int x, int y)
        {
            try
            {
                EventSession.session.SendJson(new Event
                {
                    DragOver = new DragOver
                    {
                        X = x,
                        Y = y
                    }
                });
            }
            catch (Exception e)
            {
                var test = e;
            }
        }

        public static void DragLeave()
        {
            try
            {
                EventSession.session.SendJson(new Event
                {
                    DragLeave = true
                });
            }
            catch (Exception e)
            {
                var test = e;
            }
        }

        public static void DragFinished(string commanderId, bool refresh)
        {
            try
            {
                EventSession.session.SendJson(new Event
                {
                    DragFinished = new DragFinished
                    {
                        CommanderId = commanderId,
                        Refresh = refresh
                    }
                });
            }
            catch (Exception e)
            {
                var test = e;
            }
        }

        public static void Drop(int x, int y, DragDropKind dragDropKind, string directory, Item[] items)
        {
            try
            {
                EventSession.session.SendJson(new Event
                {
                    Drop = new Drop
                    {
                        X = x,
                        Y = y,
                        DragDropKind = dragDropKind,
                        Directory = directory,
                        Items = items
                    }
                });
            }
            catch (Exception e)
            {
                var test = e;
            }
        }

        public static void UpdateServiceState(string id, Item[] serviceItem)
        {
            try
            {
                if (!sessions.TryGetValue(id, out var session))
                {
                    session = new EventSession();
                    sessions[id] = session;
                }
                session.SendUpdateServiceState(id, serviceItem);
            }
            catch (Exception e)
            {
                var test = e;
            }
        }

        ItemUpdate GetItemUpdate(string directory, Item item, int index, int requestNumber)
        {
            try
            {
                if (Interlocked.CompareExchange(ref this.requestNumber, requestNumber, requestNumber) != requestNumber)
                    return null;
                string version = null;
                var fullName = Path.Combine(directory, item.Name);
                var updateTime = default(DateTime);
                if (item.Extension.ToLower() == ".jpg")
                {
                    using (var er = new ExifReader(fullName))
                    {
                        if (er.GetTagValue<DateTime>(ExifReader.ExifTags.DateTimeOriginal, out var exifTime))
                            updateTime = exifTime;
                    }
                }
                else
                    version = FileVersion.Get(fullName);

                if (!string.IsNullOrEmpty(version) || updateTime != default(DateTime))
                    return new ItemUpdate(index, version, updateTime);
                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        void UpdateItem(string directory, string id, Item[] items, int requestNumber)
        {
            try
            {
                var index = 0;
                var result = (from n in items
                              let i = index++
                              where n.Kind == Kind.File
                              let ui = GetItemUpdate(directory, n, i, requestNumber)
                              where ui != null
                              select ui).ToArray();

                if (result.Length > 0)
                {
                    var dcjs = new DataContractJsonSerializer(typeof(ItemUpdate[]));
                    var ms = new MemoryStream();
                    dcjs.WriteObject(ms, result);
                    ms.Capacity = (int)ms.Length;

                    if (Interlocked.CompareExchange(ref this.requestNumber, requestNumber, requestNumber) == requestNumber)
                    {
                        session.SendJson(new Event
                        {
                            Id = id,
                            ItemUpdates = result
                        });
                    }
                }
            }
            catch
            {
            }
        }

        void SendUpdateServiceState(string id, Item[] serviceItems)
        {
            session.SendJson(new Event
            {
                Id = id,
                ServiceItems = serviceItems
            });
        }

        EventSession()
        {
        }

        static IWebSocketSender session;
        static Dictionary<string, EventSession> sessions = new Dictionary<string, EventSession>();
        int requestNumber;
    }
}
