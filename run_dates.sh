#!/bin/bash

start_date="2023-02-01"
end_date="2023-09-01"

current_date="$start_date"
while [ "$current_date" != "$end_date" ]; do
  last_day_of_previous_month=$(date -j -v-1d -f "%Y-%m-%d" "$current_date" "+%Y-%m-%d")
  echo "Running for date: $last_day_of_previous_month"
  ts-node src/index.ts "$last_day_of_previous_month"
  current_date=$(date -j -v +1m -f "%Y-%m-%d" "$current_date" "+%Y-%m-%d")
done
