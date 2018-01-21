using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
class DragOver
{
    [DataMember(Name = "x")]
    public int X { get; set; }

    [DataMember(Name = "y")]
    public int Y { get; set; }
}
