using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using DicomViewer.Models;
using Newtonsoft.Json;

namespace DicomViewer.Controllers
{
    public class StickersController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [Route("Stickers/Index/{dicomId}/{frame?}")]
        public ActionResult Index(string dicomId, int frame = 0)
        {
            return Json(db.Stickers.Where(s => s.DicomFilename == dicomId && s.FrameNumber == frame), JsonRequestBehavior.AllowGet);
        }

        public ActionResult Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sticker sticker = db.Stickers.Find(id);
            if (sticker == null)
            {
                return HttpNotFound();
            }
            return Json(sticker, JsonRequestBehavior.AllowGet);
        }

        [Route("Stickers/Create/{dicomId}/{frame?}")]
        public ActionResult Create(string dicomId, int frame = 0)
        {
            var sticker = new Sticker {DicomFilename = dicomId, FrameNumber = frame};
            db.Stickers.Add(sticker);
            db.SaveChanges();

            return Json(sticker, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Edit(string id)
        {
            Sticker editedSticker = null;
            try
            {
                editedSticker = new JavaScriptSerializer().Deserialize<Sticker>(Request["sticker"]);
            }
            catch (Exception ex)
            {
            }

            if (id == null || editedSticker == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            Sticker sticker = db.Stickers.Find(id);
            if (sticker == null)
            {
                return HttpNotFound();
            }

            sticker.DicomFilename = editedSticker.DicomFilename;
            sticker.FrameNumber = editedSticker.FrameNumber;
            sticker.Author = editedSticker.Author;
            sticker.Content = editedSticker.Content;
            sticker.Id = editedSticker.Id;
            sticker.Title= editedSticker.Title;
            sticker.XPixelCoordinate = editedSticker.XPixelCoordinate;
            sticker.YPixelCoordinate = editedSticker.YPixelCoordinate;

            db.SaveChanges();

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sticker sticker = db.Stickers.Find(id);
            if (sticker == null)
            {
                return HttpNotFound();
            }

            db.Stickers.Remove(sticker);
            db.SaveChanges();

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
