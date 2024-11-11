---
layout: page
permalink: day
title: Расписание
---


<div id="programsContainer" class="programs-grid">
  {% assign mypages = site.hours | sort: "start_time" %}

  <div class="grid">
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
              {% if page.weekdays contains day and page.start_time == hour %}
                <div class="program-card">
                  <p class="program-time">{{ page.start_time }}</p>
                  <a href="{{ site.baseurl }}{{ page.permalink }}">{{ page.title }}</a>
                </div>
              {% endif %}
            {% endfor %}
          </div>
        {% endfor %}
      </div>
    {% endfor %}
  </div>
</div>
