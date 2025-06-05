document.getElementById("save-btn").addEventListener("click", () => {
  const companyName = document.getElementById("company").value;
  const matchScore = parseInt(document.getElementById("score").value);
  const accountStatus = document.getElementById("status").value;

  chrome.storage.sync.set(
    {
      companyName,
      matchScore,
      accountStatus,
    },
    () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
      });
    }
  );
});

document.getElementById("toggle-btn").addEventListener("click", () => {
  chrome.storage.sync.get(["showWidget"], (result) => {
    const newValue = !result.showWidget;
    chrome.storage.sync.set({ showWidget: newValue }, () => {
      alert("Widget " + (newValue ? "enabled" : "disabled") + ".");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
      });
    });
  });
});



