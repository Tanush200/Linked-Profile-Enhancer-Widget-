// const data = {
//   companyName: "Tanush Saha",
//   matchScore: 86,
//   accountStatus: "Target",
// };

// const widget = document.createElement("div");
// widget.style.cssText = `
//   position: fixed;
//   top: 100px;
//   right: 20px;
//   width: 300px;
//   background: white;
//   border: 1px solid #ddd;
//   border-radius: 8px;
//   box-shadow: 0 0 10px rgba(0,0,0,0.1);
//   padding: 16px;
//   z-index: 9999;
//   font-family: Arial, sans-serif;
// `;

// widget.innerHTML = `
//   <strong>${data.companyName}</strong>
//   <div style="margin-top: 10px">
//     Match Score: ${data.matchScore}%
//     <div style="background: #eee; border-radius: 5px; overflow: hidden; margin-top: 4px">
//       <div style="width: ${
//         data.matchScore
//       }%; background: #0073b1; height: 8px;"></div>
//     </div>
//   </div>
//   <div style="margin-top: 10px;">
//     Status: <span style="
//       padding: 4px 8px;
//       background: ${data.accountStatus === "Target" ? "green" : "red"};
//       color: white;
//       border-radius: 4px;
//     ">${data.accountStatus}</span>
//   </div>
// `;

// document.body.appendChild(widget);

// // Optional toggle
// chrome.storage.sync.get("showWidget", ({ showWidget }) => {
//   if (showWidget === false) widget.style.display = "none";
// });



// chrome.storage.sync.get(
//   ["showWidget", "companyName", "matchScore", "accountStatus"],
//   (result) => {
//     const showWidget = result.showWidget ?? true;
//     if (!showWidget) return;

//     const data = {
//       companyName: result.companyName || "TechCorp",
//       matchScore: result.matchScore || 86,
//       accountStatus: result.accountStatus || "Target",
//     };

//     const widget = document.createElement("div");
//     widget.style.cssText = `
//     position: fixed;
//     top: 100px;
//     right: 20px;
//     width: 300px;
//     background: white;
//     border: 1px solid #ddd;
//     border-radius: 8px;
//     box-shadow: 0 0 10px rgba(0,0,0,0.1);
//     padding: 16px;
//     z-index: 9999;
//     font-family: Arial, sans-serif;
//   `;

//     widget.innerHTML = `
//     <strong>${data.companyName}</strong>
//     <div style="margin-top: 10px">
//       Match Score: ${data.matchScore}%
//       <div style="background: #eee; border-radius: 5px; overflow: hidden; margin-top: 4px">
//         <div style="width: ${
//           data.matchScore
//         }%; background: #0073b1; height: 8px;"></div>
//       </div>
//     </div>
//     <div style="margin-top: 10px;">
//       Status: <span style="
//         padding: 4px 8px;
//         background: ${data.accountStatus === "Target" ? "green" : "red"};
//         color: white;
//         border-radius: 4px;
//       ">${data.accountStatus}</span>
//     </div>
//   `;

//     document.body.appendChild(widget);
//   }
// );




(async function () {
  // Try to find the LinkedIn profile name (usually inside an <h1>)
  const nameElement = document.querySelector("h1");
  const profileName = nameElement?.innerText.trim();

  if (!profileName) {
    console.log("Profile name not found, widget not injected.");
    return;
  }

  // Check if widget display is enabled in storage
  chrome.storage.sync.get(["showWidget"], async ({ showWidget = true }) => {
    if (!showWidget) return;

    try {
      // Fetch live data from your backend API
      const response = await fetch(
        `http://localhost:5000/api/match?name=${encodeURIComponent(
          profileName
        )}`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      // Create widget container
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

      // Fill widget HTML content
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

      // Append widget to the page body
      document.body.appendChild(widget);
    } catch (error) {
      console.error("Error fetching live data:", error);
    }
  });
})();

