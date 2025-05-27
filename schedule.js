// DOM ELEMENTS
const tbody = document.getElementById("scheduleBody");
const dayDateEl = document.getElementById("currentDayDate");
const timeEl = document.getElementById("currentTime");
const earlyChk = document.getElementById("earlyReleaseCheckbox");
const twoHourChk = document.getElementById("twoHourDelayCheckbox");
const statusWrap = document.getElementById("statusWrapper");
const statusSingle = document.getElementById("statusSingle");
const statusSplit = document.getElementById("statusSplit");
const progSingle = document.getElementById("progressSingle");
const titleSingle = document.getElementById("statusTitleSingle");
const detailSingle = document.getElementById("statusDetailSingle");
const progLeft = document.getElementById("progressLeft");
const titleLeft = document.getElementById("statusTitleLeft");
const detailLeft = document.getElementById("statusDetailLeft");
const progRight = document.getElementById("progressRight");
const titleRight = document.getElementById("statusTitleRight");
const detailRight = document.getElementById("statusDetailRight");

// SCHEDULE CONFIGURATION — Customize this for your school
const schedules = {
  regular: [
    ["🟦 Period 0", "07:00", "08:00", "🟦 Period 0", "07:00", "08:00"],
    ["🟦 Period 1", "08:10", "09:21", "🟦 Period 1", "08:10", "09:21"],
    ["🟦 Period 2", "09:28", "10:39", "🟦 Period 2", "09:28", "10:39"],
    ["🟩 1st Lunch", "10:46", "11:16", "🟨 Period 3a", "10:46", "11:47"],
    ["🟨 Period 3b", "11:23", "12:34", "🟩 2nd Lunch", "12:04", "12:34"],
    ["🟦 Period 4", "12:41", "13:52", "🟦 Period 4", "12:41", "13:52"],
    ["🟦 Period 5", "13:59", "15:10", "🟦 Period 5", "13:59", "15:10"],
  ],
  early: [
    ["🟦 Period 0", "07:00", "08:00", "🟦 Period 0", "07:00", "08:00"],
    ["🟦 Period 1", "08:10", "08:52", "🟦 Period 1", "08:10", "08:52"],
    ["🟦 Period 2", "08:59", "09:41", "🟦 Period 2", "08:59", "09:41"],
    ["🟦 Period 3", "09:48", "10:30", "🟦 Period 3", "09:48", "10:30"],
    ["🟦 Period 4", "10:37", "11:19", "🟦 Period 4", "10:37", "11:19"],
    ["🟦 Period 5", "11:26", "12:10", "🟦 Period 5", "11:26", "12:10"],
  ],
  twohour: [
    ["🟦 Period 1", "10:10", "10:57", "🟦 Period 1", "10:10", "10:57"],
    ["🟦 Period 2", "11:04", "11:51", "🟦 Period 2", "11:04", "11:51"],
    ["🟩 1st Lunch", "11:58", "12:28", "🟨 Period 3a", "11:58", "12:45"],
    ["🟨 Period 3b", "12:23", "13:22", "🟩 2nd Lunch", "12:51", "13:22"],
    ["🟦 Period 4", "13:29", "14:16", "🟦 Period 4", "13:29", "14:16"],
    ["🟦 Period 5", "14:23", "15:10", "🟦 Period 5", "14:23", "15:10"],
  ],
  wednesday: [
    ["🟦 Period 1", "09:10", "09:56", "🟦 Period 1", "09:10", "09:56"],
    ["🟦 Period 2", "10:03", "10:49", "🟦 Period 2", "10:03", "10:49"],
    ["🧠 Advisory", "10:56", "11:54", "🧠 Advisory", "10:56", "11:54"],
    ["🟩 1st Lunch", "12:01", "12:31", "🟨 Period 3a", "12:01", "12:47"],
    ["🟨 Period 3b", "12:38", "13:24", "🟩 2nd Lunch", "12:54", "13:24"],
    ["🟦 Period 4", "13:31", "14:17", "🟦 Period 4", "13:31", "14:17"],
    ["🟦 Period 5", "14:24", "15:10", "🟦 Period 5", "14:24", "15:10"],
  ],
};

// UTILITIES
const toMins = (t) => t.split(":").reduce((a, v, i) => a + v * (i ? 1 : 60), 0);
const fmt = (h, m) => {
  const s = h >= 12 ? "PM" : "AM",
    hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${s}`;
};
const nowMins = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

function stripIcons(str, forStatus = false) {
  const mobile = window.innerWidth < 640;
  let iconMatch = str.match(/^[^\w\s]+/);
  let icon = iconMatch ? iconMatch[0] : "";
  let label = str.replace(/^[^\w\s]+\s*/, "");
  if (mobile) {
    label = label
      .replace(/\bAdvisory\b/g, "Adv.")
      .replace(/\b1st Lunch\b/g, "L1")
      .replace(/\b2nd Lunch\b/g, "L2")
      .replace(/\bLunch\b/g, "L")
      .replace(/\bPeriod\s*([0-9a-z]+)\b/gi, "P$1");
    return forStatus ? `Period ${label.replace(/^P/, "")}` : label;
  }
  return `${icon} ${label}`;
}

function stripLabel(str) {
  return str.replace(/^[^\w]+\s*/, "");
}

function showTime() {
  const d = new Date();
  dayDateEl.textContent = d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  timeEl.textContent = fmt(d.getHours(), d.getMinutes());
}

function render(key) {
  tbody.innerHTML = "";
  schedules[key].forEach(([p1, s1, e1, p2, s2, e2]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border-chsDarkGray border-r border-t px-3 py-2 text-left">${stripIcons(
        p1
      )}</td>
      <td class="border-chsDarkGray border-r border-t px-1 py-2 text-right">${fmt(
        ...s1.split(":").map(Number)
      )}</td>
      <td class="border-chsDarkGray border-r border-t px-1 py-2 text-right">${fmt(
        ...e1.split(":").map(Number)
      )}</td>
      <td class="border-chsDarkGray border-r border-t px-3 py-2 text-left">${stripIcons(
        p2
      )}</td>
      <td class="border-chsDarkGray border-r border-t px-1 py-2 text-right">${fmt(
        ...s2.split(":").map(Number)
      )}</td>
      <td class="border-chsDarkGray border-t pr-2 py-2 text-right">${fmt(
        ...e2.split(":").map(Number)
      )}</td>`;
    tbody.appendChild(tr);
  });
}

function highlight(key) {
  const now = nowMins();
  schedules[key].forEach((row, i) => {
    const tr = tbody.rows[i];
    const [, s1, e1, , s2, e2] = row;
    const inL = now >= toMins(s1) && now <= toMins(e1);
    const inR = now >= toMins(s2) && now <= toMins(e2);
    Array.from(tr.children).forEach((td, j) => {
      const isActive = (j < 3 && inL) || (j >= 3 && inR);
      td.classList.toggle("bg-chsYellow", isActive);
      td.classList.toggle("font-bold", isActive);
    });
  });
}

function updateStatusAndProgress(key) {
  const now = nowMins();
  const sched = schedules[key];
  let shown = false;

  let leftPeriods = [],
    rightPeriods = [];
  for (let i = 0; i < sched.length; i++) {
    leftPeriods.push({
      label: sched[i][0],
      start: toMins(sched[i][1]),
      end: toMins(sched[i][2]),
    });
    rightPeriods.push({
      label: sched[i][3],
      start: toMins(sched[i][4]),
      end: toMins(sched[i][5]),
    });
  }

  const getStatus = (periods) => {
    let active = periods.find((p) => now >= p.start && now < p.end);
    let prev = null,
      next = null;
    for (let p of periods) {
      if (p.end <= now && (!prev || p.end > prev.end)) prev = p;
      if (p.start > now && (!next || p.start < next.start)) next = p;
    }
    let inPassing =
      !active && prev && next && now >= prev.end && now < next.start;
    return { active, prev, next, inPassing };
  };

  const L = getStatus(leftPeriods),
    R = getStatus(rightPeriods);

  if (
    L.active &&
    R.active &&
    L.active.label === R.active.label &&
    L.active.start === R.active.start &&
    L.active.end === R.active.end
  ) {
    statusWrap.classList.remove("hidden");
    statusSplit.classList.add("hidden");
    statusSingle.classList.remove("hidden");
    const progress =
      ((now - L.active.start) / (L.active.end - L.active.start)) * 100;
    progSingle.value = Math.max(0, Math.min(100, progress));
    titleSingle.textContent = stripIcons(L.active.label, true);
    detailSingle.textContent = `${L.active.end - now} min left`;
    return;
  }

  statusWrap.classList.remove("hidden");
  statusSingle.classList.add("hidden");
  statusSplit.classList.remove("hidden");

  // Left
  if (L.active) {
    const progress =
      ((now - L.active.start) / (L.active.end - L.active.start)) * 100;
    progLeft.value = progress;
    titleLeft.textContent = stripIcons(L.active.label, true);
    detailLeft.textContent = `${L.active.end - now} min left`;
  } else if (L.inPassing) {
    const progress = ((now - L.prev.end) / (L.next.start - L.prev.end)) * 100;
    progLeft.value = progress;
    titleLeft.textContent = `🕒 Passing to ${stripLabel(L.next.label)}`;
    detailLeft.textContent = `in ${L.next.start - now} min`;
  } else {
    progLeft.value = 0;
    titleLeft.textContent = "";
    detailLeft.textContent = "";
  }

  // Right
  if (R.active) {
    const progress =
      ((now - R.active.start) / (R.active.end - R.active.start)) * 100;
    progRight.value = progress;
    titleRight.textContent = stripIcons(R.active.label, true);
    detailRight.textContent = `${R.active.end - now} min left`;
  } else if (R.inPassing) {
    const progress = ((now - R.prev.end) / (R.next.start - R.prev.end)) * 100;
    progRight.value = progress;
    titleRight.textContent = `🕒 Passing to ${stripLabel(R.next.label)}`;
    detailRight.textContent = `in ${R.next.start - now} min`;
  } else {
    progRight.value = 0;
    titleRight.textContent = "";
    detailRight.textContent = "";
  }

  if (!L.active && !R.active && !L.inPassing && !R.inPassing) {
    statusWrap.classList.remove("hidden");
    statusSplit.classList.add("hidden");
    statusSingle.classList.remove("hidden");
    progSingle.value = 0;
    titleSingle.textContent = "";
    detailSingle.textContent = "School Closed";
  }
}

function update() {
  showTime();
  const today = new Date();
  const isWednesday = today.getDay() === 3;
  const key = twoHourChk.checked
    ? "twohour"
    : earlyChk.checked
    ? "early"
    : isWednesday
    ? "wednesday"
    : "regular";
  render(key);
  highlight(key);
  updateStatusAndProgress(key);
}

// EVENT LISTENERS
earlyChk.addEventListener("change", () => {
  if (earlyChk.checked) twoHourChk.checked = false;
  update();
});
twoHourChk.addEventListener("change", () => {
  if (twoHourChk.checked) earlyChk.checked = false;
  update();
});

window.addEventListener("resize", update);
update();
setInterval(update, 30000);
