#!/bin/bash

start_date="2023-05-01"
end_date="2023-08-02"

current_date="$start_date"
while [ "$current_date" != "$end_date" ]; do
  echo "Running for date: $current_date"
  ts-node src/index.ts "$current_date"
  current_date=$(date -j -v +1d -f "%Y-%m-%d" "$current_date" "+%Y-%m-%d")
done
