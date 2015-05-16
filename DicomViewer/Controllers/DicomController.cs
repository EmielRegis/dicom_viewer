using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Net;
using Dicom;
using DicomViewer.Models;

namespace DicomViewer.Controllers
{
    public class DicomController : Controller
    {
        // GET: Dicom
        public ActionResult Index()
        {
            var dicomFiles = Directory.EnumerateFiles(HttpContext.Server.MapPath(@"~/Content/Dicom_Files"))
                            .Where(f => f.EndsWith("dcm"));

            return View(dicomFiles.Select(f => new DicomListViewSimpleModel { Name = Path.GetFileNameWithoutExtension(f) }));
        }

        public ActionResult Details(string id)
        {
            if(id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            var path = HttpContext.Server.MapPath(@"~/Content/Dicom_Files/" + id + ".dcm");


            var dicomMetaDataCollection = new List<DicomListViewModel>();
            var dicomDataSetCollection = new List<DicomListViewModel>();
            



            try
            {
                var file = DicomFile.Open(path);
                new DicomDatasetWalker(file.FileMetaInfo).Walk(new SimpleDicomWalker(dicomMetaDataCollection));
                new DicomDatasetWalker(file.Dataset).Walk(new SimpleDicomWalker(dicomDataSetCollection));
                dicomMetaDataCollection.AddRange(dicomDataSetCollection.ToArray());
            }
            catch (Exception)
            {
            }

            return View(dicomDataSetCollection);
        }
    }
}