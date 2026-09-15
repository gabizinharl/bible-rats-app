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

const persistSupabaseConfig = () => {
  formMessage(
    'login-message',
    'Configuração do Supabase não foi definida no app. Ajuste a configuração no código antes de continuar.',
    'error'
  );
  formMessage(
    'signup-message',
    'Configuração do Supabase não foi definida no app. Ajuste a configuração no código antes de continuar.',
    'error'
  );
};

const getSupabaseClient = () => {
  const runtimeConfig = window.BIBLE_RATS_SUPABASE || {};
  const url = runtimeConfig.url || runtimeConfig.projectUrl || localStorage.getItem(SUPABASE_URL_KEY);
  const key = runtimeConfig.key || runtimeConfig.anonKey || localStorage.getItem(SUPABASE_KEY_KEY);

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
