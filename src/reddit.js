import React, { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

const Reddit = ({ video, videos, setVideos, index }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);

  const handleCommentSubmit = async (videoId, comment) => {
    const videoDocRef = doc(db, "video-details", videoId);
    await updateDoc(videoDocRef, {
      comments: [
        ...videos.find((video) => video.id === videoId).comments,
        comment,
      ],
    });

    // Update the videos state with the updated comments
    setVideos((prevVideos) =>
      prevVideos.map((video) => {
        if (video.id === videoId) {
          return { ...video, comments: [...video.comments, comment] };
        }
        return video;
      })
    );
  };

  const handleLikeClick = async (videoId) => {
    const videoDocRef = doc(db, "video-details", videoId);
    await updateDoc(videoDocRef, {
      likes: increment(1),
    });

    // Update the videos state with the updated likes
    setVideos((prevVideos) =>
      prevVideos.map((video) => {
        if (video.id === videoId) {
          return { ...video, likes: video.likes + 1 };
        }
        return video;
      })
    );
  };

  const handleDislikeClick = async (videoId) => {
    const videoDocRef = doc(db, "video-details", videoId);
    await updateDoc(videoDocRef, {
      likes: increment(-1),
    });

    // Update the videos state with the updated likes
    setVideos((prevVideos) =>
      prevVideos.map((video) => {
        if (video.id === videoId) {
          return { ...video, likes: video.likes - 1 };
        }
        return video;
      })
    );
  };

  const handleVideoPlay = (index) => {
    // Pause the previously playing video
    if (currentVideoIndex !== null && currentVideoIndex !== index) {
      const previousVideo = document.getElementById(
        `video-${currentVideoIndex}`
      );
      if (previousVideo) {
        previousVideo.pause();
      }
    }

    setCurrentVideoIndex(index);
  };

  const handleVideoPause = (index) => {
    if (currentVideoIndex === index) {
      setCurrentVideoIndex(null);
    }
  };

  return (
    <div className="md:m-auto max-w-full mx-4 sm:max-w-max flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-400">
      <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
        <ArrowUpIcon onClick={() => handleLikeClick(video.id)} className="h-6 w-6 hover:bg-gray-200 p-1 rounded-md" />
        <p className="text-xs font-bold text-black">{video.likes}</p>
        <ArrowDownIcon onClick={() => handleDislikeClick(video.id)} className="h-6 w-6 hover:bg-gray-200 p-1 rounded-md" />
      </div>
      <div className="p-3 pb-1 w-[100vw] max-w-[720px]">
        <div>
          <h2 className="text-xl font-semibold">{video.title}</h2>
          {/* Header */}
          <video
            style={{ width: "100%" }}
            id={`video-${index}`}
            className="py-2"
            controls
            src={video.videoUrl}
            type="video/mp4"
            onPlay={() => handleVideoPlay(index)}
            onPause={() => handleVideoPause(index)}
          />
          <div className="my-2">
            <h5 className="font-bold">Comments</h5>
            {video.comments.map((comment, index) => (
              <div key={index} className="comment">
                <p className="bg-gray-50 shadow-md my-2 p-2 rounded-sm">{comment}</p>
              </div>
            ))}
            <form
              className="flex border border-gray-200 rounded-md p-2 my-2 "
              onSubmit={(e) => {
                e.preventDefault();
                const comment = e.target.comment.value;
                handleCommentSubmit(video.id, comment);
                e.target.comment.value = "";
              }}
            >
              <input
                type="text"
                className="flex-1 focus:border-transparent focus:outline-none"
                name="comment"
                placeholder="Add a comment"
              />
              <button className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold" type="submit">Submit</button>
            </form>
          </div>
        </div>
        {/* Body */}
        {/* Comments */}
      </div>
    </div>
  );
};

export default Reddit;
