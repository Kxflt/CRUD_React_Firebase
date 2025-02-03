import { useState, useEffect } from "react";
import axios from "axios";
import "./Sidebar.module.css";

const Sidebar = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=programming&apiKey=c693c6fb351d4417aaf0dfe781fb2dbe`
        );
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="sidebar">
      <h2>Programming News</h2>
      {news.map((item, index) => (
        <div key={index} className="news-item">
          {item.urlToImage && <img src={item.urlToImage} alt={item.title} />}
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
