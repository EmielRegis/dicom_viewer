using System;

namespace DicomViewer.Controllers
{
    public class Sticker
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int XPixelCoordinate { get; set; }
        public int YPixelCoordinate { get; set; }
        public string Author { get; set; }
        public string DicomFilename { get; set; }
        public string NAME { get; set; }

        public Sticker()
        {
            Id = new Guid().ToString();
            Title = "";
            Content = "";
            XPixelCoordinate = 0;
            YPixelCoordinate = 0;
            Author = "";
        }
    }
}