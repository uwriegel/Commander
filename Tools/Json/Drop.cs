using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Tools;

[DataContract]
class Drop
{
    [DataMember(Name = "x")]
    public int X { get; set; }

    [DataMember(Name = "y")]
    public int Y { get; set; }

    [DataMember(Name = "dragDropKind")]
    public DragDropKind DragDropKind { get; set; }

    [DataMember(Name = "directory")]
    public string Directory { get; set; }

    [DataMember(Name = "items")]
    public Item[] Items { get; set; }
}

