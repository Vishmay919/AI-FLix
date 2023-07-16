import React, { useRef, useState } from "react";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { videosRef, db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";


const VideoUpload = () => {
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [video, setVideo] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const videoInputRef = useRef(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleVideoChange = (e) => {
    const selectedFile = e.target.files[0];
    setVideo(selectedFile);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!title || !video) {
      setUploadError("Please fill in all the fields.");
      return;
    }

    let vidName = title + "_" + new Date().toISOString() + "_" + video.name;

    const videoRef = ref(videosRef, vidName);
    const uploadTask = uploadBytesResumable(videoRef, video);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.log("Error uploading video:", error);
        setUploadError("An error occurred while uploading the video.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("Download URL:", downloadURL);
            return addVideoToDatabase(downloadURL);
          })
          .then(() => {
            console.log("Video added to the database");
            alert("Successfully uploaded video");
            setTitle("");
            setVideo(null);
            setUploadError(null);
            setProgress(0);
            videoInputRef.current.value = ""; 
          })
          .catch((error) => {
            console.log("Error uploading video:", error);
            setUploadError("An error occurred while uploading the video.");
          });
      }
    );
  };

  const addVideoToDatabase = (downloadURL) => {
    const videoDetails = {
      title: title,
      likes: 0,
      comments: [],
      videoUrl: downloadURL,
    };

    const videosCollection = collection(db, "video-details");
    return addDoc(videosCollection, videoDetails);
  };

  return (
    <div className="flex flex-col max-w-md m-auto mt-6">
      <h2 className="font-semibold text-[32px] mt-2 mb-12">Upload a Video</h2>

      <form
        onSubmit={handleUpload}
        class="bg-white shadow-lg border border-gray-300 rounded px-2 py-8"
      >
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Video
          </label>
          <input
            class="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            ref={videoInputRef}
          />
        </div>
        {uploadError && (
          <p className="text-red-500 text-xs italic mb-4">{uploadError}</p>
        )}
        <div className="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleUpload}
          >
            Upload Video
          </button>
          {progress > 0 && (
            <p className="text-md text-gray-600 mx-4">{`Uploaded: ${Math.trunc(progress)} % `}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default VideoUpload;
