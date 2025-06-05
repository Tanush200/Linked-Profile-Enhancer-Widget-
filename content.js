const data = {
  companyName: "Tanush Saha",
  matchScore: 86,
  accountStatus: "Target",
};

const widget = document.createElement("div");
widget.style.cssText = `
  position: fixed;
  top: 100px;
  right: 20px;
  width: 300px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 16px;
  z-index: 9999;
  font-family: Arial, sans-serif;
`;

widget.innerHTML = `
  <strong>${data.companyName}</strong>
  <div style="margin-top: 10px">
    Match Score: ${data.matchScore}%
    <div style="background: #eee; border-radius: 5px; overflow: hidden; margin-top: 4px">
      <div style="width: ${
        data.matchScore
      }%; background: #0073b1; height: 8px;"></div>
    </div>
  </div>
  <div style="margin-top: 10px;">
    Status: <span style="
      padding: 4px 8px;
      background: ${data.accountStatus === "Target" ? "green" : "red"};
      color: white;
      border-radius: 4px;
    ">${data.accountStatus}</span>
  </div>
`;

document.body.appendChild(widget);

// Optional toggle
chrome.storage.sync.get("showWidget", ({ showWidget }) => {
  if (showWidget === false) widget.style.display = "none";
});
