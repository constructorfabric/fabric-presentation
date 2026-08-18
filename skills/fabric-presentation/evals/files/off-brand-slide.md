---
layout: fabric
title: Rollout status
---

# Rollout status

<div class="panels">
  <div class="panel">
    <div class="panel-head">Regions live</div>
    <p>EU and UK cut over in week 34. APAC follows in week 37.</p>
  </div>
  <div class="panel">
    <div class="panel-head">At risk</div>
    <p>The billing migration is waiting on a schema sign-off.</p>
  </div>
</div>

<div class="legend">
  <span class="dot ok"></span> done
  <span class="dot warn"></span> at risk
  <span class="dot late"></span> late
</div>

<style>
.panels { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

.panel {
  border: 1px solid #DCE3EE;
  border-radius: 0;
  padding: 20px;
}

/* a filled band heading sitting inside the panel it heads */
.panel-head {
  background: #FFF3CD;
  color: #111111;
  font-weight: 700;
  padding: 8px 14px;
  margin: -20px -20px 16px -20px;
}

.dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; }
.dot.ok   { background: #2E9E4F; }
.dot.warn { background: #E8B923; }
.dot.late { background: #D64545; }
</style>
