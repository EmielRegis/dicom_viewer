using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Net;
using Dicom;
using Dicom.Imaging;
using DicomViewer.Models;
using DicomViewer.Library;

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

        public ActionResult Image(string id)
        {
            var model = new DicomImageBindModel {Name = id};
            return View(model);
        }

        public ActionResult GetFramesCount(string id)
        {
            if (id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            try
            {
                var path = HttpContext.Server.MapPath(@"~/Content/Dicom_Files/" + id + ".dcm");

                DicomFile dicomFile = DicomFile.Open(path);
                DicomDataset dataset = dicomFile.Dataset;

                DicomImage dicomImage = new DicomImage(dataset);

                return Json(dicomImage.NumberOfFrames, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(-1, JsonRequestBehavior.AllowGet);
            }
        }

        [Route("Dicom/GetImage/{id}/{frame?}")]
        public ActionResult GetImage(string id, int frame = 0)
        {
            if (id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            try
            {
                var path = HttpContext.Server.MapPath(@"~/Content/Dicom_Files/" + id + ".dcm");

                DicomFile dicomFile = DicomFile.Open(path);
                DicomDataset dataset = dicomFile.Dataset;
                DicomFileFormat fileFormat = dicomFile.Format;
                DicomFileMetaInformation metaInfo = dicomFile.FileMetaInfo;
                //dataset.Set(DicomTag.WindowWidth, 200.0); //the WindowWidth must be non-zero
                dataset.Add(DicomTag.WindowCenter, "100.0");
                //dataset.Add(DicomTag.PhotometricInterpretation, "MONOCHROME1"); //ValueRepresentations tag is broken
                dataset.Add(new DicomCodeString(DicomTag.PhotometricInterpretation, "MONOCHROME1"));
                DicomImage dicomImage = new DicomImage(dataset);

                Image image = dicomImage.RenderImage(frame);

                MemoryStream ms = new MemoryStream();

                image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);

                return File(ms.ToArray(), "image/png");
            }
            catch (Exception)
            {
                var path = HttpContext.Server.MapPath(@"~/Content/Images/einsteinfound.jpg");
                Image image = System.Drawing.Image.FromFile(path);

                MemoryStream ms = new MemoryStream();

                image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                
                return File(ms.ToArray(), "image/png");
            }
        }

        [Route("Dicom/GetImageMiniature/{id}/{frame?}")]
        public ActionResult GetImageMiniature(string id, int frame = 0)
        {
            if (id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            try
            {
                var path = HttpContext.Server.MapPath(@"~/Content/Dicom_Files/" + id + ".dcm");

                DicomFile dicomFile = DicomFile.Open(path);
                DicomDataset dataset = dicomFile.Dataset;
                DicomFileFormat fileFormat = dicomFile.Format;
                DicomFileMetaInformation metaInfo = dicomFile.FileMetaInfo;
                //dataset.Set(DicomTag.WindowWidth, 200.0); //the WindowWidth must be non-zero
                dataset.Add(DicomTag.WindowCenter, "100.0");
                //dataset.Add(DicomTag.PhotometricInterpretation, "MONOCHROME1"); //ValueRepresentations tag is broken
                dataset.Add(new DicomCodeString(DicomTag.PhotometricInterpretation, "MONOCHROME1"));
                DicomImage dicomImage = new DicomImage(dataset);

                Image image = dicomImage.RenderImage(frame).ScaleImage(200, 200); ;

                MemoryStream ms = new MemoryStream();

                image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);

                return File(ms.ToArray(), "image/png");
            }
            catch (Exception)
            {
                var path = HttpContext.Server.MapPath(@"~/Content/Images/einsteinfound.jpg");
                Image image = System.Drawing.Image.FromFile(path).ScaleImage(200, 200);

                MemoryStream ms = new MemoryStream();

                image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);

                return File(ms.ToArray(), "image/png");
            }
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