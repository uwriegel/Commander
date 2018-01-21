using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using Tools;

[DataContract]
public class Item
{
    [DataMember(EmitDefaultValue = false, Name = "imageUrl")]
    public string ImageUrl { get; set; }

    [DataMember(EmitDefaultValue = false, Name = "name")]
    public string Name { get; set; }

    [DataMember]
    public long fileSize;

    [DataMember(EmitDefaultValue = false, Name = "serviceName")]
    public string ServiceName { get; private set; }

    [DataMember(EmitDefaultValue = false, Name = "description")]
    public string Description { get; private set; }

    public DateTime DateTime { get; set; }

    public Kind Kind { get { return kind; } }

    public string Extension
    {
        get
        {
            var pos = Name.LastIndexOf('.');
            if (pos == -1)
                return "";
            return Name.Substring(pos);
        }
    }

    [DataMember(EmitDefaultValue = false)]
    public string renamedName;

    [DataMember(EmitDefaultValue = false)]
    string dateTime;

    [DataMember(EmitDefaultValue = false)]
    bool isHidden;

    [DataMember(EmitDefaultValue = false)]
    string value;

#pragma warning disable 0414
    [DataMember(EmitDefaultValue = false)]
    string parent;

    [DataMember]
    Kind kind;

    [DataMember(EmitDefaultValue = false)]
    int startType;
    [DataMember(EmitDefaultValue = false)]
    string status;

#pragma warning restore 0414

    public static Item CreateDriveItem(string drive, string description, long size, string imageUrl = "images/drive.png")
    {
        return new Item(Kind.Drive, imageUrl, drive, default(DateTime), false)
        {
            fileSize = size,
            Description = description
        };
    }

    public static Item CreateParentItem(string parent)
    {
        return new Item(Kind.Parent, "images/parentfolder.png", "..", default(DateTime), false)
        {
            parent = parent
        };
    }

    public static Item CreateFileItem(string name, string fullName, string extension, DateTime dateTime, long fileSize, bool isHidden)
    {
        return new Item(Kind.File, Tools.ImageUrl.Get(name, extension, fullName), name, dateTime, isHidden)
        {
            fileSize = fileSize
        };
    }

    public static Item CreateDirectoryItem(string name, DateTime dateTime, bool isHidden)
    {
        return new Item(Kind.Directory, "images/Folder.png", name, dateTime, isHidden);
    }

    public static Item CreateServiceItem(ServiceController sc)
    {
        var item = new Item(Kind.Service, "images/serviceStopped.png", sc.DisplayName, default(DateTime), false)
        {
            ServiceName = sc.ServiceName
        };

        var serviceKey = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\" + item.ServiceName);
        if (serviceKey != null)
            item.startType = (int)serviceKey.GetValue("Start");
        switch (sc.Status)
        {
            case ServiceControllerStatus.Running:
                item.status = "rennt";
                item.ImageUrl = "images/service.png";
                break;
            case ServiceControllerStatus.Stopped:
                item.status = "aus";
                break;
            case ServiceControllerStatus.StartPending:
                item.status = "läuft an";
                break;
            case ServiceControllerStatus.StopPending:
                item.status = "fährt runter";
                break;
        }
        return item;
    }

    public static Item CreateRegistryItem(RegistryKey key, string name, RegistryValueKind kind, string value)
    {
        var item = new Item(Kind.Registry, name);
        switch (kind)
        {
            case RegistryValueKind.None:
                item.ImageUrl = "images/registry.png";
                break;
            case RegistryValueKind.String:
                item.ImageUrl = "images/string.png";
                break;
            case RegistryValueKind.Binary:
            case RegistryValueKind.DWord:
                item.ImageUrl = "images/integer.png";
                break;
        }
        try
        {
            if (key != null)
            {
                var registry = key.OpenSubKey(name, false);
                item.value = registry.GetValue(null) as string;
            }
        }
        catch { }
        return item;
    }

    public static Item CreateRegistryPropertyItem(string name, RegistryValueKind kind, object value)
    {
        var item = new Item(Kind.RegistryProperty, name);
        switch (kind)
        {
            case RegistryValueKind.String:
                item.value = (string)value;
                break;
            case RegistryValueKind.DWord:
                item.value = $"{(int)value}";
                break;
            case RegistryValueKind.Binary:
                item.value = BitConverter.ToString((byte[])value);
                break;
        }
        return item;
    }

    Item(Kind kind, string name)
    {
        this.Name = name;
        this.kind = kind;
    }

    Item(Kind kind, string imageUrl, string name, DateTime dateTime, bool isHidden) : this(kind, name)
    {
        this.isHidden = isHidden;
        DateTime = dateTime;
        this.ImageUrl = imageUrl;
    }

    [OnSerializing]
    public void OnSerializing(StreamingContext context)
    {
        if (DateTime != default(DateTime))
            dateTime = DateTime.ToUniversalTime().ToString("o");
    }

    [OnDeserialized]
    public void OnDeserialized(StreamingContext context)
    {
    }
}

