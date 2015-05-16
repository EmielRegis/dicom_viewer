using System;
using System.Collections;
using System.Collections.Generic;
using Dicom;
using Dicom.IO.Buffer;
using DicomViewer.Models;
using Microsoft.SqlServer.Server;

namespace DicomViewer
{
    public class SimpleDicomWalker : IDicomDatasetWalker
    {
        int _lvl;
        string _indent;
        IList<DicomListViewModel> _dicomListViewModelCollection;



        public SimpleDicomWalker(IList<DicomListViewModel> dicomListViewModelCollection)
        {
            _lvl = 0;
            _dicomListViewModelCollection = dicomListViewModelCollection;
        }

        public int Level
        {
            get { return _lvl; }
            set
            {
                _lvl = value;
                _indent = string.Empty;
                for (int i = 0; i < _lvl; i++)
                    _indent += "\t";
            }
        }

        public void OnBeginWalk(DicomDatasetWalker walker, DicomDatasetWalkerCallback callback)
        {
        }

        public bool OnElement(DicomElement element)
        {
            var tag = string.Format("{0}{1}  {2}", _indent, element.Tag.ToString().ToUpper(),
                element.Tag.DictionaryEntry.Name);

            string value = "<zbyt duża wartość>";
            if (element.Length <= 2048)
                value = String.Join("\\", element.Get<string[]>());

            if (element.ValueRepresentation == DicomVR.UI && element.Count > 0)
            {
                var uid = element.Get<DicomUID>(0);
                var name = uid.Name;
                if (name != "Unknown")
                    value = String.Format("{0} ({1})", value, name);
            }

            _dicomListViewModelCollection.Add(new DicomListViewModel
            {
                Tag = tag,
                Vr = element.ValueRepresentation.Code,
                Length = element.Length.ToString(),
                Value = value
            });

            return true;
        }

        public bool OnBeginSequence(DicomSequence sequence)
        {
            var tag = string.Format("{0}{1}  {2}", _indent, sequence.Tag.ToString().ToUpper(),
                sequence.Tag.DictionaryEntry.Name);

            _dicomListViewModelCollection.Add(new DicomListViewModel
            {
                Tag = tag,
                Vr = "SQ",
                Value = string.Empty,
                Length = string.Empty
            });

            Level++;
            return true;
        }

        public bool OnBeginSequenceItem(DicomDataset dataset)
        {
            var tag = string.Format("{0}Element sekwencji:", _indent);

            _dicomListViewModelCollection.Add(new DicomListViewModel
            {
                Tag = tag,
                Vr = string.Empty,
                Value = string.Empty,
                Length = string.Empty
            });

            Level++;
            return true;
        }

        public bool OnEndSequenceItem()
        {
            Level--;
            return true;
        }

        public bool OnEndSequence()
        {
            Level--;
            return true;
        }

        public bool OnBeginFragment(DicomFragmentSequence fragment)
        {
            var tag = string.Format("{0}{1}  {2}", _indent, fragment.Tag.ToString().ToUpper(),
                fragment.Tag.DictionaryEntry.Name);

            _dicomListViewModelCollection.Add(new DicomListViewModel
            {
                Tag = tag,
                Vr = fragment.ValueRepresentation.Code,
                Value = string.Empty,
                Length = string.Empty
            });

            Level++;
            return true;
        }

        public bool OnFragmentItem(IByteBuffer item)
        {
            var tag = String.Format("{0}Fragment", _indent);

            _dicomListViewModelCollection.Add(new DicomListViewModel
            {
                Tag = tag,
                Vr = string.Empty,
                Length = item.Size.ToString(),
                Value = string.Empty
            });

            return true;
        }

        public bool OnEndFragment()
        {
            Level--;
            return true;
        }

        public void OnEndWalk()
        {
        }
    }
}