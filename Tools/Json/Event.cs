using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
class Event
{
    [DataMember(EmitDefaultValue = false, Name = "serviceItems")]
    public Item[] ServiceItems { get; set; } = null;

    [DataMember(EmitDefaultValue = false, Name = "itemUpdates")]
    public ItemUpdate[] ItemUpdates { get; set; } = null;

    [DataMember(EmitDefaultValue = false, Name = "id")]
    public string Id { get; set; }

    [DataMember(EmitDefaultValue = false, Name = "refresh")]
    public bool Refresh { get; set; }

    [DataMember(EmitDefaultValue = false, Name = "dragOver")]
    public DragOver DragOver { get; set; }

    [DataMember(EmitDefaultValue = false, Name = "drop")]
    public Drop Drop { get; set; }

    [DataMember(EmitDefaultValue = false, Name = "dragLeave")]
    public bool DragLeave { get; set; }

    [DataMember(EmitDefaultValue = false, Name = "dragFinished")]
    public DragFinished DragFinished { get; set; }
}

