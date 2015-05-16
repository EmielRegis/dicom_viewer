using System.Drawing;

namespace DicomViewer.Models
{
    public class DicomListViewModel
    {
        public string Tag { get; set; }
        public string Vr { get; set; }
        public string Length { get; set; }
        public string Value { get; set; }           
    }

    public class DicomImageViewModel
    {
        public string ImagePath { get; set; }
    }

    public class DicomImageBindModel
    {
        public string Name { get; set; }
    }

    public class DicomListViewSimpleModel
    {
        public string Name { get; set; }
    }
}