"""
Global Cricket Analytics Dataset Generator
Generates realistic Star-Schema relational datasets for Power BI Desktop:
- Dim_Teams.csv
- Dim_Players.csv
- Dim_Venues.csv
- Dim_Match_Format.csv
- Dim_Date.csv
- Fact_Matches.csv
- Fact_Batting_Performances.csv
- Fact_Bowling_Performances.csv
"""

import os
import csv
import random
from datetime import datetime, timedelta

random.seed(42)

output_dir = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(output_dir, exist_ok=True)

# 1. Dim_Teams
teams_data = [
    {"Team_ID": 1, "Team_Name": "India", "Team_Code": "IND", "ICC_Rank": 1, "Continent": "Asia", "Primary_Color": "#0078D4", "Board": "BCCI", "Captain": "Rohit Sharma"},
    {"Team_ID": 2, "Team_Name": "Australia", "Team_Code": "AUS", "ICC_Rank": 2, "Continent": "Oceania", "Primary_Color": "#F2C811", "Board": "Cricket Australia", "Captain": "Pat Cummins"},
    {"Team_ID": 3, "Team_Name": "England", "Team_Code": "ENG", "ICC_Rank": 3, "Continent": "Europe", "Primary_Color": "#E01A4F", "Board": "ECB", "Captain": "Jos Buttler"},
    {"Team_ID": 4, "Team_Name": "South Africa", "Team_Code": "SA", "ICC_Rank": 4, "Continent": "Africa", "Primary_Color": "#0E7C3A", "Board": "CSA", "Captain": "Temba Bavuma"},
    {"Team_ID": 5, "Team_Name": "New Zealand", "Team_Code": "NZ", "ICC_Rank": 5, "Continent": "Oceania", "Primary_Color": "#111625", "Board": "NZC", "Captain": "Kane Williamson"},
    {"Team_ID": 6, "Team_Name": "Pakistan", "Team_Code": "PAK", "ICC_Rank": 6, "Continent": "Asia", "Primary_Color": "#01411C", "Board": "PCB", "Captain": "Babar Azam"},
    {"Team_ID": 7, "Team_Name": "West Indies", "Team_Code": "WI", "ICC_Rank": 7, "Continent": "Americas", "Primary_Color": "#7B1113", "Board": "CWI", "Captain": "Shai Hope"},
    {"Team_ID": 8, "Team_Name": "Sri Lanka", "Team_Code": "SL", "ICC_Rank": 8, "Continent": "Asia", "Primary_Color": "#0D3B66", "Board": "SLC", "Captain": "Charith Asalanka"},
    {"Team_ID": 9, "Team_Name": "Afghanistan", "Team_Code": "AFG", "ICC_Rank": 9, "Continent": "Asia", "Primary_Color": "#1D4ED8", "Board": "ACB", "Captain": "Rashid Khan"},
    {"Team_ID": 10, "Team_Name": "Bangladesh", "Team_Code": "BAN", "ICC_Rank": 10, "Continent": "Asia", "Primary_Color": "#006A4E", "Board": "BCB", "Captain": "Najmul Hossain Shanto"},
    {"Team_ID": 11, "Team_Name": "Netherlands", "Team_Code": "NED", "ICC_Rank": 11, "Continent": "Europe", "Primary_Color": "#FF5722", "Board": "KNCB", "Captain": "Scott Edwards"},
    {"Team_ID": 12, "Team_Name": "Ireland", "Team_Code": "IRE", "ICC_Rank": 12, "Continent": "Europe", "Primary_Color": "#16A34A", "Board": "Cricket Ireland", "Captain": "Paul Stirling"}
]

with open(os.path.join(output_dir, "Dim_Teams.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=teams_data[0].keys())
    writer.writeheader()
    writer.writerows(teams_data)

# 2. Dim_Match_Format
format_data = [
    {"Format_ID": 1, "Format_Name": "T20I", "Standard_Overs": 20, "Balls_Per_Over": 6, "Description": "Twenty20 International high-tempo 20-over matches"},
    {"Format_ID": 2, "Format_Name": "ODI", "Standard_Overs": 50, "Balls_Per_Over": 6, "Description": "One Day International 50-over matches"},
    {"Format_ID": 3, "Format_Name": "Test", "Standard_Overs": 450, "Balls_Per_Over": 6, "Description": "5-Day red-ball traditional pinnacle match"}
]

with open(os.path.join(output_dir, "Dim_Match_Format.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=format_data[0].keys())
    writer.writeheader()
    writer.writerows(format_data)

# 3. Dim_Venues
venues_data = [
    {"Venue_ID": 1, "Stadium_Name": "Melbourne Cricket Ground (MCG)", "City": "Melbourne", "Country": "Australia", "Capacity": 100024, "Pitch_Type": "Pace & Bounce", "Avg_First_Innings_Runs": 168},
    {"Venue_ID": 2, "Stadium_Name": "Lord's Cricket Ground", "City": "London", "Country": "England", "Capacity": 31100, "Pitch_Type": "Swing & Seam", "Avg_First_Innings_Runs": 155},
    {"Venue_ID": 3, "Stadium_Name": "Eden Gardens", "City": "Kolkata", "Country": "India", "Capacity": 68000, "Pitch_Type": "Balanced & Spin", "Avg_First_Innings_Runs": 178},
    {"Venue_ID": 4, "Stadium_Name": "Wankhede Stadium", "City": "Mumbai", "Country": "India", "Capacity": 33108, "Pitch_Type": "Batting Paradise", "Avg_First_Innings_Runs": 192},
    {"Venue_ID": 5, "Stadium_Name": "Sydney Cricket Ground (SCG)", "City": "Sydney", "Country": "Australia", "Capacity": 48000, "Pitch_Type": "Spin Friendly", "Avg_First_Innings_Runs": 172},
    {"Venue_ID": 6, "Stadium_Name": "The Oval", "City": "London", "Country": "England", "Capacity": 27500, "Pitch_Type": "True Bounce & Pace", "Avg_First_Innings_Runs": 165},
    {"Venue_ID": 7, "Stadium_Name": "SuperSport Park", "City": "Centurion", "Country": "South Africa", "Capacity": 22000, "Pitch_Type": "Fast & Bouncy", "Avg_First_Innings_Runs": 180},
    {"Venue_ID": 8, "Stadium_Name": "Gaddafi Stadium", "City": "Lahore", "Country": "Pakistan", "Capacity": 27000, "Pitch_Type": "Flat & Batting", "Avg_First_Innings_Runs": 185},
    {"Venue_ID": 9, "Stadium_Name": "Kensington Oval", "City": "Bridgetown", "Country": "West Indies", "Capacity": 28000, "Pitch_Type": "Pace & Seam", "Avg_First_Innings_Runs": 160},
    {"Venue_ID": 10, "Stadium_Name": "Narendra Modi Stadium", "City": "Ahmedabad", "Country": "India", "Capacity": 132000, "Pitch_Type": "Large Boundaries & Pace", "Avg_First_Innings_Runs": 175},
    {"Venue_ID": 11, "Stadium_Name": "Dubai International Cricket Stadium", "City": "Dubai", "Country": "United Arab Emirates", "Capacity": 25000, "Pitch_Type": "Toss Dependent / Dew", "Avg_First_Innings_Runs": 158},
    {"Venue_ID": 12, "Stadium_Name": "R. Premadasa Stadium", "City": "Colombo", "Country": "Sri Lanka", "Capacity": 35000, "Pitch_Type": "Dry & Sharp Turn", "Avg_First_Innings_Runs": 152},
    {"Venue_ID": 13, "Stadium_Name": "Eden Park", "City": "Auckland", "Country": "New Zealand", "Capacity": 42000, "Pitch_Type": "Short Boundaries / High Scoring", "Avg_First_Innings_Runs": 195},
    {"Venue_ID": 14, "Stadium_Name": "Newlands Cricket Ground", "City": "Cape Town", "Country": "South Africa", "Capacity": 25000, "Pitch_Type": "Seam & Swing", "Avg_First_Innings_Runs": 159}
]

with open(os.path.join(output_dir, "Dim_Venues.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=venues_data[0].keys())
    writer.writeheader()
    writer.writerows(venues_data)

# 4. Dim_Players
players_data = [
    # India
    {"Player_ID": 101, "Player_Name": "Virat Kohli", "Team_ID": 1, "Role": "Top-order Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Medium", "ICC_Rank": 3, "Experience_Years": 16},
    {"Player_ID": 102, "Player_Name": "Rohit Sharma", "Team_ID": 1, "Role": "Opening Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Off-break", "ICC_Rank": 2, "Experience_Years": 17},
    {"Player_ID": 103, "Player_Name": "Jasprit Bumrah", "Team_ID": 1, "Role": "Pace Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Fast", "ICC_Rank": 1, "Experience_Years": 8},
    {"Player_ID": 104, "Player_Name": "Hardik Pandya", "Team_ID": 1, "Role": "All-Rounder", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Fast-Medium", "ICC_Rank": 5, "Experience_Years": 9},
    {"Player_ID": 105, "Player_Name": "Kuldeep Yadav", "Team_ID": 1, "Role": "Spin Bowler", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Left Arm Wrist Spin", "ICC_Rank": 6, "Experience_Years": 7},
    {"Player_ID": 106, "Player_Name": "Suryakumar Yadav", "Team_ID": 1, "Role": "Middle-order Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Medium", "ICC_Rank": 1, "Experience_Years": 4},
    # Australia
    {"Player_ID": 201, "Player_Name": "Steve Smith", "Team_ID": 2, "Role": "Middle-order Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Leg Break", "ICC_Rank": 4, "Experience_Years": 14},
    {"Player_ID": 202, "Player_Name": "Travis Head", "Team_ID": 2, "Role": "Opening Batter", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Right Arm Off-break", "ICC_Rank": 5, "Experience_Years": 8},
    {"Player_ID": 203, "Player_Name": "Pat Cummins", "Team_ID": 2, "Role": "Pace Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Fast", "ICC_Rank": 2, "Experience_Years": 12},
    {"Player_ID": 204, "Player_Name": "Mitchell Starc", "Team_ID": 2, "Role": "Pace Bowler", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Left Arm Fast", "ICC_Rank": 7, "Experience_Years": 13},
    {"Player_ID": 205, "Player_Name": "Glenn Maxwell", "Team_ID": 2, "Role": "All-Rounder", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Off-break", "ICC_Rank": 8, "Experience_Years": 12},
    {"Player_ID": 206, "Player_Name": "Adam Zampa", "Team_ID": 2, "Role": "Spin Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Leg Break", "ICC_Rank": 4, "Experience_Years": 8},
    # England
    {"Player_ID": 301, "Player_Name": "Joe Root", "Team_ID": 3, "Role": "Top-order Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Off-break", "ICC_Rank": 1, "Experience_Years": 13},
    {"Player_ID": 302, "Player_Name": "Jos Buttler", "Team_ID": 3, "Role": "Wicket-Keeper Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "None", "ICC_Rank": 6, "Experience_Years": 12},
    {"Player_ID": 303, "Player_Name": "Ben Stokes", "Team_ID": 3, "Role": "All-Rounder", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Right Arm Fast-Medium", "ICC_Rank": 7, "Experience_Years": 12},
    {"Player_ID": 304, "Player_Name": "Jofra Archer", "Team_ID": 3, "Role": "Pace Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Fast", "ICC_Rank": 12, "Experience_Years": 5},
    {"Player_ID": 305, "Player_Name": "Adil Rashid", "Team_ID": 3, "Role": "Spin Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Leg Break", "ICC_Rank": 3, "Experience_Years": 14},
    # South Africa
    {"Player_ID": 401, "Player_Name": "Heinrich Klaasen", "Team_ID": 4, "Role": "Middle-order Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Off-break", "ICC_Rank": 8, "Experience_Years": 6},
    {"Player_ID": 402, "Player_Name": "Quinton de Kock", "Team_ID": 4, "Role": "Wicket-Keeper Batter", "Batting_Style": "Left Hand Bat", "Bowling_Style": "None", "ICC_Rank": 7, "Experience_Years": 11},
    {"Player_ID": 403, "Player_Name": "Kagiso Rabada", "Team_ID": 4, "Role": "Pace Bowler", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Right Arm Fast", "ICC_Rank": 3, "Experience_Years": 9},
    {"Player_ID": 404, "Player_Name": "Keshav Maharaj", "Team_ID": 4, "Role": "Spin Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Left Arm Orthodox", "ICC_Rank": 2, "Experience_Years": 8},
    {"Player_ID": 405, "Player_Name": "David Miller", "Team_ID": 4, "Role": "Middle-order Batter", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Right Arm Off-break", "ICC_Rank": 11, "Experience_Years": 13},
    # New Zealand
    {"Player_ID": 501, "Player_Name": "Kane Williamson", "Team_ID": 5, "Role": "Top-order Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Off-break", "ICC_Rank": 5, "Experience_Years": 14},
    {"Player_ID": 502, "Player_Name": "Trent Boult", "Team_ID": 5, "Role": "Pace Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Left Arm Fast-Medium", "ICC_Rank": 8, "Experience_Years": 12},
    {"Player_ID": 503, "Player_Name": "Rachin Ravindra", "Team_ID": 5, "Role": "All-Rounder", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Left Arm Orthodox", "ICC_Rank": 14, "Experience_Years": 3},
    {"Player_ID": 504, "Player_Name": "Mitchell Santner", "Team_ID": 5, "Role": "All-Rounder", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Left Arm Orthodox", "ICC_Rank": 9, "Experience_Years": 9},
    # Pakistan
    {"Player_ID": 601, "Player_Name": "Babar Azam", "Team_ID": 6, "Role": "Top-order Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Off-break", "ICC_Rank": 4, "Experience_Years": 9},
    {"Player_ID": 602, "Player_Name": "Shaheen Afridi", "Team_ID": 6, "Role": "Pace Bowler", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Left Arm Fast", "ICC_Rank": 5, "Experience_Years": 6},
    {"Player_ID": 603, "Player_Name": "Mohammad Rizwan", "Team_ID": 6, "Role": "Wicket-Keeper Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "None", "ICC_Rank": 9, "Experience_Years": 8},
    {"Player_ID": 604, "Player_Name": "Naseem Shah", "Team_ID": 6, "Role": "Pace Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Fast", "ICC_Rank": 15, "Experience_Years": 4},
    # West Indies
    {"Player_ID": 701, "Player_Name": "Nicholas Pooran", "Team_ID": 7, "Role": "Wicket-Keeper Batter", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Right Arm Off-break", "ICC_Rank": 10, "Experience_Years": 6},
    {"Player_ID": 702, "Player_Name": "Andre Russell", "Team_ID": 7, "Role": "All-Rounder", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Fast", "ICC_Rank": 13, "Experience_Years": 13},
    {"Player_ID": 703, "Player_Name": "Alzarri Joseph", "Team_ID": 7, "Role": "Pace Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Fast", "ICC_Rank": 14, "Experience_Years": 7},
    # Sri Lanka
    {"Player_ID": 801, "Player_Name": "Wanindu Hasaranga", "Team_ID": 8, "Role": "All-Rounder", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Leg Break", "ICC_Rank": 3, "Experience_Years": 6},
    {"Player_ID": 802, "Player_Name": "Pathum Nissanka", "Team_ID": 8, "Role": "Opening Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "None", "ICC_Rank": 12, "Experience_Years": 4},
    {"Player_ID": 803, "Player_Name": "Matheesha Pathirana", "Team_ID": 8, "Role": "Pace Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Fast", "ICC_Rank": 18, "Experience_Years": 3},
    # Afghanistan
    {"Player_ID": 901, "Player_Name": "Rashid Khan", "Team_ID": 9, "Role": "All-Rounder", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Leg Break", "ICC_Rank": 1, "Experience_Years": 9},
    {"Player_ID": 902, "Player_Name": "Rahmanullah Gurbaz", "Team_ID": 9, "Role": "Wicket-Keeper Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "None", "ICC_Rank": 16, "Experience_Years": 5},
    {"Player_ID": 903, "Player_Name": "Fazalhaq Farooqi", "Team_ID": 9, "Role": "Pace Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Left Arm Fast-Medium", "ICC_Rank": 10, "Experience_Years": 4},
    # Bangladesh
    {"Player_ID": 1001, "Player_Name": "Shakib Al Hasan", "Team_ID": 10, "Role": "All-Rounder", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Left Arm Orthodox", "ICC_Rank": 2, "Experience_Years": 18},
    {"Player_ID": 1002, "Player_Name": "Mustafizur Rahman", "Team_ID": 10, "Role": "Pace Bowler", "Batting_Style": "Left Hand Bat", "Bowling_Style": "Left Arm Fast-Medium", "ICC_Rank": 15, "Experience_Years": 9},
    # Netherlands & Ireland
    {"Player_ID": 1101, "Player_Name": "Bas de Leede", "Team_ID": 11, "Role": "All-Rounder", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Fast-Medium", "ICC_Rank": 22, "Experience_Years": 5},
    {"Player_ID": 1201, "Player_Name": "Paul Stirling", "Team_ID": 12, "Role": "Opening Batter", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Right Arm Off-break", "ICC_Rank": 24, "Experience_Years": 15},
    {"Player_ID": 1202, "Player_Name": "Josh Little", "Team_ID": 12, "Role": "Pace Bowler", "Batting_Style": "Right Hand Bat", "Bowling_Style": "Left Arm Fast", "ICC_Rank": 20, "Experience_Years": 6}
]

with open(os.path.join(output_dir, "Dim_Players.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=players_data[0].keys())
    writer.writeheader()
    writer.writerows(players_data)

# 5. Dim_Date (2022 to 2026)
start_date = datetime(2022, 1, 1)
end_date = datetime(2026, 3, 31)
curr = start_date
date_rows = []

while curr <= end_date:
    qtr = f"Q{(curr.month - 1) // 3 + 1}"
    date_rows.append({
        "Date": curr.strftime("%Y-%m-%d"),
        "Year": curr.year,
        "Quarter": qtr,
        "Month_Num": curr.month,
        "Month_Name": curr.strftime("%B"),
        "Month_Short": curr.strftime("%b"),
        "Year_Month": curr.strftime("%Y-%m"),
        "Day_Of_Week": curr.strftime("%A"),
        "Is_Weekend": "Yes" if curr.weekday() in [5, 6] else "No",
        "Season": f"{curr.year}-{curr.year+1}" if curr.month >= 10 else f"{curr.year-1}-{curr.year}"
    })
    curr += timedelta(days=1)

with open(os.path.join(output_dir, "Dim_Date.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=date_rows[0].keys())
    writer.writeheader()
    writer.writerows(date_rows)

# 6. Fact_Matches (320 matches across tournaments)
tournaments = [
    "ICC Cricket World Cup 2023",
    "ICC T20 World Cup 2024",
    "ICC Champions Trophy 2025",
    "ICC World Test Championship",
    "Bilateral Trophy Series"
]

team_ids = [t["Team_ID"] for t in teams_data]
team_weights = {
    1: 0.82, 2: 0.80, 3: 0.72, 4: 0.70, 5: 0.68,
    6: 0.62, 7: 0.55, 8: 0.52, 9: 0.50, 10: 0.44, 11: 0.35, 12: 0.38
}

match_rows = []
batting_rows = []
bowling_rows = []

match_id = 1001
batting_perf_id = 50001
bowling_perf_id = 80001

dates_sample = [start_date + timedelta(days=random.randint(0, (end_date - start_date).days)) for _ in range(350)]
dates_sample.sort()

# Helper dicts
players_by_team = {}
for p in players_data:
    players_by_team.setdefault(p["Team_ID"], []).append(p)

for match_idx, m_date in enumerate(dates_sample):
    fmt = random.choices([1, 2, 3], weights=[0.55, 0.35, 0.10])[0] # 55% T20I, 35% ODI, 10% Test
    venue = random.choice(venues_data)
    
    t1, t2 = random.sample(team_ids[:10], 2) # mainly top 10
    
    tourn = random.choice(tournaments)
    if fmt == 1:
        tourn = random.choice(["ICC T20 World Cup 2024", "Bilateral T20I Trophy", "Asia Cup T20", "Tri-Nation T20"])
    elif fmt == 2:
        tourn = random.choice(["ICC Cricket World Cup 2023", "ICC Champions Trophy 2025", "Bilateral ODI Series"])
    else:
        tourn = "ICC World Test Championship"

    toss_winner = random.choice([t1, t2])
    toss_decision = random.choice(["Bat", "Bowl"])
    
    bat_first = toss_winner if toss_decision == "Bat" else (t2 if toss_winner == t1 else t1)
    bowl_first = t2 if bat_first == t1 else t1
    
    # Calculate winner based on weights and toss/pitch
    w1 = team_weights.get(t1, 0.5)
    w2 = team_weights.get(t2, 0.5)
    
    # Home team venue country advantage
    v_country = venue["Country"]
    for t_obj in teams_data:
        if t_obj["Team_ID"] == t1 and (t_obj["Continent"] in v_country or t_obj["Team_Name"] in v_country):
            w1 += 0.08
        if t_obj["Team_ID"] == t2 and (t_obj["Continent"] in v_country or t_obj["Team_Name"] in v_country):
            w2 += 0.08
            
    win_prob_t1 = w1 / (w1 + w2)
    winner = t1 if random.random() < win_prob_t1 else t2
    chased_successfully = (winner == bowl_first)
    
    if fmt == 1: # T20I
        t1_runs = random.randint(130, 225)
        t1_wkts = random.randint(3, 10)
        t1_overs = 20.0 if t1_wkts < 10 else round(random.uniform(16.2, 19.5), 1)
        
        if chased_successfully:
            t2_runs = t1_runs + random.randint(1, 6)
            t2_wkts = random.randint(2, 7)
            t2_overs = round(random.uniform(17.1, 19.5), 1)
            margin_type = "Wickets"
            margin = 10 - t2_wkts
        else:
            t2_runs = max(90, t1_runs - random.randint(5, 55))
            t2_wkts = random.randint(6, 10)
            t2_overs = 20.0 if t2_wkts < 10 else round(random.uniform(15.0, 19.4), 1)
            margin_type = "Runs"
            margin = t1_runs - t2_runs
    elif fmt == 2: # ODI
        t1_runs = random.randint(230, 375)
        t1_wkts = random.randint(4, 10)
        t1_overs = 50.0 if t1_wkts < 10 else round(random.uniform(42.0, 49.3), 1)
        
        if chased_successfully:
            t2_runs = t1_runs + random.randint(1, 6)
            t2_wkts = random.randint(3, 8)
            t2_overs = round(random.uniform(43.0, 49.2), 1)
            margin_type = "Wickets"
            margin = 10 - t2_wkts
        else:
            t2_runs = max(160, t1_runs - random.randint(10, 95))
            t2_wkts = random.randint(7, 10)
            t2_overs = 50.0 if t2_wkts < 10 else round(random.uniform(35.0, 48.5), 1)
            margin_type = "Runs"
            margin = t1_runs - t2_runs
    else: # Test
        t1_runs = random.randint(280, 520)
        t1_wkts = 10
        t1_overs = round(random.uniform(85.0, 130.0), 1)
        t2_runs = random.randint(200, 480)
        t2_wkts = 10
        t2_overs = round(random.uniform(70.0, 120.0), 1)
        margin_type = random.choice(["Runs", "Wickets", "Innings & Runs"])
        margin = random.randint(45, 180) if "Runs" in margin_type else random.randint(3, 8)

    # Pick Player of Match from winning team
    win_players = players_by_team.get(winner, [])
    potm_id = random.choice(win_players)["Player_ID"] if win_players else 101
    
    total_match_runs = t1_runs + t2_runs
    total_match_wkts = t1_wkts + t2_wkts
    
    match_rows.append({
        "Match_ID": match_id,
        "Date": m_date.strftime("%Y-%m-%d"),
        "Format_ID": fmt,
        "Tournament": tourn,
        "Venue_ID": venue["Venue_ID"],
        "Team1_ID": t1,
        "Team2_ID": t2,
        "Toss_Winner_ID": toss_winner,
        "Toss_Decision": toss_decision,
        "First_Batting_Team_ID": bat_first,
        "Second_Batting_Team_ID": bowl_first,
        "Winner_ID": winner,
        "Win_Margin": margin,
        "Win_Margin_Type": margin_type,
        "Player_Of_Match_ID": potm_id,
        "Team1_Runs": t1_runs,
        "Team1_Wickets": t1_wkts,
        "Team1_Overs": t1_overs,
        "Team2_Runs": t2_runs,
        "Team2_Wickets": t2_wkts,
        "Team2_Overs": t2_overs,
        "Total_Runs": total_match_runs,
        "Total_Wickets": total_match_wkts,
        "Attendance": random.randint(int(venue["Capacity"] * 0.55), int(venue["Capacity"] * 0.98))
    })

    # Generate Batting & Bowling performances for players in this match
    for team_playing, opp_team, team_score, team_wkts in [(bat_first, bowl_first, t1_runs, t1_wkts), (bowl_first, bat_first, t2_runs, t2_wkts)]:
        active_batters = players_by_team.get(team_playing, [])
        active_bowlers = players_by_team.get(opp_team, [])
        
        runs_allocated = 0
        for pos, p in enumerate(active_batters[:4], 1):
            if pos == 1 and p["Player_ID"] == potm_id:
                # POTM stellar innings
                p_runs = random.randint(65, 124) if fmt <= 2 else random.randint(90, 175)
            else:
                p_runs = random.randint(12, 78) if fmt == 1 else (random.randint(18, 105) if fmt == 2 else random.randint(25, 140))
            
            # Bound by remaining score
            p_runs = min(p_runs, max(10, team_score - runs_allocated))
            runs_allocated += p_runs
            
            p_balls = max(int(p_runs * (random.uniform(0.65, 1.2) if fmt == 1 else (random.uniform(0.9, 1.4) if fmt == 2 else random.uniform(1.4, 2.2)))), 1)
            sr = round((p_runs / p_balls) * 100, 2)
            fours = int(p_runs * random.uniform(0.08, 0.14))
            sixes = int((p_runs - (fours * 4)) / 6 * random.uniform(0.3, 0.7)) if p_runs > 20 and fmt <= 2 else 0
            sixes = max(0, sixes)
            
            milestone = "Century" if p_runs >= 100 else ("Half-Century" if p_runs >= 50 else ("Duck" if p_runs == 0 else "None"))
            is_out = 1 if pos <= team_wkts else 0
            dismissal = random.choice(["Caught", "Bowled", "LBW", "Run Out"]) if is_out == 1 else "Not Out"

            batting_rows.append({
                "Performance_ID": batting_perf_id,
                "Match_ID": match_id,
                "Player_ID": p["Player_ID"],
                "Team_ID": team_playing,
                "Opponent_Team_ID": opp_team,
                "Batting_Position": pos,
                "Runs_Scored": p_runs,
                "Balls_Faced": p_balls,
                "Fours": fours,
                "Sixes": sixes,
                "Strike_Rate": sr,
                "Is_Out": is_out,
                "Dismissal_Mode": dismissal,
                "Milestone": milestone
            })
            batting_perf_id += 1

        # Bowling performance
        for b_pos, b in enumerate(active_bowlers[:4], 1):
            if fmt == 1:
                b_overs = round(random.choice([3.0, 4.0, 4.0]), 1)
                b_runs = random.randint(18, 44)
            elif fmt == 2:
                b_overs = round(random.uniform(7.0, 10.0), 1)
                b_runs = random.randint(35, 68)
            else:
                b_overs = round(random.uniform(15.0, 26.0), 1)
                b_runs = random.randint(45, 95)
                
            if b["Player_ID"] == potm_id:
                b_wkts = random.randint(3, 5)
                b_runs = max(15, b_runs - 15)
            else:
                b_wkts = random.choices([0, 1, 2, 3, 4], weights=[0.30, 0.35, 0.20, 0.12, 0.03])[0]
                
            econ = round(b_runs / max(b_overs, 1), 2)
            dots = int(b_overs * 6 * random.uniform(0.35, 0.65))
            fifer = 1 if b_wkts >= 5 else 0

            bowling_rows.append({
                "Spell_ID": bowling_perf_id,
                "Match_ID": match_id,
                "Player_ID": b["Player_ID"],
                "Team_ID": opp_team,
                "Opponent_Team_ID": team_playing,
                "Overs_Bowled": b_overs,
                "Maidens": random.choice([0, 0, 1, 2]) if fmt >= 2 else (1 if random.random() < 0.15 else 0),
                "Runs_Conceded": b_runs,
                "Wickets_Taken": b_wkts,
                "Economy_Rate": econ,
                "Dot_Balls": dots,
                "Fifer_Haul": fifer
            })
            bowling_perf_id += 1

    match_id += 1

with open(os.path.join(output_dir, "Fact_Matches.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=match_rows[0].keys())
    writer.writeheader()
    writer.writerows(match_rows)

with open(os.path.join(output_dir, "Fact_Batting_Performances.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=batting_rows[0].keys())
    writer.writeheader()
    writer.writerows(batting_rows)

with open(os.path.join(output_dir, "Fact_Bowling_Performances.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=bowling_rows[0].keys())
    writer.writeheader()
    writer.writerows(bowling_rows)

print(f"Data Generation Completed successfully in '{output_dir}':")
print(f"- Dim_Teams: {len(teams_data)} rows")
print(f"- Dim_Players: {len(players_data)} rows")
print(f"- Dim_Venues: {len(venues_data)} rows")
print(f"- Dim_Match_Format: {len(format_data)} rows")
print(f"- Dim_Date: {len(date_rows)} rows")
print(f"- Fact_Matches: {len(match_rows)} rows")
print(f"- Fact_Batting_Performances: {len(batting_rows)} rows")
print(f"- Fact_Bowling_Performances: {len(bowling_rows)} rows")
