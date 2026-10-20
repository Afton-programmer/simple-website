// Simple Website - Interactive Features
(function () {
  'use strict';

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      const icon = themeToggle.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    }
  }

  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active = root.getAttribute('data-theme') || 'light';
      applyTheme(active === 'dark' ? 'light' : 'dark');
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --- Mini Interactive Terminal ---
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  const commands = {
    help: () => `Available commands:
  • <span class="cmd">about</span>     - Who is GoLuxo?
  • <span class="cmd">projects</span>  - List featured repositories
  • <span class="cmd">skills</span>    - Technical stack
  • <span class="cmd">theme</span>     - Toggle light/dark mode
  • <span class="cmd">clear</span>     - Clear terminal history`,
    about: () => `GoLuxo: "Go Luxury, GoLuxo."
Independent developer focusing on systems programming, embedded firmware (C / ESP-IDF), web security tools, and clean software architectures.`,
    projects: () => `Featured Works:
  1. <a href="https://github.com/GoLuxo/EspXP" target="_blank" rel="noopener noreferrer">EspXP</a> - Windows XP-inspired OS for ESP32 in C
  2. <a href="https://github.com/GoLuxo/site-security-scanner" target="_blank" rel="noopener noreferrer">site-security-scanner</a> - Automated web security vulnerability auditor
  3. <a href="https://github.com/GoLuxo/simple-website" target="_blank" rel="noopener noreferrer">simple-website</a> - Modern, lightweight zero-build static site`,
    skills: () => `Languages & Tech:
  • C & Bare ESP-IDF / PlatformIO
  • Python & Security Auditing
  • Embedded Hardware (ESP32 CYD)
  • Modern Semantic Web Standards (HTML5, CSS3, Vanilla JS)`,
    theme: () => {
      const active = root.getAttribute('data-theme') || 'light';
      const next = active === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return `Theme switched to <strong>${next}</strong> mode.`;
    },
    clear: () => {
      if (terminalOutput) terminalOutput.innerHTML = '';
      return null;
    }
  };

  if (terminalInput && terminalOutput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';

        if (!raw) return;

        // Print input line
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt">visitor@goluxo:~$</span> <span class="user-cmd">${escapeHTML(raw)}</span>`;
        terminalOutput.appendChild(line);

        // Handle command
        const fn = commands[raw];
        if (fn) {
          const res = fn();
          if (res) {
            const respLine = document.createElement('div');
            respLine.className = 'terminal-response';
            respLine.innerHTML = res;
            terminalOutput.appendChild(respLine);
          }
        } else {
          const errLine = document.createElement('div');
          errLine.className = 'terminal-response error';
          errLine.innerHTML = `Command not found: <code>${escapeHTML(raw)}</code>. Type <span class="cmd">help</span> for available commands.`;
          terminalOutput.appendChild(errLine);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    });

    // Quick command chip clicks
    document.querySelectorAll('[data-term-cmd]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-term-cmd');
        terminalInput.value = cmd;
        terminalInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        terminalInput.focus();
      });
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
})();
