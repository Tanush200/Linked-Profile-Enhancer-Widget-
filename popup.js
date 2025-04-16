document.getElementById("toggle-btn").addEventListener("click", () => {
  chrome.storage.sync.get(["showWidget"], (result) => {
    const newValue = !result.showWidget;
    chrome.storage.sync.set({ showWidget: newValue });
  });
});
