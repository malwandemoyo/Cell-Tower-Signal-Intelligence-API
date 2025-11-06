import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Radio, MapPin, Signal, TowerControl, ArrowRight } from "lucide-react";
import "./App.css";

const App: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: Radio, text: "Real-time Signal Analysis" },
    { icon: MapPin, text: "Geospatial Intelligence" },
    { icon: Signal, text: "Network Performance Metrics" },
    { icon: TowerControl, text: "Infrastructure Planning" },
  ];

  return (
    <div className="app-container">

      <div className="donut-background">
        <div className="donut donut1"></div>
        <div className="donut donut2"></div>
      </div>
      <div className={`content-container ${isVisible ? "visible" : ""}`}>
        <div className="logo-wrapper">
          <div className="logo-glow"></div>
          <img
            src="/images/hand-holding-small.avif"
            alt="MCP Hackathon Logo"
            className="logo-img"
          />
        </div>
        <h1 className="title-gradient">MCP Hackathon</h1>
        <h1 className="title-gradient2">Group Name: Synergy</h1>

        <p className="tagline">
          Cell Tower Intelligence & Telecom Infrastructure Analysis Platform
        </p>


        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card">
              <feature.icon className="feature-icon" />
              <p className="feature-text">{feature.text}</p>
            </div>
          ))}
        </div>
        <div className="cta-wrapper">
          <button className="cta-button" onClick={() => navigate("/dashboard")}>
            <span className="cta-text">
              Go to Dashboard <ArrowRight className="cta-icon" />
            </span>
          </button>
        </div>
       
        <div className="badges">
          {["Real-time Analytics", "5G Ready", "AI-Powered Insights"].map((b, i) => (
            <span key={i} className="badge">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;