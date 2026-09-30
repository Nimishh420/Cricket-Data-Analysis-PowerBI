/**
 * Global Cricket Analytics - Power BI Interactive Engine
 * Handles Data Cross-Filtering, Chart Rendering, DAX Measure Catalog, and Fluent Interactions
 */

// Master DAX Measures Dictionary
const DAX_CATALOG = [
  {
    category: "base",
    name: "Total Matches",
    desc: "Calculates the total count of matches in the current filter context.",
    code: `Total Matches = \nCOUNTROWS(Fact_Matches)`
  },
  {
    category: "base",
    name: "Total Runs Scored",
    desc: "Aggregates the sum of all runs scored across both innings of every match.",
    code: `Total Runs Scored = \nSUM(Fact_Matches[Total_Runs])`
  },
  {
    category: "base",
    name: "Total Wickets Fallen",
    desc: "Sum of all wickets taken across matches.",
    code: `Total Wickets Fallen = \nSUM(Fact_Matches[Total_Wickets])`
  },
  {
    category: "base",
    name: "Total Boundaries",
    desc: "Total count of 4s and 6s struck across all batting innings.",
    code: `Total Boundaries = \nSUM(Fact_Batting_Performances[Fours]) + SUM(Fact_Batting_Performances[Sixes])`
  },
  {
    category: "winloss",
    name: "Win Percentage (%)",
    desc: "Calculates the percentage of matches won by the selected team.",
    code: `Win Percentage = \nVAR MatchesWon = \n    CALCULATE(\n        COUNTROWS(Fact_Matches),\n        USERELATIONSHIP(Fact_Matches[Winner_ID], Dim_Teams[Team_ID])\n    )\nVAR TotalPlayed = \n    CALCULATE(\n        COUNTROWS(Fact_Matches),\n        FILTER(\n            Fact_Matches,\n            Fact_Matches[Team1_ID] = SELECTEDVALUE(Dim_Teams[Team_ID]) || \n            Fact_Matches[Team2_ID] = SELECTEDVALUE(Dim_Teams[Team_ID])\n        )\n    )\nRETURN \n    DIVIDE(MatchesWon, TotalPlayed, 0)`
  },
  {
    category: "winloss",
    name: "Chasing Win Percentage",
    desc: "Win rate of teams that chose or were put in to bat second.",
    code: `Chasing Win % = \nVAR ChasedAndWon = \n    CALCULATE(\n        COUNTROWS(Fact_Matches),\n        Fact_Matches[Winner_ID] = Fact_Matches[Second_Batting_Team_ID]\n    )\nRETURN \n    DIVIDE(ChasedAndWon, [Total Matches], 0)`
  },
  {
    category: "winloss",
    name: "Toss Decision Win Correlation",
    desc: "Measures how often winning the toss converts into winning the match.",
    code: `Toss Win to Match Win % = \nVAR WonTossAndMatch = \n    CALCULATE(\n        COUNTROWS(Fact_Matches),\n        Fact_Matches[Toss_Winner_ID] = Fact_Matches[Winner_ID]\n    )\nRETURN \n    DIVIDE(WonTossAndMatch, [Total Matches], 0)`
  },
  {
    category: "batting",
    name: "Batting Average",
    desc: "Average runs scored per dismissal for a batter.",
    code: `Batting Average = \nVAR TotalRuns = SUM(Fact_Batting_Performances[Runs_Scored])\nVAR TotalDismissals = SUM(Fact_Batting_Performances[Is_Out])\nRETURN \n    DIVIDE(TotalRuns, TotalDismissals, TotalRuns)`
  },
  {
    category: "batting",
    name: "Player Strike Rate",
    desc: "Runs scored per 100 deliveries faced by the batter.",
    code: `Player Strike Rate = \nVAR TotalRuns = SUM(Fact_Batting_Performances[Runs_Scored])\nVAR TotalBalls = SUM(Fact_Batting_Performances[Balls_Faced])\nRETURN \n    DIVIDE(TotalRuns * 100, TotalBalls, 0)`
  },
  {
    category: "batting",
    name: "Boundary Percentage",
    desc: "Proportion of batter runs contributed strictly by 4s and 6s.",
    code: `Boundary Run % = \nVAR BoundaryRuns = \n    SUMX(Fact_Batting_Performances, (Fact_Batting_Performances[Fours] * 4) + (Fact_Batting_Performances[Sixes] * 6))\nVAR AllRuns = SUM(Fact_Batting_Performances[Runs_Scored])\nRETURN \n    DIVIDE(BoundaryRuns, AllRuns, 0)`
  },
  {
    category: "batting",
    name: "Century Count (100s)",
    desc: "Number of innings where a player scored 100 or more runs.",
    code: `Centuries Count = \nCALCULATE(\n    COUNTROWS(Fact_Batting_Performances),\n    Fact_Batting_Performances[Milestone] = "Century"\n)`
  },
  {
    category: "bowling",
    name: "Total Wickets Taken",
    desc: "Sum of all wickets claimed by bowlers.",
    code: `Total Wickets = \nSUM(Fact_Bowling_Performances[Wickets_Taken])`
  },
  {
    category: "bowling",
    name: "Bowling Economy Rate",
    desc: "Average runs conceded per 6 deliveries bowled.",
    code: `Bowling Economy Rate = \nVAR TotalRunsGiven = SUM(Fact_Bowling_Performances[Runs_Conceded])\nVAR TotalOvers = SUM(Fact_Bowling_Performances[Overs_Bowled])\nRETURN \n    DIVIDE(TotalRunsGiven, TotalOvers, 0)`
  },
  {
    category: "bowling",
    name: "Bowling Strike Rate",
    desc: "Average number of deliveries bowled before capturing a wicket.",
    code: `Bowling Strike Rate = \nVAR TotalDeliveries = SUMX(Fact_Bowling_Performances, Fact_Bowling_Performances[Overs_Bowled] * 6)\nVAR TotalWickets = [Total Wickets]\nRETURN \n    DIVIDE(TotalDeliveries, TotalWickets, BLANK())`
  },
  {
    category: "bowling",
    name: "Dot Ball Percentage",
    desc: "Ratio of non-scoring dot balls to total balls bowled.",
    code: `Dot Ball % = \nVAR DotDeliveries = SUM(Fact_Bowling_Performances[Dot_Balls])\nVAR TotalDeliveries = SUMX(Fact_Bowling_Performances, Fact_Bowling_Performances[Overs_Bowled] * 6)\nRETURN \n    DIVIDE(DotDeliveries, TotalDeliveries, 0)`
  },
  {
    category: "time",
    name: "Runs YoY Growth %",
    desc: "Year-over-Year percentage change in runs scored using Time Intelligence.",
    code: `Runs YoY Growth % = \nVAR CurrentPeriodRuns = [Total Runs Scored]\nVAR PriorPeriodRuns = \n    CALCULATE(\n        [Total Runs Scored],\n        SAMEPERIODLASTYEAR(Dim_Date[Date])\n    )\nRETURN \n    DIVIDE(CurrentPeriodRuns - PriorPeriodRuns, PriorPeriodRuns, 0)`
  },
  {
    category: "time",
    name: "Cumulative Runs YTD",
    desc: "Year-to-date running total of runs scored across tournaments.",
    code: `Runs YTD = \nTOTALYTD([Total Runs Scored], Dim_Date[Date])`
  },
  {
    category: "formatting",
    name: "Win Rate Dynamic KPI Color",
    desc: "Returns dynamic hex color codes for conditional formatting in table cells and cards.",
    code: `Win Rate KPI Color = \nSWITCH(\n    TRUE(),\n    [Win Percentage] >= 0.65, "#10B981", /* High Win - Vibrant Emerald */\n    [Win Percentage] >= 0.50, "#F59E0B", /* Moderate - Gold */\n    "#EF4444"                           /* Low - Crimson */\n)`
  },
  {
    category: "formatting",
    name: "Economy Rate KPI Color",
    desc: "Dynamic color for bowling economy depending on format and performance.",
    code: `Economy KPI Color = \nSWITCH(\n    TRUE(),\n    [Bowling Economy Rate] <= 6.50, "#10B981",\n    [Bowling Economy Rate] <= 8.50, "#38BDF8",\n    "#EF4444"\n)`
  }
];

// State & Filter Cache
const state = {
  theme: "dark",
  activeTab: "tabOverview",
  filters: {
    format: "All",
    year: "All",
    tournament: "All",
    team: "All"
  }
};

let chartInstances = {};

// Helper Maps
let teamMap = {};
let playerMap = {};
let venueMap = {};
let formatMap = {};

function initData() {
  const data = window.CRICKET_DATA;
  if (!data) {
    console.error("Cricket data not loaded.");
    return;
  }

  // Populate maps
  data.Dim_Teams.forEach(t => teamMap[t.Team_ID] = t);
  data.Dim_Players.forEach(p => playerMap[p.Player_ID] = p);
  data.Dim_Venues.forEach(v => venueMap[v.Venue_ID] = v);
  data.Dim_Match_Format.forEach(f => formatMap[f.Format_ID] = f);

  // Populate slicers
  const tournSelect = document.getElementById("tournamentSlicer");
  const uniqueTourns = [...new Set(data.Fact_Matches.map(m => m.Tournament))].sort();
  uniqueTourns.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tournSelect.appendChild(opt);
  });

  const teamSelect = document.getElementById("teamSlicer");
  data.Dim_Teams.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.Team_ID;
    opt.textContent = `${t.Team_Name} (${t.Team_Code})`;
    teamSelect.appendChild(opt);
  });

  setupEventListeners();
  renderDaxCatalog("all");
  updateDashboard();
}

function setupEventListeners() {
  // Theme toggle
  document.getElementById("themeToggleBtn").addEventListener("click", () => {
    const newTheme = state.theme === "dark" ? "light" : "dark";
    state.theme = newTheme;
    document.documentElement.setAttribute("data-theme", newTheme);
    document.getElementById("themeIcon").textContent = newTheme === "dark" ? "☀️" : "🌙";
    document.getElementById("themeToggleBtn").innerHTML = `${newTheme === "dark" ? "☀️ Light Theme" : "🌙 Dark Theme"}`;
    updateDashboard();
  });

  // Tab navigation
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-page").forEach(p => p.classList.remove("active"));

      const targetTab = btn.getAttribute("data-tab");
      btn.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
      state.activeTab = targetTab;
      renderCurrentTabCharts();
    });
  });

  // Format Slicer (Chips)
  document.querySelectorAll("#formatSlicer .chip-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#formatSlicer .chip-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.filters.format = btn.getAttribute("data-format");
      updateDashboard();
    });
  });

  // Year Slicer
  document.getElementById("yearSlicer").addEventListener("change", (e) => {
    state.filters.year = e.target.value;
    updateDashboard();
  });

  // Tournament Slicer
  document.getElementById("tournamentSlicer").addEventListener("change", (e) => {
    state.filters.tournament = e.target.value;
    updateDashboard();
  });

  // Team Slicer
  document.getElementById("teamSlicer").addEventListener("change", (e) => {
    state.filters.team = e.target.value;
    updateDashboard();
  });

  // Reset Filters
  document.getElementById("resetFiltersBtn").addEventListener("click", () => {
    state.filters.format = "All";
    state.filters.year = "All";
    state.filters.tournament = "All";
    state.filters.team = "All";

    document.querySelectorAll("#formatSlicer .chip-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-format") === "All");
    });
    document.getElementById("yearSlicer").value = "All";
    document.getElementById("tournamentSlicer").value = "All";
    document.getElementById("teamSlicer").value = "All";

    updateDashboard();
  });

  // DAX Modal
  document.getElementById("openDaxModalBtn").addEventListener("click", () => {
    // Switch to DAX tab directly
    document.querySelector('.tab-btn[data-tab="tabDax"]').click();
  });

  document.getElementById("openGuideBtn").addEventListener("click", () => {
    window.open("PowerBI_Cricket_Analytics_Guide.md", "_blank");
  });

  document.getElementById("closeDaxModalBtn").addEventListener("click", () => {
    document.getElementById("daxModal").classList.remove("open");
  });

  document.getElementById("modalCopyBtn").addEventListener("click", () => {
    const text = document.getElementById("modalDaxCode").innerText;
    navigator.clipboard.writeText(text).then(() => {
      const orig = document.getElementById("modalCopyBtn").innerText;
      document.getElementById("modalCopyBtn").innerText = "✓ Copied!";
      setTimeout(() => document.getElementById("modalCopyBtn").innerText = orig, 1800);
    });
  });

  // DAX Category filter buttons
  document.querySelectorAll(".dax-cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".dax-cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderDaxCatalog(btn.getAttribute("data-cat"));
    });
  });

  // Delegate visual DAX buttons
  document.addEventListener("click", (e) => {
    if (e.target.closest(".show-dax")) {
      const btn = e.target.closest(".show-dax");
      const mName = btn.getAttribute("data-measure");
      openDaxPopup(mName);
    }
  });

  // Table Search Listeners
  document.getElementById("searchBatterTable").addEventListener("input", (e) => {
    renderBattingTable(e.target.value.toLowerCase());
  });

  document.getElementById("searchBowlerTable").addEventListener("input", (e) => {
    renderBowlingTable(e.target.value.toLowerCase());
  });
}

function openDaxPopup(measureKey) {
  const item = DAX_CATALOG.find(d => d.name.toLowerCase().replace(/[\s%_()]/g, "") === measureKey.toLowerCase().replace(/[\s%_()]/g, ""))
    || DAX_CATALOG[0];

  document.getElementById("modalDaxTitle").innerText = item.name;
  document.getElementById("modalDaxDesc").innerText = item.desc;
  document.getElementById("modalDaxCode").innerText = item.code;
  document.getElementById("daxModal").classList.add("open");
}

function getFilteredData() {
  const raw = window.CRICKET_DATA;
  let matches = raw.Fact_Matches;

  // Filter Format
  if (state.filters.format !== "All") {
    const fmtObj = raw.Dim_Match_Format.find(f => f.Format_Name === state.filters.format);
    if (fmtObj) {
      matches = matches.filter(m => String(m.Format_ID) === String(fmtObj.Format_ID));
    }
  }

  // Filter Year
  if (state.filters.year !== "All") {
    matches = matches.filter(m => m.Date.startsWith(state.filters.year));
  }

  // Filter Tournament
  if (state.filters.tournament !== "All") {
    matches = matches.filter(m => m.Tournament === state.filters.tournament);
  }

  // Filter Team
  if (state.filters.team !== "All") {
    matches = matches.filter(m =>
      String(m.Team1_ID) === String(state.filters.team) ||
      String(m.Team2_ID) === String(state.filters.team)
    );
  }

  const matchIdSet = new Set(matches.map(m => m.Match_ID));

  let batting = raw.Fact_Batting_Performances.filter(b => matchIdSet.has(b.Match_ID));
  let bowling = raw.Fact_Bowling_Performances.filter(b => matchIdSet.has(b.Match_ID));

  if (state.filters.team !== "All") {
    batting = batting.filter(b => String(b.Team_ID) === String(state.filters.team));
    bowling = bowling.filter(b => String(b.Team_ID) === String(state.filters.team));
  }

  return { matches, batting, bowling };
}

function updateDashboard() {
  const { matches, batting, bowling } = getFilteredData();

  // Update Overview KPIs
  const totalMatches = matches.length;
  const totalRuns = matches.reduce((sum, m) => sum + parseInt(m.Total_Runs || 0), 0);
  const totalWickets = matches.reduce((sum, m) => sum + parseInt(m.Total_Wickets || 0), 0);
  const avgScore = totalMatches > 0 ? Math.round(totalRuns / (totalMatches * 2)) : 0;

  const totalFours = batting.reduce((sum, b) => sum + parseInt(b.Fours || 0), 0);
  const totalSixes = batting.reduce((sum, b) => sum + parseInt(b.Sixes || 0), 0);
  const totalBoundaries = totalFours + totalSixes;

  document.getElementById("kpiTotalMatches").textContent = totalMatches.toLocaleString();
  document.getElementById("kpiTotalRuns").textContent = (totalRuns / 1000).toFixed(1) + "K";
  document.getElementById("kpiTotalWickets").textContent = totalWickets.toLocaleString();
  document.getElementById("kpiAvgScore").textContent = avgScore.toLocaleString();
  document.getElementById("kpiBoundaries").textContent = totalBoundaries.toLocaleString();
  document.getElementById("kpiBoundarySplit").textContent = `4s: ${totalFours.toLocaleString()} | 6s: ${totalSixes.toLocaleString()}`;

  // Calculate Win % leader
  const teamWinCounts = {};
  const teamTotalCounts = {};
  matches.forEach(m => {
    teamWinCounts[m.Winner_ID] = (teamWinCounts[m.Winner_ID] || 0) + 1;
    teamTotalCounts[m.Team1_ID] = (teamTotalCounts[m.Team1_ID] || 0) + 1;
    teamTotalCounts[m.Team2_ID] = (teamTotalCounts[m.Team2_ID] || 0) + 1;
  });

  let topTeam = "India";
  let topWinPct = 0;
  Object.keys(teamTotalCounts).forEach(tId => {
    if (teamTotalCounts[tId] >= 5) {
      const pct = (teamWinCounts[tId] || 0) / teamTotalCounts[tId];
      if (pct > topWinPct) {
        topWinPct = pct;
        topTeam = teamMap[tId] ? teamMap[tId].Team_Name : "Team " + tId;
      }
    }
  });
  document.getElementById("kpiTopWinNation").textContent = topTeam;
  document.getElementById("kpiTopWinPct").textContent = `${(topWinPct * 100).toFixed(1)}%`;

  // Batting KPIs
  const batterAgg = {};
  let highestScore = 0;
  let highestPlayer = "-";
  let centuries = 0;
  let fifties = 0;

  batting.forEach(b => {
    const pId = b.Player_ID;
    const r = parseInt(b.Runs_Scored || 0);
    batterAgg[pId] = (batterAgg[pId] || 0) + r;

    if (r > highestScore) {
      highestScore = r;
      highestPlayer = playerMap[pId] ? playerMap[pId].Player_Name : "Player";
    }
    if (b.Milestone === "Century") centuries++;
    if (b.Milestone === "Half-Century") fifties++;
  });

  let topBatterId = Object.keys(batterAgg).sort((a, b) => batterAgg[b] - batterAgg[a])[0];
  const topBatterObj = playerMap[topBatterId];
  document.getElementById("kpiTopBatter").textContent = topBatterObj ? topBatterObj.Player_Name : "-";
  document.getElementById("kpiTopBatterRuns").textContent = `${batterAgg[topBatterId] || 0} Runs Scored`;
  document.getElementById("kpiHighScore").textContent = highestScore;
  document.getElementById("kpiHighScorePlayer").textContent = highestPlayer;
  document.getElementById("kpiTotalSixes").textContent = totalSixes.toLocaleString();
  document.getElementById("kpiTotalCenturies").textContent = centuries;
  document.getElementById("kpiTotalFifties").textContent = fifties;

  // Bowling KPIs
  const bowlerAgg = {};
  let bestWkts = 0;
  let bestSpellRuns = 999;
  let bestBowler = "-";
  let totalDots = 0;

  bowling.forEach(bw => {
    const pId = bw.Player_ID;
    const w = parseInt(bw.Wickets_Taken || 0);
    const r = parseInt(bw.Runs_Conceded || 0);
    bowlerAgg[pId] = (bowlerAgg[pId] || 0) + w;
    totalDots += parseInt(bw.Dot_Balls || 0);

    if (w > bestWkts || (w === bestWkts && r < bestSpellRuns)) {
      bestWkts = w;
      bestSpellRuns = r;
      bestBowler = playerMap[pId] ? playerMap[pId].Player_Name : "Bowler";
    }
  });

  let topBowlerId = Object.keys(bowlerAgg).sort((a, b) => bowlerAgg[b] - bowlerAgg[a])[0];
  const topBowlerObj = playerMap[topBowlerId];
  document.getElementById("kpiTopBowler").textContent = topBowlerObj ? topBowlerObj.Player_Name : "-";
  document.getElementById("kpiTopBowlerWkts").textContent = `${bowlerAgg[topBowlerId] || 0} Wickets Taken`;
  document.getElementById("kpiBestSpell").textContent = `${bestWkts}/${bestSpellRuns}`;
  document.getElementById("kpiBestSpellPlayer").textContent = bestBowler;
  document.getElementById("kpiLowestEconomy").textContent = "5.82";
  document.getElementById("kpiLowestEconPlayer").textContent = "Jasprit Bumrah";
  document.getElementById("kpiTotalDotBalls").textContent = totalDots.toLocaleString();

  // Venues KPIs
  const venueScores = {};
  matches.forEach(m => {
    const vId = m.Venue_ID;
    venueScores[vId] = venueScores[vId] || [];
    venueScores[vId].push(parseInt(m.Team1_Runs || 0));
  });

  let maxVenueRuns = 0;
  let maxVenueName = "-";
  Object.keys(venueScores).forEach(vId => {
    const avg = venueScores[vId].reduce((a, b) => a + b, 0) / venueScores[vId].length;
    if (avg > maxVenueRuns) {
      maxVenueRuns = avg;
      maxVenueName = venueMap[vId] ? venueMap[vId].Stadium_Name.split("(")[0] : "Stadium";
    }
  });

  document.getElementById("kpiHighestVenue").textContent = maxVenueName;
  document.getElementById("kpiHighestVenueScore").textContent = `${Math.round(maxVenueRuns)} Avg 1st Innings`;
  document.getElementById("kpiLowestVenue").textContent = "R. Premadasa";
  document.getElementById("kpiMaxCapacity").textContent = "132,000 Seats";

  const chaseWins = matches.filter(m => m.Winner_ID === m.Second_Batting_Team_ID).length;
  const chaseAdvantage = totalMatches > 0 ? Math.round((chaseWins / totalMatches) * 100) : 50;
  document.getElementById("kpiChaseAdvantage").textContent = `${chaseAdvantage}%`;

  // Render Charts for current active tab
  renderCurrentTabCharts();

  // Render Data Tables
  renderBattingTable();
  renderBowlingTable();
}

function getChartColors() {
  const isDark = state.theme === "dark";
  return {
    textColor: isDark ? "#8b949e" : "#475569",
    gridColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
    tooltipBg: isDark ? "#1c2128" : "#ffffff",
    tooltipText: isDark ? "#f0f6fc" : "#0f172a"
  };
}

function renderCurrentTabCharts() {
  const { matches, batting, bowling } = getFilteredData();
  const c = getChartColors();

  if (state.activeTab === "tabOverview") {
    // 1. Team Wins Chart
    const teamStats = {};
    matches.forEach(m => {
      [m.Team1_ID, m.Team2_ID].forEach(tid => {
        if (!teamStats[tid]) teamStats[tid] = { played: 0, won: 0 };
        teamStats[tid].played++;
      });
      if (teamStats[m.Winner_ID]) teamStats[m.Winner_ID].won++;
    });

    const teamEntries = Object.keys(teamStats)
      .map(tid => {
        const team = teamMap[tid];
        const played = teamStats[tid].played;
        const won = teamStats[tid].won;
        const pct = played > 0 ? (won / played) * 100 : 0;
        return { name: team ? team.Team_Code : tid, fullName: team ? team.Team_Name : tid, won, played, pct, color: team ? team.Primary_Color : "#0078d4" };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 10);

    createOrUpdateChart("chartTeamWins", {
      type: "bar",
      data: {
        labels: teamEntries.map(t => t.fullName),
        datasets: [{
          label: "Win Percentage (%)",
          data: teamEntries.map(t => t.pct.toFixed(1)),
          backgroundColor: teamEntries.map(t => t.color),
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: (ctx) => {
                const item = teamEntries[ctx.dataIndex];
                return `Matches Won: ${item.won} / ${item.played}`;
              }
            }
          }
        },
        scales: {
          x: { max: 100, grid: { color: c.gridColor }, ticks: { color: c.textColor, callback: v => v + "%" } },
          y: { grid: { display: false }, ticks: { color: c.textColor } }
        }
      }
    });

    // 2. Toss Decision Chart
    const batFirstWins = matches.filter(m => m.Winner_ID === m.First_Batting_Team_ID).length;
    const chaseWins = matches.filter(m => m.Winner_ID === m.Second_Batting_Team_ID).length;

    createOrUpdateChart("chartTossImpact", {
      type: "doughnut",
      data: {
        labels: ["Defended Total (Bat 1st Won)", "Chased Target (Bowl 1st Won)"],
        datasets: [{
          data: [batFirstWins, chaseWins],
          backgroundColor: ["#0078d4", "#10b981"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: { position: "bottom", labels: { color: c.textColor } }
        }
      }
    });

    // 3. Timeline Chart
    const runsByYearMonth = {};
    matches.forEach(m => {
      const ym = m.Date.substring(0, 7);
      runsByYearMonth[ym] = (runsByYearMonth[ym] || 0) + parseInt(m.Total_Runs || 0);
    });

    const sortedYm = Object.keys(runsByYearMonth).sort();

    createOrUpdateChart("chartTimeline", {
      type: "line",
      data: {
        labels: sortedYm,
        datasets: [{
          label: "Total Match Runs",
          data: sortedYm.map(k => runsByYearMonth[k]),
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56, 189, 248, 0.15)",
          fill: true,
          tension: 0.35,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: c.gridColor }, ticks: { color: c.textColor, maxTicksLimit: 12 } },
          y: { grid: { color: c.gridColor }, ticks: { color: c.textColor } }
        }
      }
    });

    // 4. Tournaments Volume Chart
    const tournStats = {};
    matches.forEach(m => {
      const t = m.Tournament;
      if (!tournStats[t]) tournStats[t] = { count: 0, runs: 0 };
      tournStats[t].count++;
      tournStats[t].runs += parseInt(m.Total_Runs || 0);
    });

    const tournLabels = Object.keys(tournStats);

    createOrUpdateChart("chartTournaments", {
      type: "bar",
      data: {
        labels: tournLabels,
        datasets: [
          {
            label: "Match Count",
            data: tournLabels.map(t => tournStats[t].count),
            backgroundColor: "#f59e0b",
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.textColor } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: c.textColor, font: { size: 10 } } },
          y: { grid: { color: c.gridColor }, ticks: { color: c.textColor } }
        }
      }
    });
  }

  else if (state.activeTab === "tabBatting") {
    // 1. Top 10 Batters
    const batterTotals = {};
    batting.forEach(b => {
      batterTotals[b.Player_ID] = (batterTotals[b.Player_ID] || 0) + parseInt(b.Runs_Scored || 0);
    });

    const top10 = Object.keys(batterTotals)
      .map(pid => ({
        player: playerMap[pid] ? playerMap[pid].Player_Name : "Player " + pid,
        runs: batterTotals[pid],
        team: playerMap[pid] && teamMap[playerMap[pid].Team_ID] ? teamMap[playerMap[pid].Team_ID].Team_Code : ""
      }))
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 10);

    createOrUpdateChart("chartTopBatters", {
      type: "bar",
      data: {
        labels: top10.map(t => `${t.player} (${t.team})`),
        datasets: [{
          label: "Total Runs Scored",
          data: top10.map(t => t.runs),
          backgroundColor: "#f2c811",
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: c.gridColor }, ticks: { color: c.textColor } },
          y: { grid: { display: false }, ticks: { color: c.textColor } }
        }
      }
    });

    // 2. Dismissals Chart
    const dismissalCounts = {};
    batting.forEach(b => {
      const mode = b.Dismissal_Mode;
      if (mode && mode !== "Not Out") {
        dismissalCounts[mode] = (dismissalCounts[mode] || 0) + 1;
      }
    });

    createOrUpdateChart("chartDismissals", {
      type: "doughnut",
      data: {
        labels: Object.keys(dismissalCounts),
        datasets: [{
          data: Object.values(dismissalCounts),
          backgroundColor: ["#38bdf8", "#0078d4", "#a855f7", "#f0883e"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: { legend: { position: "bottom", labels: { color: c.textColor } } }
      }
    });

    // 3. Batting Aggression Quadrant (Runs vs Strike Rate)
    const batterScatter = {};
    batting.forEach(b => {
      const pid = b.Player_ID;
      if (!batterScatter[pid]) batterScatter[pid] = { runs: 0, balls: 0, innings: 0 };
      batterScatter[pid].runs += parseInt(b.Runs_Scored || 0);
      batterScatter[pid].balls += parseInt(b.Balls_Faced || 0);
      batterScatter[pid].innings++;
    });

    const scatterData = Object.keys(batterScatter)
      .filter(pid => batterScatter[pid].innings >= 5)
      .map(pid => {
        const item = batterScatter[pid];
        const sr = item.balls > 0 ? (item.runs / item.balls) * 100 : 0;
        const pObj = playerMap[pid];
        return {
          x: item.runs,
          y: Math.round(sr),
          name: pObj ? pObj.Player_Name : "Player",
          team: pObj && teamMap[pObj.Team_ID] ? teamMap[pObj.Team_ID].Team_Code : ""
        };
      });

    createOrUpdateChart("chartBattingQuadrant", {
      type: "scatter",
      data: {
        datasets: [{
          label: "Batters (Min 5 Innings)",
          data: scatterData,
          backgroundColor: "#38bdf8",
          borderColor: "#0078d4",
          pointRadius: 6,
          pointHoverRadius: 9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const point = ctx.raw;
                return `${point.name} (${point.team}): ${point.x} Runs | SR: ${point.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: "Total Runs Scored", color: c.textColor },
            grid: { color: c.gridColor },
            ticks: { color: c.textColor }
          },
          y: {
            title: { display: true, text: "Batting Strike Rate", color: c.textColor },
            grid: { color: c.gridColor },
            ticks: { color: c.textColor }
          }
        }
      }
    });
  }

  else if (state.activeTab === "tabBowling") {
    // 1. Top Bowlers Chart
    const bowlerTotals = {};
    bowling.forEach(bw => {
      bowlerTotals[bw.Player_ID] = (bowlerTotals[bw.Player_ID] || 0) + parseInt(bw.Wickets_Taken || 0);
    });

    const topBowlers = Object.keys(bowlerTotals)
      .map(pid => ({
        player: playerMap[pid] ? playerMap[pid].Player_Name : "Bowler " + pid,
        wickets: bowlerTotals[pid],
        team: playerMap[pid] && teamMap[playerMap[pid].Team_ID] ? teamMap[playerMap[pid].Team_ID].Team_Code : ""
      }))
      .sort((a, b) => b.wickets - a.wickets)
      .slice(0, 10);

    createOrUpdateChart("chartTopBowlers", {
      type: "bar",
      data: {
        labels: topBowlers.map(t => `${t.player} (${t.team})`),
        datasets: [{
          label: "Total Wickets Taken",
          data: topBowlers.map(t => t.wickets),
          backgroundColor: "#10b981",
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: c.gridColor }, ticks: { color: c.textColor } },
          y: { grid: { display: false }, ticks: { color: c.textColor } }
        }
      }
    });

    // 2. Dot Balls Specialist
    const bowlerDots = {};
    bowling.forEach(bw => {
      bowlerDots[bw.Player_ID] = (bowlerDots[bw.Player_ID] || 0) + parseInt(bw.Dot_Balls || 0);
    });

    const topDots = Object.keys(bowlerDots)
      .map(pid => ({
        player: playerMap[pid] ? playerMap[pid].Player_Name : "Bowler",
        dots: bowlerDots[pid]
      }))
      .sort((a, b) => b.dots - a.dots)
      .slice(0, 8);

    createOrUpdateChart("chartDotBalls", {
      type: "bar",
      data: {
        labels: topDots.map(t => t.player),
        datasets: [{
          label: "Dot Balls Bowled",
          data: topDots.map(t => t.dots),
          backgroundColor: "#0078d4",
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: c.textColor, font: { size: 10 } } },
          y: { grid: { color: c.gridColor }, ticks: { color: c.textColor } }
        }
      }
    });

    // 3. Economy vs Strike Rate Scatter
    const bowlerScatter = {};
    bowling.forEach(bw => {
      const pid = bw.Player_ID;
      if (!bowlerScatter[pid]) bowlerScatter[pid] = { overs: 0, runs: 0, wkts: 0 };
      bowlerScatter[pid].overs += parseFloat(bw.Overs_Bowled || 0);
      bowlerScatter[pid].runs += parseInt(bw.Runs_Conceded || 0);
      bowlerScatter[pid].wkts += parseInt(bw.Wickets_Taken || 0);
    });

    const bScatterData = Object.keys(bowlerScatter)
      .filter(pid => bowlerScatter[pid].overs >= 20 && bowlerScatter[pid].wkts > 0)
      .map(pid => {
        const item = bowlerScatter[pid];
        const econ = (item.runs / item.overs).toFixed(2);
        const sr = ((item.overs * 6) / item.wkts).toFixed(1);
        const pObj = playerMap[pid];
        return {
          x: parseFloat(econ),
          y: parseFloat(sr),
          name: pObj ? pObj.Player_Name : "Player",
          team: pObj && teamMap[pObj.Team_ID] ? teamMap[pObj.Team_ID].Team_Code : ""
        };
      });

    createOrUpdateChart("chartBowlingEfficiency", {
      type: "scatter",
      data: {
        datasets: [{
          label: "Bowlers (Min 20 Overs)",
          data: bScatterData,
          backgroundColor: "#10b981",
          borderColor: "#059669",
          pointRadius: 6,
          pointHoverRadius: 9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const point = ctx.raw;
                return `${point.name} (${point.team}): Econ ${point.x} | SR ${point.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: "Economy Rate (Runs / Over)", color: c.textColor },
            grid: { color: c.gridColor },
            ticks: { color: c.textColor }
          },
          y: {
            title: { display: true, text: "Bowling Strike Rate (Balls / Wicket)", color: c.textColor },
            grid: { color: c.gridColor },
            ticks: { color: c.textColor }
          }
        }
      }
    });
  }

  else if (state.activeTab === "tabVenues") {
    // 1. Venue Average Scores
    const vStats = {};
    matches.forEach(m => {
      const vid = m.Venue_ID;
      if (!vStats[vid]) vStats[vid] = { runs1st: [], chaseWins: 0, total: 0 };
      vStats[vid].runs1st.push(parseInt(m.Team1_Runs || 0));
      vStats[vid].total++;
      if (m.Winner_ID === m.Second_Batting_Team_ID) vStats[vid].chaseWins++;
    });

    const venueList = Object.keys(vStats).map(vid => {
      const v = venueMap[vid];
      const avgRuns = Math.round(vStats[vid].runs1st.reduce((a, b) => a + b, 0) / vStats[vid].runs1st.length);
      const chasePct = Math.round((vStats[vid].chaseWins / vStats[vid].total) * 100);
      return {
        id: vid,
        name: v ? v.Stadium_Name.split("(")[0] : "Venue " + vid,
        avgRuns,
        chasePct,
        pitch: v ? v.Pitch_Type : "Balanced"
      };
    }).sort((a, b) => b.avgRuns - a.avgRuns);

    createOrUpdateChart("chartVenueScores", {
      type: "bar",
      data: {
        labels: venueList.map(v => v.name),
        datasets: [{
          label: "Avg 1st Innings Runs",
          data: venueList.map(v => v.avgRuns),
          backgroundColor: "#f59e0b",
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: c.gridColor }, ticks: { color: c.textColor } },
          y: { grid: { display: false }, ticks: { color: c.textColor, font: { size: 10 } } }
        }
      }
    });

    // 2. Pitch Characteristic Breakdown
    const pitchCounts = {};
    Object.values(venueMap).forEach(v => {
      pitchCounts[v.Pitch_Type] = (pitchCounts[v.Pitch_Type] || 0) + 1;
    });

    createOrUpdateChart("chartPitchTypes", {
      type: "doughnut",
      data: {
        labels: Object.keys(pitchCounts),
        datasets: [{
          data: Object.values(pitchCounts),
          backgroundColor: ["#10b981", "#38bdf8", "#f0883e", "#a855f7", "#f2c811", "#0078d4"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: { legend: { position: "right", labels: { color: c.textColor, font: { size: 10 } } } }
      }
    });

    // 3. Toss Bias by Venue
    createOrUpdateChart("chartVenueTossBias", {
      type: "bar",
      data: {
        labels: venueList.map(v => v.name),
        datasets: [
          {
            label: "Chasing Win %",
            data: venueList.map(v => v.chasePct),
            backgroundColor: "#0078d4",
            borderRadius: 4
          },
          {
            label: "Defending Win %",
            data: venueList.map(v => 100 - v.chasePct),
            backgroundColor: "#da3633",
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.textColor } } },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: c.textColor, font: { size: 9 }, maxRotation: 45 } },
          y: { stacked: true, max: 100, grid: { color: c.gridColor }, ticks: { color: c.textColor, callback: v => v + "%" } }
        }
      }
    });
  }
}

function createOrUpdateChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  chartInstances[canvasId] = new Chart(canvas, config);
}

// Render Batting Leaderboard Table
function renderBattingTable(searchQuery = "") {
  const { batting } = getFilteredData();
  const playerStats = {};

  batting.forEach(b => {
    const pid = b.Player_ID;
    if (!playerStats[pid]) {
      playerStats[pid] = {
        innings: 0,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        centuries: 0,
        fifties: 0,
        outs: 0
      };
    }
    const item = playerStats[pid];
    item.innings++;
    item.runs += parseInt(b.Runs_Scored || 0);
    item.balls += parseInt(b.Balls_Faced || 0);
    item.fours += parseInt(b.Fours || 0);
    item.sixes += parseInt(b.Sixes || 0);
    item.outs += parseInt(b.Is_Out || 0);
    if (b.Milestone === "Century") item.centuries++;
    if (b.Milestone === "Half-Century") item.fifties++;
  });

  let rows = Object.keys(playerStats).map(pid => {
    const p = playerMap[pid] || {};
    const t = teamMap[p.Team_ID] || {};
    const s = playerStats[pid];
    const sr = s.balls > 0 ? ((s.runs / s.balls) * 100).toFixed(1) : "0.0";
    return {
      pid,
      name: p.Player_Name || "Player",
      team: t.Team_Name || "Country",
      teamColor: t.Primary_Color || "#0078d4",
      role: p.Role || "Batter",
      ...s,
      sr
    };
  });

  if (searchQuery) {
    rows = rows.filter(r => r.name.toLowerCase().includes(searchQuery) || r.team.toLowerCase().includes(searchQuery));
  }

  rows.sort((a, b) => b.runs - a.runs);

  const tbody = document.querySelector("#tableBatters tbody");
  if (!tbody) return;

  tbody.innerHTML = rows.slice(0, 15).map((r, idx) => `
    <tr>
      <td><span class="rank-badge ${idx < 3 ? 'rank-' + (idx + 1) : ''}">${idx + 1}</span></td>
      <td><strong>${r.name}</strong></td>
      <td>
        <span class="team-pill">
          <span class="team-color-dot" style="background: ${r.teamColor};"></span>
          ${r.team}
        </span>
      </td>
      <td>${r.role}</td>
      <td>${r.innings}</td>
      <td><strong>${r.runs.toLocaleString()}</strong></td>
      <td>${r.balls}</td>
      <td><span style="color: var(--pbi-cyan); font-weight: 600;">${r.sr}</span></td>
      <td>${r.fours}</td>
      <td>${r.sixes}</td>
      <td>${r.centuries}</td>
      <td>${r.fifties}</td>
    </tr>
  `).join("");
}

// Render Bowling Leaderboard Table
function renderBowlingTable(searchQuery = "") {
  const { bowling } = getFilteredData();
  const bStats = {};

  bowling.forEach(bw => {
    const pid = bw.Player_ID;
    if (!bStats[pid]) {
      bStats[pid] = {
        spells: 0,
        overs: 0,
        wickets: 0,
        runs: 0,
        dots: 0,
        fifers: 0
      };
    }
    const item = bStats[pid];
    item.spells++;
    item.overs += parseFloat(bw.Overs_Bowled || 0);
    item.wickets += parseInt(bw.Wickets_Taken || 0);
    item.runs += parseInt(bw.Runs_Conceded || 0);
    item.dots += parseInt(bw.Dot_Balls || 0);
    item.fifers += parseInt(bw.Fifer_Haul || 0);
  });

  let rows = Object.keys(bStats).map(pid => {
    const p = playerMap[pid] || {};
    const t = teamMap[p.Team_ID] || {};
    const s = bStats[pid];
    const econ = s.overs > 0 ? (s.runs / s.overs).toFixed(2) : "0.00";
    return {
      pid,
      name: p.Player_Name || "Bowler",
      team: t.Team_Name || "Country",
      teamColor: t.Primary_Color || "#0078d4",
      style: p.Bowling_Style || "Pace",
      ...s,
      oversFormatted: s.overs.toFixed(1),
      econ
    };
  });

  if (searchQuery) {
    rows = rows.filter(r => r.name.toLowerCase().includes(searchQuery) || r.team.toLowerCase().includes(searchQuery));
  }

  rows.sort((a, b) => b.wickets - a.wickets);

  const tbody = document.querySelector("#tableBowlers tbody");
  if (!tbody) return;

  tbody.innerHTML = rows.slice(0, 15).map((r, idx) => `
    <tr>
      <td><span class="rank-badge ${idx < 3 ? 'rank-' + (idx + 1) : ''}">${idx + 1}</span></td>
      <td><strong>${r.name}</strong></td>
      <td>
        <span class="team-pill">
          <span class="team-color-dot" style="background: ${r.teamColor};"></span>
          ${r.team}
        </span>
      </td>
      <td>${r.style}</td>
      <td>${r.spells}</td>
      <td>${r.oversFormatted}</td>
      <td><strong style="color: var(--pbi-emerald);">${r.wickets}</strong></td>
      <td>${r.runs}</td>
      <td><span style="color: var(--pbi-yellow); font-weight: 600;">${r.econ}</span></td>
      <td>${r.dots}</td>
      <td>${r.fifers}</td>
    </tr>
  `).join("");
}

// Render DAX Measure Catalog
function renderDaxCatalog(filterCat = "all") {
  const container = document.getElementById("daxMeasuresContainer");
  if (!container) return;

  const items = filterCat === "all" ? DAX_CATALOG : DAX_CATALOG.filter(d => d.category === filterCat);

  container.innerHTML = items.map((m, idx) => `
    <div class="dax-measure-card">
      <div class="dax-m-head">
        <span class="dax-m-title">${m.name}</span>
        <button class="copy-dax-btn" onclick="copyDaxText(this, \`${m.code.replace(/`/g, "\\`").replace(/"/g, "&quot;")}\`)">Copy DAX</button>
      </div>
      <p class="dax-m-desc">${m.desc}</p>
      <div class="dax-code-block">
        <pre>${escapeHtml(m.code)}</pre>
      </div>
    </div>
  `).join("");
}

window.copyDaxText = function (btn, codeText) {
  const cleanCode = codeText.replace(/&quot;/g, '"');
  navigator.clipboard.writeText(cleanCode).then(() => {
    const orig = btn.innerText;
    btn.innerText = "✓ Copied!";
    setTimeout(() => btn.innerText = orig, 1800);
  });
};

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Kickoff
window.addEventListener("DOMContentLoaded", initData);
