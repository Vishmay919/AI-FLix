import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Reddit from "./reddit";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      const videoCollection = collection(db, "video-details");
      const videoSnapshot = await getDocs(videoCollection);
      const videoList = videoSnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: doc.id };
      });
      setVideos(videoList);
    };

    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col gap-4 max-w-full">
      <header className="bg-red-700 p-4 mb-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-white text-3xl font-bold">AI-Flix</h1>
          <a
            href="/upload"
            className="text-white text-lg font-semibold border border-red-700 hover:border hover:border-white p-2 rounded-md"
          >
            Upload Video
          </a>
        </div>
      </header>
      {videos &&
        videos.map((video, index) => (
          <Reddit
            video={video}
            videos={videos}
            setVideos={setVideos}
            index={index}
          />
        ))}
    </div>
  );
};

export default VideoList;
