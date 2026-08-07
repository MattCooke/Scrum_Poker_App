import React, { useState } from 'react';

interface StoryInputProps {
  story: string;
  onUpdateStory: (story: string) => void;
}

const StoryInput: React.FC<StoryInputProps> = ({ story, onUpdateStory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localStory, setLocalStory] = useState(story);

  const handleSave = () => {
    onUpdateStory(localStory);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalStory(story);
    setIsEditing(false);
  };

  React.useEffect(() => {
    setLocalStory(story);
  }, [story]);

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-brand-black dark:text-gray-300 mb-3 uppercase tracking-wide">
            Current Story
          </label>
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={localStory}
                onChange={(e) => setLocalStory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow dark:bg-gray-700 dark:text-white resize-none transition-all"
                rows={3}
                placeholder="Enter the story or task to be estimated..."
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black font-semibold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-brand-gray-500 hover:bg-brand-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="cursor-pointer group p-4 rounded-lg border-2 border-brand-gray-200 dark:border-gray-600 hover:border-brand-yellow bg-brand-gray-50 dark:bg-gray-700 hover:bg-brand-yellow/5 dark:hover:bg-brand-yellow/10 transition-all"
            >
              {story ? (
                <p className="text-lg text-brand-black dark:text-gray-200 group-hover:text-brand-yellow transition-colors">
                  {story}
                  <span className="ml-2 text-sm text-brand-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ✏️ Click to edit
                  </span>
                </p>
              ) : (
                <p className="text-lg text-brand-gray-400 dark:text-gray-500 group-hover:text-brand-yellow transition-colors font-medium">
                  Click to add a story...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryInput;
