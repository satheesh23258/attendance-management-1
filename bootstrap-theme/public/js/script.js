document.addEventListener('DOMContentLoaded', () => {
  // Password Toggle Functionality
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      const icon = this.querySelector('i');
      
      if (passwordInput && passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
      } else if (passwordInput) {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
      }
    });
  });

  // Password Strength Check
  const checkPwdStrength = (pwd) => {
    if (!pwd) return "Empty";
    if (pwd.length < 6) return "Weak";
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "Strong";
    return "Medium";
  };

  const regPwd = document.getElementById('reg-password');
  const pwdText = document.getElementById('pwd-strength-text');
  if (regPwd && pwdText) {
    regPwd.addEventListener('input', (e) => {
      pwdText.textContent = checkPwdStrength(e.target.value);
    });
  }

  const newPwd = document.getElementById('newPassword');
  const newPwdText = document.getElementById('pwd-strength-text');
  if (newPwd && newPwdText) {
    newPwd.addEventListener('input', (e) => {
      newPwdText.textContent = checkPwdStrength(e.target.value);
    });
  }

  // Generic Alert Helper
  const showAlert = (containerId, msgId, iconId, msg, isError) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const msgEl = document.getElementById(msgId);
    const iconEl = document.getElementById(iconId);
    
    container.classList.remove('d-none', 'alert-danger', 'alert-success');
    container.classList.add(isError ? 'alert-danger' : 'alert-success');
    
    // Maintain 3 colors: we overrule bootstrap default alert colors by overriding styles inline
    container.style.backgroundColor = isError ? '#ffffff' : '#1B5E20';
    container.style.color = isError ? '#000000' : '#ffffff';
    container.style.border = isError ? '2px solid #000000' : '2px solid #1B5E20';
    
    msgEl.textContent = msg;
    iconEl.className = 'me-2 bi ' + (isError ? 'bi-exclamation-triangle' : 'bi-check-circle');
    
    setTimeout(() => {
      container.classList.add('d-none');
    }, 5000);
  };

  // Auth Routing & Logic
  const apiBase = '/api';
  
  // Guard Routes
  const isAuthPage = window.location.pathname.includes('login.html');
  const isProtectedPage = window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('settings.html');

  if (isProtectedPage || isAuthPage) {
    fetch(`${apiBase}/auth/me`)
      .then(res => res.json())
      .then(data => {
        if (data.success && isAuthPage) {
          window.location.href = 'dashboard.html';
        } else if (!data.success && isProtectedPage) {
          window.location.href = 'login.html';
        } else if (data.success) {
          initProtectedPage(data.data);
        }
      })
      .catch(err => {
        if (isProtectedPage) window.location.href = 'login.html';
      });
  }

  // --- LOGIN PAGE ---
  if (isAuthPage) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showReg = document.getElementById('show-register');
    const showLog = document.getElementById('show-login');
    const emailInput = document.getElementById('login-email');
    const rememberMe = document.getElementById('remember-me');

    // Load remembered email
    if (localStorage.getItem('rememberedEmail')) {
      emailInput.value = localStorage.getItem('rememberedEmail');
      rememberMe.checked = true;
    }

    showReg.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-container').classList.add('d-none');
      document.getElementById('register-container').classList.remove('d-none');
    });

    showLog.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('register-container').classList.add('d-none');
      document.getElementById('login-container').classList.remove('d-none');
    });

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value;
      const pwd = document.getElementById('login-password').value;

      if (!document.getElementById('login-password').checkValidity()) {
        showAlert('auth-alert', 'auth-alert-msg', 'auth-alert-icon', 'Password must be min 6 characters', true);
        return;
      }

      try {
        const res = await fetch(`${apiBase}/auth/login`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email, password: pwd })
        });
        const data = await res.json();
        if (data.success) {
          if (rememberMe.checked) {
            localStorage.setItem('rememberedEmail', email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
          window.location.href = 'dashboard.html';
        } else {
          showAlert('auth-alert', 'auth-alert-msg', 'auth-alert-icon', data.error, true);
        }
      } catch (err) {
        showAlert('auth-alert', 'auth-alert-msg', 'auth-alert-icon', 'Server Error', true);
      }
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const pwd = document.getElementById('reg-password').value;

      if (!document.getElementById('reg-password').checkValidity()) {
        showAlert('auth-alert', 'auth-alert-msg', 'auth-alert-icon', 'Password must be min 6 characters', true);
        return;
      }

      try {
        const res = await fetch(`${apiBase}/auth/register`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ name, email, password: pwd })
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = 'dashboard.html';
        } else {
          showAlert('auth-alert', 'auth-alert-msg', 'auth-alert-icon', data.error, true);
        }
      } catch (err) {
        showAlert('auth-alert', 'auth-alert-msg', 'auth-alert-icon', 'Server Error', true);
      }
    });
  }

  // --- PROTECTED PAGES (DASHBOARD & SETTINGS) ---
  function initProtectedPage(user) {
    const welcomeMsg = document.getElementById('welcome-msg');
    if (welcomeMsg) welcomeMsg.textContent = `Welcome, ${user.name}`;
    
    // Log out logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await fetch(`${apiBase}/auth/logout`);
        window.location.href = 'login.html';
      });
    }

    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard(user);
    }

    if (window.location.pathname.includes('settings.html')) {
        initSettings(user);
    }
  }

  function initDashboard(user) {
    let currentTasks = [];
    
    const fetchTasks = async () => {
      const loader = document.getElementById('table-loader');
      const tableBody = document.getElementById('table-body');
      loader.classList.remove('d-none');
      tableBody.innerHTML = '';
      
      try {
        const res = await fetch(`${apiBase}/tasks`);
        const data = await res.json();
        loader.classList.add('d-none');
        if (data.success) {
          currentTasks = data.data;
          renderTable(currentTasks);
          // Counter update
          const c = document.getElementById('total-items-count');
          if (c) runCounterAnim(c, data.count);
        }
      } catch (err) {
        console.error("Error fetching tasks");
      }
    };

    const renderTable = (tasks) => {
      const tableBody = document.getElementById('table-body');
      tableBody.innerHTML = '';
      if (tasks.length === 0) {
        document.getElementById('no-data-msg').classList.remove('d-none');
      } else {
        document.getElementById('no-data-msg').classList.add('d-none');
        tasks.forEach(t => {
          const formattedDate = new Date(t.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'});
          tableBody.innerHTML += `
            <tr>
              <td class="fw-bold">${t._id.slice(-4)}</td>
              <td class="fw-bold"><i class="bi bi-person icon"></i>${t.userName}</td>
              <td class="fw-bold">${t.actionName}</td>
              <td class="fw-bold">${formattedDate}</td>
              <td class="text-end">
                <button class="btn btn-sm fw-bold me-1" onclick="editTask('${t._id}', '${t.actionName.replace(/'/g, "\\'")}')" style="border: 1px solid #1B5E20; color: #1B5E20; background: white;"><i class="bi bi-pencil m-0"></i></button>
                <button class="btn btn-sm btn-primary fw-bold" onclick="deleteTask('${t._id}')"><i class="bi bi-trash icon m-0 text-white"></i></button>
              </td>
            </tr>
          `;
        });
      }
    };

    // Filter Logic
    const searchInput = document.getElementById('table-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = currentTasks.filter(t => t.actionName.toLowerCase().includes(query) || t.userName.toLowerCase().includes(query));
        renderTable(filtered);
      });
    }

    // Modal Logic
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    if (saveTaskBtn) {
      saveTaskBtn.addEventListener('click', async () => {
        const id = document.getElementById('taskId').value;
        const actionName = document.getElementById('taskName').value;
        if (!actionName) return;

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiBase}/tasks/${id}` : `${apiBase}/tasks`;

        try {
          await fetch(url, {
            method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ actionName })
          });
          const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
          if (modal) modal.hide();
          fetchTasks();
        } catch (err) {
            console.error(err);
        }
      });
    }

    // Attach globals for inline onclick
    window.editTask = (id, name) => {
      document.getElementById('taskId').value = id;
      document.getElementById('taskName').value = name;
      new bootstrap.Modal(document.getElementById('taskModal')).show();
    };

    window.deleteTask = async (id) => {
      if(confirm('Are you sure you want to delete this item?')) {
        await fetch(`${apiBase}/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
      }
    };

    window.openAddTaskModal = () => {
      document.getElementById('taskId').value = '';
      document.getElementById('taskName').value = '';
    }

    // Start counters
    const counters = document.querySelectorAll('.counter-anim');
    counters.forEach(c => {
      if (!c.id) runCounterAnim(c, parseInt(c.getAttribute('data-target')||0)); // Run for static targets
    });

    fetchTasks();
  }

  function runCounterAnim(elem, target) {
    if(!elem) return;
    let count = parseInt(elem.innerText);
    const inc = target / 20; 
    if (count < target) {
      const update = () => {
        count += inc;
        if (count < target) {
          elem.innerText = Math.ceil(count);
          setTimeout(update, 20);
        } else {
          elem.innerText = target;
        }
      };
      update();
    } else {
      elem.innerText = target;
    }
  }

  function initSettings(user) {
    document.getElementById('profile-name').value = user.name;
    document.getElementById('profile-email').value = user.email;
    document.getElementById('notificationToggle').checked = user.notificationsEnabled !== false;

    // Profile form
    document.getElementById('profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('profile-name').value;
      const notif = document.getElementById('notificationToggle').checked;
      
      try {
        const res = await fetch(`${apiBase}/auth/update`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ name: newName, notificationsEnabled: notif })
        });
        const data = await res.json();
        if(data.success) {
           showAlert('settings-alert', 'settings-alert-msg', 'settings-alert-icon', 'Profile updated!', false);
        }
      } catch(err) {}
    });

    // Password form
    document.getElementById('password-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById('oldPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if(newPassword !== confirmPassword) {
        document.getElementById('pwd-match').textContent = "Passwords do not match!";
        document.getElementById('pwd-match').classList.add('text-danger'); // This is standard utility, but user said no extra colors!
        // We will just use black
        document.getElementById('pwd-match').style.color = '#000000';
        return;
      }

      if (!document.getElementById('newPassword').checkValidity()) {
        showAlert('settings-alert', 'settings-alert-msg', 'settings-alert-icon', 'Password must be min 6 characters', true);
        return;
      }

      try {
        const res = await fetch(`${apiBase}/auth/updatepassword`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await res.json();
        if(data.success) {
           document.getElementById('password-form').reset();
           document.getElementById('pwd-match').textContent = "";
           showAlert('settings-alert', 'settings-alert-msg', 'settings-alert-icon', 'Password updated!', false);
        } else {
           showAlert('settings-alert', 'settings-alert-msg', 'settings-alert-icon', data.error, true);
        }
      } catch(err) {}
    });

    // Delete Account
    document.getElementById('confirmDeleteAccountBtn').addEventListener('click', async () => {
      try {
        const res = await fetch(`${apiBase}/auth/delete`, { method: 'DELETE' });
        if(res.ok) {
           window.location.href = 'login.html';
        }
      } catch (err) {}
    });
  }

});
