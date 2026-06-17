import { useEffect, useState } from "react";
import "./App.css";

const STORY_LIFETIME = 24 * 60 * 60 * 1000;

function App() {
  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("stories")) || [];
    const validStories = saved.filter(
      story => Date.now() - story.createdAt < STORY_LIFETIME
    );

    setStories(validStories);
    localStorage.setItem("stories", JSON.stringify(validStories));
  }, []);

  const saveStories = newStories => {
    setStories(newStories);
    localStorage.setItem("stories", JSON.stringify(newStories));
  };

  const handleUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const newStory = {
        id: Date.now(),
        image: reader.result,
        createdAt: Date.now()
      };

      saveStories([...stories, newStory]);
    };

    reader.readAsDataURL(file);
  };

  const nextStory = () => {
    if (activeIndex < stories.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(null);
    }
  };

  const prevStory = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <div className="app">
      <h1>Stories</h1>

      <div className="story-list">
        <label className="add-story">
          +
          <input type="file" accept="image/*" onChange={handleUpload} />
        </label>

        {stories.map((story, index) => (
          <img
            key={story.id}
            src={story.image}
            className="story-thumb"
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {activeIndex !== null && (
        <div className="viewer">
          <button onClick={() => setActiveIndex(null)} className="close">
            ×
          </button>

          <button onClick={prevStory} className="nav left">
            ‹
          </button>

          <img src={stories[activeIndex].image} className="viewer-img" />

          <button onClick={nextStory} className="nav right">
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default App;