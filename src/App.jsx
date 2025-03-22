// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }
import React, { useState } from "react";
import "./CookedCalculator.css";

const App = () => {
  const [inputs, setInputs] = useState({
    hoursAwake: 0,
    stressLevel: 5,
    deadlineProximity: 5,
    caffeineIntake: 0,
    lastMealHours: 0,
    hydrationLevel: 5,
    distractionLevel: 5,
    recentFups: [],
  });

  const [fupInput, setFupInput] = useState("");
  const [fupRating, setFupRating] = useState(5);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleFupAdd = () => {
    if (fupInput.trim()) {
      setInputs((prev) => ({
        ...prev,
        recentFups: [
          ...prev.recentFups,
          {
            description: fupInput,
            severity: fupRating,
          },
        ],
      }));
      setFupInput("");
      setFupRating(5);
    }
  };

  const removeFup = (index) => {
    setInputs((prev) => ({
      ...prev,
      recentFups: prev.recentFups.filter((_, i) => i !== index),
    }));
  };

  const calculateCookedness = () => {
    // Core algorithm using weighted factors
    const weights = {
      hoursAwake: 0.13,
      stressLevel: 0.15,
      deadlineProximity: 0.2,
      caffeineIntake: 0.08,
      lastMealHours: 0.08,
      hydrationLevel: 0.08,
      distractionLevel: 0.08,
      recentFups: 0.2, // 20% weight for f-ups
    };

    // Normalize and calculate
    const normalizedHoursAwake = Math.min(inputs.hoursAwake / 24, 1) * 10;
    const normalizedCaffeine = Math.min(inputs.caffeineIntake / 500, 1) * 10;
    const normalizedLastMeal = Math.min(inputs.lastMealHours / 12, 1) * 10;
    const normalizedHydration = 10 - inputs.hydrationLevel; // Invert: lower is worse

    // Calculate f-ups impact (average severity * quantity factor)
    let fupsImpact = 0;
    if (inputs.recentFups.length > 0) {
      const avgSeverity =
        inputs.recentFups.reduce((sum, fup) => sum + fup.severity, 0) /
        inputs.recentFups.length;
      // Exponential factor for multiple f-ups
      const quantityFactor = Math.min(
        1 + Math.log(inputs.recentFups.length) / Math.log(10),
        2
      );
      fupsImpact = avgSeverity * quantityFactor;
    }

    // Calculate the weighted score
    const cookedScore = (
      normalizedHoursAwake * weights.hoursAwake +
      inputs.stressLevel * weights.stressLevel +
      inputs.deadlineProximity * weights.deadlineProximity +
      normalizedCaffeine * weights.caffeineIntake +
      normalizedLastMeal * weights.lastMealHours +
      normalizedHydration * weights.hydrationLevel +
      inputs.distractionLevel * weights.distractionLevel +
      fupsImpact * weights.recentFups
    ).toFixed(2);

    // Calculate the percentage (0-100)
    const percentage = Math.min(Math.max(cookedScore * 10, 0), 100).toFixed(1);

    // Determine the cook level
    let cookLevel = "";
    if (percentage < 20) cookLevel = "Totally Fresh";
    else if (percentage < 40) cookLevel = "Lightly Toasted";
    else if (percentage < 60) cookLevel = "Medium Rare";
    else if (percentage < 80) cookLevel = "Well Done";
    else cookLevel = "Absolutely Cremated";

    setResult({
      score: cookedScore,
      percentage,
      cookLevel,
      advice: getAdvice(cookLevel, inputs.recentFups.length > 0),
    });
  };

  const getAdvice = (level, hasFups) => {
    const baseAdvice = {
      "Totally Fresh": "You're doing great! Keep it up.",
      "Lightly Toasted": "You're starting to feel it. Consider a short break.",
      "Medium Rare":
        "You're definitely cooking. Time to step back and recharge.",
      "Well Done":
        "You're seriously cooked. Take a break, eat something, and hydrate immediately.",
      "Absolutely Cremated":
        "EMERGENCY: Stop what you're doing. Sleep, eat, and recover before continuing.",
    };

    let advice = baseAdvice[level] || "";

    if (hasFups) {
      switch (level) {
        case "Totally Fresh":
        case "Lightly Toasted":
          advice +=
            " Don't dwell on your recent mistakes - everyone makes them.";
          break;
        case "Medium Rare":
          advice +=
            " Take a moment to reflect on recent events, but don't be too hard on yourself.";
          break;
        case "Well Done":
        case "Absolutely Cremated":
          advice +=
            " Consider talking to someone about recent events - perspective helps.";
          break;
        default:
          break;
      }
    }

    return advice;
  };

  return (
    <div className="calculator-container">
      <div className="calculator-card">
        <h1 className="calculator-title">How Cooked Are You?</h1>
        <p className="calculator-subtitle">
          Enter your current situation metrics
        </p>

        <div className="input-group">
          <div className="input-field">
            <label>
              Hours Awake
              <span className="input-hint">(0-24+)</span>
            </label>
            <input
              type="number"
              name="hoursAwake"
              min="0"
              max="48"
              value={inputs.hoursAwake}
              onChange={handleChange}
            />
          </div>

          <div className="input-field">
            <label>
              Stress Level
              <span className="input-hint">(1-10)</span>
            </label>
            <input
              type="range"
              name="stressLevel"
              min="1"
              max="10"
              step="0.5"
              value={inputs.stressLevel}
              onChange={handleChange}
            />
            <div className="range-labels">
              <span>Chill</span>
              <span>Panicking</span>
            </div>
          </div>

          <div className="input-field">
            <label>
              Deadline Proximity
              <span className="input-hint">(1-10)</span>
            </label>
            <input
              type="range"
              name="deadlineProximity"
              min="1"
              max="10"
              step="0.5"
              value={inputs.deadlineProximity}
              onChange={handleChange}
            />
            <div className="range-labels">
              <span>Far Away</span>
              <span>Yesterday</span>
            </div>
          </div>

          <div className="input-field">
            <label>
              Caffeine Intake (mg)
              <span className="input-hint">(0-500+)</span>
            </label>
            <input
              type="number"
              name="caffeineIntake"
              min="0"
              max="1000"
              value={inputs.caffeineIntake}
              onChange={handleChange}
            />
          </div>

          <div className="input-field">
            <label>
              Hours Since Last Meal
              <span className="input-hint">(0-12+)</span>
            </label>
            <input
              type="number"
              name="lastMealHours"
              min="0"
              max="24"
              value={inputs.lastMealHours}
              onChange={handleChange}
            />
          </div>

          <div className="input-field">
            <label>
              Hydration Level
              <span className="input-hint">(1-10)</span>
            </label>
            <input
              type="range"
              name="hydrationLevel"
              min="1"
              max="10"
              step="0.5"
              value={inputs.hydrationLevel}
              onChange={handleChange}
            />
            <div className="range-labels">
              <span>Desert</span>
              <span>Hydro Homie</span>
            </div>
          </div>

          <div className="input-field">
            <label>
              Distraction Level
              <span className="input-hint">(1-10)</span>
            </label>
            <input
              type="range"
              name="distractionLevel"
              min="1"
              max="10"
              step="0.5"
              value={inputs.distractionLevel}
              onChange={handleChange}
            />
            <div className="range-labels">
              <span>Focused</span>
              <span>Squirrel!</span>
            </div>
          </div>

          <div className="fups-section">
            <label>Recent F-ups</label>

            <div className="fup-input-row">
              <input
                type="text"
                value={fupInput}
                onChange={(e) => setFupInput(e.target.value)}
                placeholder="What happened?"
                className="fup-text-input"
              />
              <div className="fup-rating">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={fupRating}
                  onChange={(e) => setFupRating(parseInt(e.target.value))}
                />
                <span>{fupRating}/10</span>
              </div>
            </div>

            <button onClick={handleFupAdd} className="fup-button">
              Add F-up
            </button>

            {inputs.recentFups.length > 0 && (
              <div className="fups-list">
                {inputs.recentFups.map((fup, index) => (
                  <div key={index} className="fup-item">
                    <div className="fup-description">
                      <span>{fup.description}</span>
                    </div>
                    <div className="fup-controls">
                      <span className="fup-severity">{fup.severity}/10</span>
                      <button
                        onClick={() => removeFup(index)}
                        className="fup-remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button onClick={calculateCookedness} className="calculate-button">
          Calculate How Cooked I Am
        </button>

        {result && (
          <div className="results-section">
            <h2>Results</h2>
            <div className="score-row">
              <span>Cooked Score:</span>
              <span className="score-value">{result.score}/10</span>
            </div>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${result.percentage}%`,
                  backgroundColor: `hsl(${Math.max(
                    0,
                    120 - result.percentage * 1.2
                  )}, 100%, 45%)`,
                }}
              ></div>
            </div>
            <div className="cook-level">
              <span
                style={{
                  color: `hsl(${Math.max(
                    0,
                    120 - result.percentage * 1.2
                  )}, 100%, 35%)`,
                }}
              >
                {result.cookLevel} ({result.percentage}%)
              </span>
            </div>
            <p className="advice">{result.advice}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
