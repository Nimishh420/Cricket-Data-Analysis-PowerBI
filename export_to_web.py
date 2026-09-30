import os
import json
import csv

data_dir = os.path.join(os.path.dirname(__file__), "data")
files = [
    "Dim_Teams.csv",
    "Dim_Players.csv",
    "Dim_Venues.csv",
    "Dim_Match_Format.csv",
    "Dim_Date.csv",
    "Fact_Matches.csv",
    "Fact_Batting_Performances.csv",
    "Fact_Bowling_Performances.csv"
]

export_data = {}

for f in files:
    key = f.replace(".csv", "")
    filepath = os.path.join(data_dir, f)
    with open(filepath, "r", encoding="utf-8") as csv_f:
        reader = csv.DictReader(csv_f)
        export_data[key] = list(reader)

js_content = f"// Auto-generated data for Global Cricket Power BI Dashboard\nwindow.CRICKET_DATA = {json.dumps(export_data, indent=2)};\n"

output_path = os.path.join(os.path.dirname(__file__), "cricket_data.js")
with open(output_path, "w", encoding="utf-8") as out_f:
    out_f.write(js_content)

print(f"Successfully generated {output_path} ({os.path.getsize(output_path)} bytes)")
