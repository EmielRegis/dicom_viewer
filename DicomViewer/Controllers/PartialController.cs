using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Dicom;
using DicomViewer.Models;

namespace DicomViewer.Controllers
{
    public class PartialController : Controller
    {
        [ChildActionOnly]
        public ActionResult FileBrowser(string id)
        {
            var dicomFiles = Directory.EnumerateFiles(HttpContext.Server.MapPath(@"~/Content/Dicom_Files"))
                            .Where(f => f.EndsWith("dcm"));

            return PartialView("_FileBrowser", dicomFiles.Select(f => new DicomListViewSimpleModel { Name = Path.GetFileNameWithoutExtension(f) }));

        }


      
    }
}