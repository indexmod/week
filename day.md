---
layout: page
permalink: day
title: Расписание
---


<div id="programsContainer" class="programs-grid">
  {% assign mypages = site.hours | sort: "start_time" %}

  <!-- Заголовки дней недели -->
  <div class="header-row">
    {% for day in "1234567" %}
      <div class="day-header">День {{ day }}</div>
    {% endfor %}
  </div>

  <!-- Строки по часам (0-23) -->
  {% for hour in (0..23) %}
    <div class="hour-row">
      {% for day in "1234567" %}
        <div class="program-cell">
          {% for page in mypages %}
            {% assign page_hour = page.start_time | split: ":" | first | plus: 0 %}
            {% if page.weekdays contains day and page_hour == hour %}
              <div class="program-card">
                <p class="program-time">{{ page.start_time }}</p>
                <a href="{{ page.permalink }}">{{ page.title }}</a>
              </div>
            {% endif %}
          {% endfor %}
        </div>
      {% endfor %}
    </div>
  {% endfor %}
</div>
