using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace Tools
{
    public class ServiceStateProcessor : IDisposable
    {
        public ServiceStateProcessor(ServiceController[] services, string id)
        {
            this.services = services;
            this.id = id;
            timer = new Timer(300);
            timer.Elapsed += Timer_Elapsed;
            timer.Start();
        }

        public static void StartServices(string[] services)
        {
            if (!AdminRights.IsAdmin())
                ElevatedOperation.StartServices(services);
            else
            {
                foreach (var service in services)
                {
                    try
                    {
                        var controller = new ServiceController(service);
                        controller.Start();
                    }
                    catch { }
                }
            }
        }

        public static void StopServices(string[] services)
        {
            if (!AdminRights.IsAdmin())
                ElevatedOperation.StopServices(services);
            else
            {
                foreach (var service in services)
                {
                    try
                    {
                        var controller = new ServiceController(service);
                        controller.Stop();
                    }
                    catch { }
                }
            }
        }

        void Timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            var updateItems = services.Where(n =>
            {
                var status = n.Status;
                n.Refresh();
                return status != n.Status;
            }).Select(n => Item.CreateServiceItem(n));
            EventSession.UpdateServiceState(id, updateItems.ToArray());
        }

        public void Stop()
        {
            timer.Stop();
            timer.Elapsed -= Timer_Elapsed;
        }

        ServiceController[] services;
        Timer timer;
        string id;

        #region IDisposable Support

        bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    Stop();
                }

                // free unmanaged resources (unmanaged objects) and override a finalizer below.
                // set large fields to null.
                disposedValue = true;
            }
        }

        // override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~ServiceStateProcessor() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion
    }
}
