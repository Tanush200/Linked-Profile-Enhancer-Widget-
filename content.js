// (async function () {
//   // More reliable way to find LinkedIn profile name
//   async function getProfileName() {
//     // Try multiple possible selectors for LinkedIn's profile name
//     const selectors = [
//       "h1.text-heading-xlarge", // Current LinkedIn
//       "h1.top-card-layout__title", // Alternative LinkedIn layout
//       "h1.pv-top-card--name", // Another possible variant
//       "h1", // Fallback
//     ];

//     for (const selector of selectors) {
//       const element = document.querySelector(selector);
//       if (element && element.innerText.trim()) {
//         return element.innerText.trim();
//       }
//     }

//     // If not found immediately, wait for dynamic loading
//     return new Promise((resolve) => {
//       const observer = new MutationObserver(() => {
//         for (const selector of selectors) {
//           const element = document.querySelector(selector);
//           if (element && element.innerText.trim()) {
//             observer.disconnect();
//             resolve(element.innerText.trim());
//           }
//         }
//       });

//       observer.observe(document.body, {
//         childList: true,
//         subtree: true,
//       });

//       // Timeout after 15 seconds
//       setTimeout(() => {
//         observer.disconnect();
//         resolve("Unknown Profile");
//       }, 15000);
//     });
//   }

//   try {
//     const profileName = await getProfileName();
//     console.log("Found profile name:", profileName);

//     // Check if widget should be shown
//     chrome.storage.sync.get(["showWidget"], async ({ showWidget = true }) => {
//       if (!showWidget) return;

//       try {
//         const response = await fetch(
//           `http://127.0.0.1:5000/api/match?name=${encodeURIComponent(
//             profileName
//           )}`
//         );
//         const data = await response.json();

//         // Create and show widget
//         const widget = document.createElement("div");
//         widget.id = "linkedin-helper-widget";
//         widget.style.cssText = `
//           position: fixed;
//           top: 100px;
//           right: 20px;
//           width: 300px;
//           background: white;
//           border: 1px solid #ddd;
//           border-radius: 8px;
//           box-shadow: 0 0 10px rgba(0,0,0,0.1);
//           padding: 16px;
//           z-index: 9999;
//           font-family: Arial, sans-serif;
//         `;

//         widget.innerHTML = `
//           <strong>${data.companyName}</strong>
//           <div style="margin-top: 10px">
//             Match Score: ${data.matchScore}%
//             <div style="background: #eee; border-radius: 5px; overflow: hidden; margin-top: 4px">
//               <div style="width: ${
//                 data.matchScore
//               }%; background: #0073b1; height: 8px;"></div>
//             </div>
//           </div>
//           <div style="margin-top: 10px;">
//             Status: <span style="
//               padding: 4px 8px;
//               background: ${data.accountStatus === "Target" ? "green" : "red"};
//               color: white;
//               border-radius: 4px;
//             ">${data.accountStatus}</span>
//           </div>
//         `;

//         document.body.appendChild(widget);
//       } catch (error) {
//         console.error("Error creating widget:", error);
//       }
//     });
//   } catch (error) {
//     console.error("Error finding profile name:", error);
//   }
// })();



let currentProfileId = null;
let widgetInstance = null;
let debounceTimer = null;

(async function init() {

  await handleProfileChange();

  setupObservers();
})();

async function handleProfileChange() {
  const profileId = extractProfileId();

  if (profileId === currentProfileId) return;
  currentProfileId = profileId;


  if (widgetInstance) {
    widgetInstance.remove();
    widgetInstance = null;
  }

  try {
    const profileName = await getProfileName();
    if (!profileName) return;

    const { showWidget = true } = await chrome.storage.sync.get(["showWidget"]);
    if (!showWidget) return;

    const data = await fetchProfileData(profileName);
    widgetInstance = createProfileWidget(data);
    document.body.appendChild(widgetInstance);
  } catch (error) {
    console.error("Profile change handler error:", error);
  }
}


async function getProfileName() {
  const selectors = [
    "h1.text-heading-xlarge",
    "h1.top-card-layout__title",
    "h1.pv-top-card--name",
    "h1",
  ];


  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      return element.textContent.trim();
    }
  }


  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element?.textContent?.trim()) {
          observer.disconnect();
          resolve(element.textContent.trim());
          return;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, 10000);
  });
}


function extractProfileId() {
  const match = window.location.pathname.match(/\/in\/([^\/]+)/);
  return match ? match[1] : null;
}


async function fetchProfileData(name) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/match?name=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      companyName: name,
      matchScore: 0,
      accountStatus: "Error",
      error: true,
    };
  }
}


function createProfileWidget(data) {
  const widget = document.createElement("div");
  widget.id = "linkedin-helper-widget";
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
    transition: opacity 0.3s ease;
  `;

  widget.innerHTML = `
    <strong>${data.companyName}</strong>
    ${
      data.error
        ? '<div style="color: red; font-size: 12px;">(Data load failed)</div>'
        : ""
    }
    <div style="margin-top: 10px">
      Match Score: ${data.matchScore}%
      <div style="background: #eee; border-radius: 5px; overflow: hidden; margin-top: 4px">
        <div style="width: ${data.matchScore}%; background: ${
    data.error ? "#ff4444" : "#0073b1"
  }; height: 8px;"></div>
      </div>
    </div>
    <div style="margin-top: 10px;">
      Status: <span style="
        padding: 4px 8px;
        background: ${
          data.accountStatus === "Target"
            ? "green"
            : data.error
            ? "gray"
            : "red"
        };
        color: white;
        border-radius: 4px;
      ">${data.accountStatus}</span>
    </div>
  `;

  return widget;
}


function setupObservers() {

  let lastUrl = window.location.href;
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      debouncedProfileChange();
    }
  }, 500);


  const domObserver = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.type === "childList")) {
      debouncedProfileChange();
    }
  });

  domObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });


  window.addEventListener("scroll", debouncedProfileChange);
}


function debouncedProfileChange() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    handleProfileChange();
  }, 300);
}