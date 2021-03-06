﻿using System;
using System.Drawing;

namespace DicomViewer.Library
{
    public static class ImageExtensions
    {
        public static Image ScaleImage(this Image image, int maxWith, int maxHeight)
        {
            var ratioX = (double)maxWith / image.Width;
            var ratioY = (double)maxHeight / image.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth = (int)(image.Width * ratio);
            var newHeight = (int)(image.Height * ratio);

            var newImage = new Bitmap(newWidth, newHeight);
            Graphics.FromImage(newImage).DrawImage(image, 0, 0, newWidth, newHeight);

            return newImage;
        }
    }
}