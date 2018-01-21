using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

[DataContract]
public class ItemUpdate
{
    [DataMember(EmitDefaultValue = false)]
    public int index;

    [DataMember(EmitDefaultValue = false)]
    public string version;

    [DataMember(EmitDefaultValue = false, Name = "dateTime")]
    string _dateTime;

    DateTime dateTime;

    public ItemUpdate(int index, string version, DateTime dateTime = default(DateTime))
    {
        this.index = index;
        this.version = version;
        this.dateTime = dateTime;
    }

    [OnSerializing]
    public void OnSerializing(StreamingContext context)
    {
        if (dateTime != default(DateTime))
            _dateTime = dateTime.ToUniversalTime().ToString("o");
    }
}
