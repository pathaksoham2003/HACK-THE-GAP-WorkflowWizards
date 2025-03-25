import { useState } from "react";

const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const languages = ["HTML", "JavaScript", "Java", "CSS", "Django"];

  return (
    <div className="w-screen h-screen bg-blue-100 flex">
      {/* Sidebar */}
      <div className="w-1/5 bg-blue-700 text-white p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-6">Language Selector</h2>
        <nav className="flex flex-col gap-4">
          {languages.map((lang) => (
            <button
              key={lang}
              className="hover:underline"
              onClick={() => setSelectedLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-8">
        <header className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-xl font-semibold">Select a Language</h2>
        </header>

        <section className="mt-8 text-center">
          {selectedLanguage ? (
            <h2 className="text-xl font-semibold text-blue-600">
              You selected: {selectedLanguage}
            </h2>
          ) : (
            <p className="text-gray-700">Please select a language from the sidebar.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default LanguageSelection;
