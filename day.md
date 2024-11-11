---
layout: home
permalink: day
title: Расписание
---


<div id="programsContainer" class="programs-grid">
  {% assign mypages = site.html_pages | where: "type", "program" | sort: "start_time" %}

  {% for day in "1234567" %}
    <div class="day-column">
      <h3>День {{ day }}</h3>
      <div class="programs-list">
        {% for page in mypages %}
          {% if page.weekdays contains day %}
            <div class="program-card">
              <p class="program-time">{{ page.start_time }}</p>
              <a href="{{ site.baseurl }}{{ page.permalink }}">{{ page.title }}</a>
            </div>
          {% endif %}
        {% endfor %}
      </div>
    </div>
  {% endfor %}
</div>
