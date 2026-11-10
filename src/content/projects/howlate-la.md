---
title: howlate.la
summary: Records every LA Metro bus and train position, about 25 million updates a day, and grades each stop against the timetable.
status: Collecting data
role: Solo project
start: 2026-08
stack: [Python, DuckDB, Google Cloud]
links:
  source: https://github.com/asarelcastellanos/howlate.la
order: 1
draft: true
---

<script>
	import StatRow from '$lib/components/StatRow.svelte';
</script>

## The problem

Trip planners turn Metro's live feed into a next-arrival time, and that number disappears once the bus pulls up. So a rider who wants to know whether the 720 westbound is usually late at 8am on a Tuesday has nowhere to look.

## What it collects

Two public feeds. The real-time feed reports each vehicle's position about every six seconds. The timetable feed lists every scheduled stop of every trip. Metro revises the timetable when service changes, so howlate.la keeps each version and grades a day against the timetable that was in force on it.

## How it works

A small always-on machine holds one connection to the bus feed and one to rail. Every five minutes it closes the current file, compresses it, and uploads it to Cloud Storage. A daily job then reads a day of positions, finds that day's timetable, and writes one row per scheduled stop: when the vehicle should have arrived, when it did, and the difference.

<StatRow
	label="By the numbers"
	stats={[
		{ label: 'Lines watched', value: '120', note: '114 bus routes and 6 rail lines' },
		{ label: 'Records a day', value: '~25M', note: 'About 400 a second at peak' },
		{ label: 'Archive growth', value: '~1 GB/day', note: 'Compressed from 15 GB of raw text' },
		{ label: 'Running cost', value: '~$2/mo', note: 'As of November 2026' }
	]}
/>

## How it's built

I run it like a team project. A release plan sets out each version from 0.1.0 to 1.0.0. Every change starts as an issue and lands through a pull request with CI and a review, and the main branch only takes finished releases. The whole history is public.

## What's next

Collection started on 18 August 2026 and has missed one 16-hour stretch since, on 21 August, when Metro's feed held a connection open and sent nothing. The pipeline has graded every day collected through 8 November, 83 days in all, and a scheduled job now grades each new day at 5am Pacific.

Next is the public site. The first launch gives every line a page with an hour-of-week chart and the delay along its route, plus a ranking of lines by reliability. After that come a commute tool that answers "which bus do I catch to arrive by 9:00", a replay of a full day of Metro in 60 seconds, and then version 1.0.
