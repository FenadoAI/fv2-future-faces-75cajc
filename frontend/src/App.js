import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Baby, Sparkles, Camera, Loader2 } from "lucide-react";

// BACKEND URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const API = `${API_BASE}/api`;

// THIS IS WHERE OUR WEBSITE IS HOSTED, [ generate share links relative to this url ]
const MY_HOMEPAGE_URL = API_BASE?.match(/-([a-z0-9]+)\./)?.[1]
  ? `https://${API_BASE?.match(/-([a-z0-9]+)\./)?.[1]}.previewer.live`
  : window.location.origin;

console.log(`MY_HOMEPAGE_URL: ${MY_HOMEPAGE_URL}`);

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [generatedNames, setGeneratedNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isGeneratingNames, setIsGeneratingNames] = useState(false);

  const [selectedAge, setSelectedAge] = useState(5);
  const [selectedGender, setSelectedGender] = useState("child");
  const [generatedPhoto, setGeneratedPhoto] = useState("");
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false);

  const generateNames = async () => {
    if (!userInput.trim()) return;

    setIsGeneratingNames(true);
    try {
      const response = await axios.post(`${API}/generate-names`, {
        user_input: userInput,
        count: 10
      });

      if (response.data.success) {
        setGeneratedNames(response.data.names);
        setSuggestions(response.data.suggestions);
      }
    } catch (e) {
      console.error("Error generating names:", e);
    } finally {
      setIsGeneratingNames(false);
    }
  };

  const generatePhoto = async () => {
    setIsGeneratingPhoto(true);
    try {
      const response = await axios.post(`${API}/generate-photo`, {
        age: selectedAge,
        gender: selectedGender,
        style: "photorealistic portrait"
      });

      if (response.data.success) {
        setGeneratedPhoto(response.data.image_url);
      }
    } catch (e) {
      console.error("Error generating photo:", e);
    } finally {
      setIsGeneratingPhoto(false);
    }
  };

  const ageStages = [
    { age: 0, label: "Newborn" },
    { age: 2, label: "Toddler" },
    { age: 5, label: "Child" },
    { age: 10, label: "Preteen" },
    { age: 15, label: "Teen" },
    { age: 18, label: "Young Adult" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Baby className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                BabyVision
              </h1>
            </div>
            <a
              href="https://fenado.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Powered by Fenado AI
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Your Future Little One
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the perfect name and visualize your child at different ages with AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Name Generator Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">Name Generator</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your preferences
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="E.g., biblical names, nature-inspired, modern and unique..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  rows="3"
                />
              </div>

              <button
                onClick={generateNames}
                disabled={isGeneratingNames || !userInput.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isGeneratingNames ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Names...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Names
                  </>
                )}
              </button>

              {/* Generated Names */}
              {generatedNames.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Suggested Names:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {generatedNames.map((name, idx) => (
                        <div
                          key={idx}
                          className="bg-white px-4 py-2 rounded-lg text-center font-medium text-gray-800 hover:bg-purple-100 transition-colors cursor-pointer"
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Helpful Tips:</h4>
                      <ul className="space-y-1">
                        {suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Photo Generator Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-6 h-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">Photo Generator</h3>
            </div>

            <div className="space-y-6">
              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex gap-2">
                  {["boy", "girl", "child"].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setSelectedGender(gender)}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        selectedGender === gender
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Age: {selectedAge} years
                </label>
                <input
                  type="range"
                  min="0"
                  max="18"
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between mt-2">
                  {ageStages.map((stage) => (
                    <button
                      key={stage.age}
                      onClick={() => setSelectedAge(stage.age)}
                      className="text-xs text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generatePhoto}
                disabled={isGeneratingPhoto}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isGeneratingPhoto ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Photo...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Generate Photo
                  </>
                )}
              </button>

              {/* Generated Photo */}
              {generatedPhoto && (
                <div className="mt-6">
                  <div className="relative rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={generatedPhoto}
                      alt={`Child at age ${selectedAge}`}
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white font-semibold">
                        Age: {selectedAge} years
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!generatedPhoto && !isGeneratingPhoto && (
                <div className="bg-gray-100 rounded-lg p-12 text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Click "Generate Photo" to visualize your child
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            How It Works
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform helps expecting parents explore name options and visualize
            their future child at different ages. Generate creative name suggestions based on your
            preferences and see AI-generated photos that maintain consistent features across various ages.
          </p>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
