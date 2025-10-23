---
layout: single
title: "Blog"
permalink: /blog/
author: michael_lockwood
author_profile: true
header:
  overlay_color: "#000"
  overlay_filter: "0.55"
  overlay_image: /assets/images/default-overlay.jpg
---

<ul class="post-list">
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="page__meta">{{ post.date | date: "%b %-d, %Y" }}</span>
    {% if post.excerpt %}<p>{{ post.excerpt | strip_html | truncate: 200 }}</p>{% endif %}
  </li>
{% endfor %}
{% if page.collection == 'posts' or page.layout == 'single' or page.layout == 'splash' %}
  <script defer src="{{ '/assets/js/animate-on-scroll.js' | relative_url }}"></script>
{% endif %}
</ul>
