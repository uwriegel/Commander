using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
public class ItemResult
{
    internal ItemResult()
    {
        items = new Item[0];
        AccessTime = DateTime.Now;
    }

    internal ItemResult(string currentDirectory, Item[] items)
    {
        this.items = items;
        this.currentDirectory = currentDirectory;
        AccessTime = DateTime.Now;
    }

    [DataMember(EmitDefaultValue = false)]
    public string currentDirectory;

    [DataMember(EmitDefaultValue = false)]
    public Item[] items;

    public DateTime AccessTime;
}

