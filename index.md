---
layout: page
title: Home
---

<!-- Nav -->
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-200">
    <div class="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
      <a href="#top" class="font-extrabold tracking-tight text-lg">MSL<span class="text-zinc-400">.db</span></a>
      <nav class="hidden md:flex gap-6 text-sm">
        <a href="#about" class="hover:text-zinc-600">About</a>
        <a href="#skills" class="hover:text-zinc-600">Skills</a>
        <a href="#experience" class="hover:text-zinc-600">Experience</a>
        <a href="#projects" class="hover:text-zinc-600">Projects</a>
        <a href="#writing" class="hover:text-zinc-600">Writing</a>
        <a href="#contact" class="hover:text-zinc-600">Contact</a>
      </nav>
      <a href="#resume" class="no-print inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-zinc-300 hover:bg-zinc-100">Download Resume</a>
    </div>
  </header>

  <!-- Hero -->
  <main id="top" class="relative">
    <section class="max-w-6xl mx-auto px-4 pt-16 pb-12">
      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 class="text-4xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Michael Shawn Lockwood
          </h1>
          <p class="mt-3 text-lg text-zinc-600">
            Senior SQL Server DBA • Performance Optimization • Automation (T‑SQL & SSIS) • On‑prem specialist • Exploring PostgreSQL • Data reliability advocate.
          </p>
          <div class="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <a class="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-zinc-300 hover:bg-zinc-100" href="#contact">Let’s talk</a>
            <a class="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-zinc-300 hover:bg-zinc-100" href="https://www.linkedin.com/in/mslockwood" target="_blank" rel="noopener">LinkedIn</a>
            <a class="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-zinc-300 hover:bg-zinc-100" href="https://github.com/michaelshawnlockwood" target="_blank" rel="noopener">GitHub</a>
          </div>
        </div>
        <div class="md:justify-self-end">
          <div class="rounded-3xl border border-zinc-200 p-6 bg-white shadow-sm">
            <h2 class="font-semibold">Core Value</h2>
            <p class="mt-2 text-zinc-600">I keep mission‑critical databases fast, predictable, and boring—in the best way. I’ve been tuning SQL Server since 7.0 and thrive on surgical fixes and durable automation.</p>
            <ul class="mt-4 space-y-2 text-zinc-700 text-sm">
              <li>• 20+ years SQL Server (7.0a → 2019)</li>
              <li>• Always On, FCI, Mirroring, Replication, Backup/Restore</li>
              <li>• SSIS/SSRS, T‑SQL performance engineering</li>
              <li>• HL7 data integration in healthcare</li>
              <li>• MCDBA (2006)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <!-- About -->
    <section id="about" class="bg-white border-t border-b border-zinc-200">
      <div class="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
        <div class="md:col-span-2">
          <h3 class="text-2xl font-bold">About</h3>
          <p class="mt-3 text-zinc-700">I’m a hands‑on Senior DBA and former Director who solves high‑impact performance problems and builds automation so they don’t come back. I prefer on‑prem SQL Server or large VM deployments where I can observe, measure, and control the stack. I’m currently deepening PostgreSQL to broaden what I can automate and support.</p>
        </div>
        <div>
          <div class="rounded-2xl border border-zinc-200 p-4 bg-zinc-50">
            <p class="text-sm text-zinc-600">Fun fact: I enjoy country swing dancing and long‑term, chart‑backed investing experiments.</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Skills -->
    <section id="skills" class="max-w-6xl mx-auto px-4 py-12">
      <h3 class="text-2xl font-bold">Skills Snapshot</h3>
      <div class="mt-6 grid md:grid-cols-3 gap-6">
        <div class="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 class="font-semibold">Performance & HA/DR</h4>
          <ul class="mt-3 text-sm text-zinc-700 space-y-1">
            <li>• Query tuning & index strategy</li>
            <li>• Always On AGs / Failover Cluster Instances</li>
            <li>• Mirroring, Replication</li>
            <li>• Backup/Restore, DB growth forecasting</li>
          </ul>
        </div>
        <div class="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 class="font-semibold">Dev & Automation</h4>
          <ul class="mt-3 text-sm text-zinc-700 space-y-1">
            <li>• T‑SQL, SSIS, SSRS</li>
            <li>• SQL Data Projects & DACPAC exposure</li>
            <li>• Scripting: T‑SQL primary; Python (one‑off)</li>
            <li>• Source control & release hygiene</li>
          </ul>
        </div>
        <div class="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 class="font-semibold">Platforms</h4>
          <ul class="mt-3 text-sm text-zinc-700 space-y-1">
            <li>• SQL Server (on‑prem & IaaS)</li>
            <li>• Azure SQL exposure; prefer VM/on‑prem control</li>
            <li>• PostgreSQL (learning & lab automation)</li>
            <li>• HL7 pipelines (OnePoint Patient Care)</li>
          </ul>
        </div>
      </div>
    </section>
    <!-- Experience Highlights -->
    <section id="experience" class="bg-white border-y border-zinc-200">
      <div class="max-w-6xl mx-auto px-4 py-12">
        <h3 class="text-2xl font-bold">Impact Highlights</h3>
        <div class="mt-6 grid md:grid-cols-2 gap-6">
          <article class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h4 class="font-semibold">90‑minute performance rescue</h4>
            <p class="mt-2 text-sm text-zinc-700">Resolved a critical performance incident at Grand Canyon University in 90 minutes (two weeks allotted), then used the buffer to build a data‑growth forecasting utility.</p>
          </article>
          <article class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h4 class="font-semibold">Director who still ships</h4>
            <p class="mt-2 text-sm text-zinc-700">Led at OnePoint Patient Care for 5+ years while staying hands‑on: HL7 integration, performance work, and reliable delivery under pressure.</p>
          </article>
          <article class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h4 class="font-semibold">Automation mindset</h4>
            <p class="mt-2 text-sm text-zinc-700">Created utilities for intelligent index maintenance and surveillance; current project <span class="font-semibold">SQLAgent007</span> expands tuning across SQL Server, Azure SQL, and PostgreSQL.</p>
          </article>
          <article class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h4 class="font-semibold">Production pragmatist</h4>
            <p class="mt-2 text-sm text-zinc-700">Bias for observability, repeatability, and low‑drama ops. Comfortable saying “no” to risky shortcuts.</p>
          </article>
        </div>
      </div>
    </section>
    <!-- Projects -->
    <section id="projects" class="max-w-6xl mx-auto px-4 py-12">
      <h3 class="text-2xl font-bold">Selected Projects</h3>
      <div class="mt-6 grid md:grid-cols-2 gap-6">
        <div class="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 class="font-semibold">SQLAgent007</h4>
          <p class="mt-2 text-sm text-zinc-700">Open project for automated index tuning, performance surveillance, and cross‑platform support (SQL Server, Azure SQL, PostgreSQL). Repo & docs coming online.</p>
          <a class="inline-block mt-3 text-sm font-semibold underline" href="https://github.com/michaelshawnlockwood" target="_blank" rel="noopener">Follow on GitHub</a>
        </div>
        <div class="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 class="font-semibold">AIMS (Modernized)</h4>
          <p class="mt-2 text-sm text-zinc-700">Reviving a legacy automation suite for latest SQL Server + Azure + PostgreSQL. Focus: repeatable ops, safety rails, and observability.</p>
        </div>
        <div class="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 class="font-semibold">HL7 Clinical Data Integration</h4>
          <p class="mt-2 text-sm text-zinc-700">Converted and integrated HL7 data into SQL Server for pharmacy operations (OnePoint Patient Care). Reliable, auditable pipelines.</p>
        </div>
        <div class="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 class="font-semibold">PostgreSQL Lab</h4>
          <p class="mt-2 text-sm text-zinc-700">Debian/Ubuntu VM lab experimenting with pgAdmin, containerization, and index/plan behavior—groundwork for cross‑platform automation.</p>
        </div>
      </div>
    </section>
    <!-- Writing -->
    <section id="writing" class="bg-white border-y border-zinc-200">
      <div class="max-w-6xl mx-auto px-4 py-12">
        <h3 class="text-2xl font-bold">Writing & Talks</h3>
        <ul class="mt-4 space-y-3 text-sm text-zinc-700">
          <li>• <span class="font-semibold">Azure: Operator vs. Mechanic</span> — reflections on automation limits and performance truth‑seeking. <em>(draft)</em></li>
          <li>• <span class="font-semibold">The Buffet of Buzzwords</span> — calling out bloated job descriptions for Senior DBAs. <em>(draft)</em></li>
          <li>• <span class="font-semibold">Output Params vs. Result Sets</span> — stored procedure design trade‑offs. <em>(draft)</em></li>
        </ul>
      </div>
    </section>
    <!-- Contact -->
    <section id="contact" class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="md:col-span-2">
          <h3 class="text-2xl font-bold">Contact</h3>
          <p class="mt-2 text-zinc-700">Best way to reach me: email or LinkedIn DM.</p>
          <div class="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <button id="copyEmail" class="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-zinc-300 hover:bg-zinc-100">Copy Email</button>
            <a class="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-zinc-300 hover:bg-zinc-100" href="mailto:michaelshawnlockwood@gmail.com">michaelshawnlockwood@gmail.com</a>
            <a class="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-zinc-300 hover:bg-zinc-100" href="https://www.linkedin.com/in/mslockwood" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </div>
        <aside class="rounded-2xl border border-zinc-200 bg-white p-5">
          <h4 class="font-semibold">Resume</h4>
          <p class="mt-2 text-sm text-zinc-700">Condensed Reaume</p>
          <a id="resume" class="mt-3 inline-block text-sm font-semibold underline" href="https://github.com/michaelshawnlockwood/MyResume/raw/main/MichaelLockwood_CondensedResume.pdf">Click to download Condensed Resume</a>
        </aside>
      </div>
    </section>
    <footer class="border-t border-zinc-200 py-10 text-center text-xs text-zinc-500">
      <p>© <span id="y"></span> Michael Shawn Lockwood • Built with GitHub Pages • Theme: minimalist Tailwind</p>
    </footer>
  </main>

  <script>
    // Year
    document.getElementById('y').textContent = new Date().getFullYear();
    // Copy email
    document.getElementById('copyEmail').addEventListener('click', () => {
      navigator.clipboard.writeText('michaelshawnlockwood@gmail.com');
      const btn = document.getElementById('copyEmail');
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = 'Copy Email'), 1600);
    });
  </script>
