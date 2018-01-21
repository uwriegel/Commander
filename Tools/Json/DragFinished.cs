using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
class DragFinished
{
    [DataMember(Name = "commanderId")]
    public string CommanderId { get; set; }

    [DataMember(Name = "refresh")]
    public bool Refresh { get; set; }
}