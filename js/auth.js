const SUPABASE_URL_KEY = 'supabase_url';
const SUPABASE_KEY_KEY = 'supabase_anon_key';

const formMessage = (elementId, message, type = '') => {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.remove('error', 'success');

  if (type) {
    element.classList.add(type);
  }
};

const createDemoSession = () => {
  const demoSession = {
    user: {
      id: 'demo-user',
      email: 'demo@christiangym.app',
      full_name: 'Usuário Demo',
      username: 'demo_user'
    }
  };

  localStorage.setItem('christian_gym_demo', 'true');
  localStorage.setItem('christian_gym_session', JSON.stringify(demoSession));
  return demoSession;
};

const persistSupabaseConfig = () => {
  const url = prompt('Informe a URL do Supabase:', localStorage.getItem(SUPABASE_URL_KEY) || '');
  const key = prompt('Informe a anon key do Supabase:', localStorage.getItem(SUPABASE_KEY_KEY) || '');

  if (url && key) {
    localStorage.setItem(SUPABASE_URL_KEY, url);
    localStorage.setItem(SUPABASE_KEY_KEY, key);
    formMessage('login-message', 'Configuração do Supabase salva localmente.', 'success');
    formMessage('signup-message', 'Configuração do Supabase salva localmente.', 'success');
  }
};

const getSupabaseClient = () => {
  const url = localStorage.getItem(SUPABASE_URL_KEY);
  const key = localStorage.getItem(SUPABASE_KEY_KEY);

  if (!url || !key || !window.supabase) {
    return null;
  }

  return window.supabase.createClient(url, key);
};

const showLoginState = () => {
  const session = JSON.parse(localStorage.getItem('christian_gym_session') || '{}');

  if (session.user) {
    window.location.href = './app.html';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  showLoginState();

  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const demoLoginButton = document.getElementById('demo-login-button');

  if (demoLoginButton) {
    demoLoginButton.addEventListener('click', () => {
      createDemoSession();
      formMessage('login-message', 'Entrando no modo demo...', 'success');
      setTimeout(() => window.location.href = './app.html', 300);
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      const supabase = getSupabaseClient();

      if (!supabase) {
        formMessage('login-message', 'Configure a URL e a anon key do Supabase para usar autenticação real.', 'error');
        persistSupabaseConfig();
        return;
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          throw error;
        }

        const session = {
          user: {
            id: data.user?.id,
            email: data.user?.email,
            full_name: data.user?.user_metadata?.full_name || 'Usuário',
            username: data.user?.user_metadata?.username || 'usuario'
          }
        };

        localStorage.removeItem('christian_gym_demo');
        localStorage.removeItem('christian_gym_progress');
        localStorage.setItem('christian_gym_session', JSON.stringify(session));
        formMessage('login-message', 'Login realizado com sucesso.', 'success');
        setTimeout(() => window.location.href = './app.html', 500);
      } catch (error) {
        formMessage('login-message', error.message || 'Erro ao fazer login.', 'error');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const payload = {
        email: document.getElementById('signup-email').value.trim(),
        password: document.getElementById('signup-password').value.trim(),
        options: {
          data: {
            full_name: document.getElementById('signup-name').value.trim(),
            username: document.getElementById('signup-username').value.trim()
          }
        }
      };

      const supabase = getSupabaseClient();

      if (!supabase) {
        formMessage('signup-message', 'Configure a URL e a anon key do Supabase para usar autenticação real.', 'error');
        persistSupabaseConfig();
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp(payload);

        if (error) {
          throw error;
        }

        signupForm.reset();
        localStorage.removeItem('christian_gym_demo');
        localStorage.removeItem('christian_gym_progress');
        formMessage(
          'signup-message',
          'Cadastro realizado com sucesso. Verifique seu e-mail e confirme a conta antes de entrar no app.',
          'success'
        );
      } catch (error) {
        formMessage('signup-message', error.message || 'Erro ao realizar cadastro.', 'error');
      }
    });
  }
});

window.auth = {
  persistSupabaseConfig,
  getSupabaseClient,
  showLoginState
};
