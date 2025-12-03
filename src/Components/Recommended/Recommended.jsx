import React, { useEffect, useState } from "react";
import "./Recommended.css";
import thumbnail1 from "../../assets/thumbnail1.png";
import { API_KEY, value_converter } from "../../data";
import { Link } from "react-router-dom";

const Recommended = () => {
  const [apiData, setApiData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const url =
        "https://youtube.googleapis.com/youtube/v3/videos" +
        "?part=snippet,contentDetails,statistics" +
        "&chart=mostPopular" +
        "&regionCode=US" +
        "&maxResults=50" + // ask for MORE videos
        `&key=${API_KEY}`;

      console.log("Recommended URL:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("Recommended API response:", data);

      if (data.error) {
        setErrorMsg(data.error.message || "Unknown API error");
        setApiData([]);
        return;
      }

      setApiData(Array.isArray(data.items) ? data.items : []);
      setErrorMsg("");
    } catch (err) {
      console.error("Recommended fetch error:", err);
      setErrorMsg("Network error");
      setApiData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="recommended">
      {/* API error message */}
      {errorMsg && (
        <p style={{ color: "red", marginBottom: "10px" }}>
          API error: {errorMsg}
        </p>
      )}

      {/* Render videos */}
      {apiData.map((item, index) => (
        <div key={item.id || index} className="side-video-list">
          <Link
            to={`/video/${item.snippet.categoryId}/${item.id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="small-thumbnail"
          >
            <img src={item.snippet.thumbnails.medium.url} alt="" />
          </Link>

          <div className="vid-info">
            <h4>{item?.snippet?.title || "Video Title"}</h4>
            <p>{item?.snippet?.channelTitle || "Channel Name"}</p>
            <p>{value_converter(item.statistics.viewCount)} views</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommended;
