
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

// Demonstration courses. Replace these with database records later.
const courses = [
  { id: 1, title: "AI Image Generation Masterclass", category: "Image Generation", level: "Beginner", duration: "3h 20m", price: "Set price", progress: 68, art: "art-image", symbol: "✧", label: "IMAGE CREATION", description: "Learn visual prompting, styles, composition and AI image workflows." },
  { id: 2, title: "AI Video Creation from Scratch", category: "Video Creation", level: "Beginner", duration: "4h 10m", price: "Set price", progress: 35, art: "art-video", symbol: "▶", label: "VIDEO STUDIO", description: "Plan scenes, write scripts and explore AI video generation." },
  { id: 3, title: "Prompt Engineering Essentials", category: "Prompt Engineering", level: "Beginner", duration: "2h 45m", price: "Set price", progress: 85, art: "art-prompt", symbol: "⌘", label: "MASTER PROMPTS", description: "Structure better prompts for text, images, video and business." },
  { id: 4, title: "AI Animation & Motion Design", category: "AI Animation", level: "Intermediate", duration: "5h 00m", price: "Set price", progress: 0, art: "art-animation", symbol: "✺", label: "ANIMATION", description: "Explore character animation, motion graphics and visual storytelling." },
  { id: 5, title: "Build Websites with AI", category: "AI Coding", level: "Intermediate", duration: "6h 30m", price: "Set price", progress: 0, art: "art-code", symbol: "</>", label: "AI DEVELOPMENT", description: "Learn to build and improve websites with AI-assisted coding." },
  { id: 6, title: "AI for Business & Marketing", category: "AI Automation", level: "Beginner", duration: "3h 50m", price: "Set price", progress: 0, art: "art-business", symbol: "↗", label: "BUSINESS AI", description: "Apply AI to marketing, productivity and business workflows." }
];

// Only show fictional learning statistics in this prototype.
function courseCard(course, showProgress = false) {
  return `
    <article class="course-card">
      <div class="course-art ${course.art}">
        <span class="art-symbol">${course.symbol}</span>
        <small>${course.label}</small>
      </div>
      <div class="course-body">
        <div class="course-meta">
          <span>${course.category}</span>
          <span class="level-tag">${course.level}</span>
        </div>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-footer">
          <strong>${course.price}</strong>
          <button class="outline-btn" data-course="${course.id}">
            ${showProgress && course.progress > 0 ? "Continue →" : "View course →"}
          </button>
        </div>
        ${showProgress ? `
          <div class="course-progress">
            <div><span>Learning progress</span><span>${course.progress}%</span></div>
            <div class="progress"><span style="width:${course.progress}%"></span></div>
          </div>
        ` : ""}
      </div>
    </article>
  `;
}

function renderCourses() {
  $("#dashboardCourses").innerHTML = courses.slice(0, 3)
    .map(course => courseCard(course, true)).join("");

  $("#learningCourses").innerHTML = courses
    .filter(course => course.progress > 0)
    .map(course => courseCard(course, true)).join("");

  renderAllCourses();
}

function renderAllCourses() {
  const query = ($("#courseSearch")?.value || "").toLowerCase().trim();
  const category = $("#categoryFilter")?.value || "all";

  const filtered = courses.filter(course => {
    const matchesText =
      `${course.title} ${course.description} ${course.category}`
        .toLowerCase().includes(query);

    const matchesCategory =
      category === "all" || course.category === category;

    return matchesText && matchesCategory;
  });

  $("#allCourses").innerHTML = filtered.length
    ? filtered.map(course => courseCard(course)).join("")
    : `<div class="empty-state"><h3>No matching courses</h3><p>Try another search or category.</p></div>`;
}

renderCourses();

// Navigation between dashboard sections.
function navigate(page) {
  const target = $(`#page-${page}`);
  if (!target) return;

  $$(".page").forEach(section => section.classList.remove("active"));
  target.classList.add("active");

  $$(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === page);
  });

  const activeLink = $(`.nav-link[data-page="${page}"]`);
  const titles = {
    dashboard: "Dashboard",
    learning: "My Learning",
    courses: "Explore Courses",
    paths: "Learning Paths",
    certificates: "Certificates",
    image: "AI Image Studio",
    video: "AI Video Studio",
    animation: "AI Animation",
    audio: "AI Audio & Voice",
    prompts: "Prompt Builder",
    tools: "AI Tools Directory",
    automation: "AI Automation",
    coding: "AI Coding",
    business: "AI for Business",
    profile: "Profile & Settings"
  };

  $("#breadcrumb").textContent =
    titles[page] || activeLink?.textContent.trim() || page;

  $("#sidebar").classList.remove("open");
  $("#mobileOverlay").classList.remove("show");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");

  if (pageButton) {
    event.preventDefault();
    navigate(pageButton.dataset.page);
    return;
  }

  const courseButton = event.target.closest("[data-course]");

  if (courseButton) {
    const course = courses.find(
      item => item.id === Number(courseButton.dataset.course)
    );

    if (course) {
      showToast(
        `"${course.title}" is demonstration content. Connect the course database and enrollment system to open real lessons.`
      );
    }
  }
});

// Mobile navigation.
$("#menuBtn").addEventListener("click", () => {
  $("#sidebar").classList.toggle("open");
  $("#mobileOverlay").classList.toggle(
    "show",
    $("#sidebar").classList.contains("open")
  );
});

$("#mobileOverlay").addEventListener("click", () => {
  $("#sidebar").classList.remove("open");
  $("#mobileOverlay").classList.remove("show");
});

// Light/dark theme.
$("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");
  $("#themeBtn").textContent = isLight ? "☾" : "☼";

  try {
    localStorage.setItem("theonet-theme", isLight ? "light" : "dark");
  } catch {}

  showToast(isLight ? "Light theme enabled." : "Dark theme enabled.");
});

try {
  if (localStorage.getItem("theonet-theme") === "light") {
    document.body.classList.add("light");
    $("#themeBtn").textContent = "☾";
  }
} catch {}

// Notifications.
$("#notificationBtn").addEventListener("click", () => {
  showToast("You're all caught up. Live notifications require a connected backend.");
});

// General search.
$("#searchInput").addEventListener("input", event => {
  const query = event.target.value.toLowerCase().trim();

  if (!query) return;

  const courseMatch = courses.find(course =>
    `${course.title} ${course.category} ${course.description}`
      .toLowerCase().includes(query)
  );

  if (courseMatch) {
    navigate("courses");
    $("#courseSearch").value = query;
    renderAllCourses();
    return;
  }

  const pageMatches = [
    ["image", ["image", "picture", "photo"]],
    ["video", ["video", "film"]],
    ["animation", ["animation", "animate"]],
    ["audio", ["audio", "voice", "music"]],
    ["prompts", ["prompt"]],
    ["tools", ["tool", "directory"]],
    ["automation", ["automation", "agent"]],
    ["coding", ["coding", "website", "programming"]],
    ["business", ["business", "marketing"]]
  ];

  const match = pageMatches.find(([, words]) =>
    words.some(word => query.includes(word))
  );

  if (match) navigate(match[0]);
});

$("#courseSearch").addEventListener("input", renderAllCourses);
$("#categoryFilter").addEventListener("change", renderAllCourses);

$("#learningSearch").addEventListener("input", event => {
  const query = event.target.value.toLowerCase().trim();

  const filtered = courses.filter(course =>
    course.progress > 0 &&
    `${course.title} ${course.category}`.toLowerCase().includes(query)
  );

  $("#learningCourses").innerHTML = filtered.length
    ? filtered.map(course => courseCard(course, true)).join("")
    : `<div class="empty-state"><h3>No matching courses</h3><p>Try a different search.</p></div>`;
});

// AI tools directory: examples, not endorsements or live API integrations.
const aiTools = [
  { name: "ChatGPT", category: "Text & Chat", icon: "✳", description: "AI assistant for writing, reasoning, learning and productivity.", url: "https://chatgpt.com" },
  { name: "Adobe Firefly", category: "Image Generation", icon: "✦", description: "Explore AI-assisted creative image and design workflows.", url: "https://firefly.adobe.com" },
  { name: "Midjourney", category: "Image Generation", icon: "◈", description: "Create visual concepts and artistic imagery from prompts.", url: "https://www.midjourney.com" },
  { name: "Runway", category: "Video Generation", icon: "▶", description: "Explore AI-assisted video creation and editing tools.", url: "https://runwayml.com" },
  { name: "ElevenLabs", category: "Audio", icon: "♫", description: "Explore AI voice, narration and audio tools.", url: "https://elevenlabs.io" },
  { name: "GitHub Copilot", category: "Coding", icon: "</>", description: "AI assistance for software development workflows.", url: "https://github.com/features/copilot" },
  { name: "n8n", category: "Automation", icon: "⟳", description: "Connect services and create automated workflows.", url: "https://n8n.io" },
  { name: "Google AI Studio", category: "Text & Chat", icon: "✧", description: "Experiment with supported Google AI models and APIs.", url: "https://aistudio.google.com" }
];

function renderTools() {
  const query = ($("#toolSearch").value || "").toLowerCase().trim();
  const category = $("#toolFilter").value;

  const filtered = aiTools.filter(tool =>
    `${tool.name} ${tool.description} ${tool.category}`
      .toLowerCase().includes(query) &&
    (category === "all" || tool.category === category)
  );

  $("#toolsGrid").innerHTML = filtered.length
    ? filtered.map(tool => `
      <article class="tool-card">
        <div class="tool-card-top">
          <div class="tool-logo">${tool.icon}</div>
          <div>
            <h3>${escapeHTML(tool.name)}</h3>
            <span class="tool-category">${escapeHTML(tool.category)}</span>
          </div>
        </div>
        <p>${escapeHTML(tool.description)}</p>
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer">
          Visit official website ↗
        </a>
      </article>
    `).join("")
    : `<div class="empty-state"><h3>No tools found</h3><p>Try another search.</p></div>`;
}

$("#toolSearch").addEventListener("input", renderTools);
$("#toolFilter").addEventListener("change", renderTools);
renderTools();

// Image prompt builder.
$("#generateImagePrompt").addEventListener("click", () => {
  const idea = $("#imageIdea").value.trim();

  if (!idea) {
    showToast("Describe the image you want to create first.");
    $("#imageIdea").focus();
    return;
  }

  const style = $("#imageStyle").value;
  const ratio = $("#imageRatio").value;

  const result = `Create a ${style.toLowerCase()} image of ${idea}.

Visual direction: ${style}.
Composition: clear subject, balanced framing, intentional visual hierarchy, and appropriate depth.
Lighting: deliberate lighting that complements the subject and visual style.
Quality: refined details, coherent colours, clean composition, and professional presentation.
Aspect ratio: ${ratio}.

Avoid unwanted visual clutter, distorted details, and irrelevant objects. Adapt these instructions to the capabilities of the selected image-generation model.`;

  $("#imagePromptResult").textContent = result;
  showToast("Image prompt created. No image has been generated yet.");
});

// Video concept and storyboard builder.
$("#generateVideoScript").addEventListener("click", () => {
  const idea = $("#videoIdea").value.trim();

  if (!idea) {
    showToast("Describe your video idea first.");
    $("#videoIdea").focus();
    return;
  }

  const type = $("#videoType").value;
  const duration = $("#videoLength").value;

  const result = `VIDEO PROJECT: ${idea}

FORMAT: ${type}
TARGET DURATION: ${duration}

SCENE 1 — HOOK
Open with a visually compelling moment that introduces the main idea. Use a clear opening shot and concise narration.

SCENE 2 — DEVELOPMENT
Show the central subject, problem, product, or story. Use a clear visual progression and relevant supporting shots.

SCENE 3 — KEY MESSAGE
Communicate the most important information. Keep the visuals consistent with the overall concept.

SCENE 4 — CONCLUSION
End with a memorable closing shot and a suitable call to action if appropriate.

PRODUCTION NOTES
• Define the visual style, aspect ratio and intended audience.
• Write specific prompts for each scene.
• Maintain character, subject and colour consistency.
• Specify camera movement and lighting where supported.
• Add authorised narration, music and sound effects.
• Verify the final duration during editing.

CONCEPT: ${idea}`;

  $("#videoResult").textContent = result;
  showToast("Video outline created. Connect a video provider to generate footage.");
});

// General prompt builder.
$("#buildPrompt").addEventListener("click", () => {
  const idea = $("#promptIdea").value.trim();

  if (!idea) {
    showToast("Enter your idea before building a prompt.");
    $("#promptIdea").focus();
    return;
  }

  const task = $("#promptTask").value;
  const tone = $("#promptTone").value;

  const result = `ROLE AND TASK
Act as a capable specialist in ${task.toLowerCase()}.

OBJECTIVE
${idea}

APPROACH
Use a ${tone.toLowerCase()} approach. Break down complex work into clear, logical steps where appropriate.

REQUIREMENTS
- Focus on the requested objective.
- State assumptions when important information is missing.
- Use concrete details and examples where helpful.
- Distinguish verified facts from uncertainty.
- Follow relevant safety, privacy and copyright requirements.

OUTPUT
Provide a well-organised result suitable for the intended task. Ask a clarifying question if an essential detail is missing. Do not invent facts, sources, or capabilities.`;

  $("#promptResult").textContent = result;
  showToast("Your structured prompt is ready.");
});

// Clipboard helpers.
async function copyText(text) {
  if (!text || text.startsWith("Your ")) {
    showToast("Create a prompt before copying it.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard.");
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();

    try {
      const copied = document.execCommand("copy");
      showToast(copied ? "Copied to clipboard." : "Copy failed. Select and copy the text manually.");
    } catch {
      showToast("Copy failed. Select and copy the text manually.");
    }

    area.remove();
  }
}

$("#copyPrompt").addEventListener("click", () =>
  copyText($("#promptResult").textContent)
);

$("#copyImagePrompt").addEventListener("click", () =>
  copyText($("#imagePromptResult").textContent)
);

$("#copyVideoScript").addEventListener("click", () =>
  copyText($("#videoResult").textContent)
);

// Save prompts locally in this browser only.
// Production storage should use authenticated backend records.
function savePrompt(text, label) {
  if (!text || text.startsWith("Your ")) {
    showToast("Create a prompt before saving it.");
    return;
  }

  try {
    const saved = JSON.parse(
      localStorage.getItem("theonet-saved-prompts") || "[]"
    );

    saved.unshift({
      id: Date.now(),
      label,
      text,
      savedAt: new Date().toISOString()
    });

    localStorage.setItem(
      "theonet-saved-prompts",
      JSON.stringify(saved.slice(0, 100))
    );

    showToast("Prompt saved in this browser.");
  } catch {
    showToast("Unable to save. Check your browser storage settings.");
  }
}

$("#savePrompt").addEventListener("click", () =>
  savePrompt($("#promptResult").textContent, "General prompt")
);

$("#saveImagePrompt").addEventListener("click", () =>
  savePrompt($("#imagePromptResult").textContent, "Image prompt")
);

// Escape dynamic text before inserting it into HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}
