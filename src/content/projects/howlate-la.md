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
draft: false
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

Collection started on 18 August 2026 and has missed one 16-hour stretch since. The grading pipeline is built and is working through the backlog. Next is the public site at howlate.la, then version 1.0.
