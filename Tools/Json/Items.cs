using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
class ItemsInput
{
#pragma warning disable 649

    [DataMember(Name = "directory")]
    public string Directory;
    [DataMember(Name = "items")]
    public Item[] Items;
    [DataMember(EmitDefaultValue = false, Name = "commanderId")]
    public string CommanderId;

#pragma warning restore 649
}

