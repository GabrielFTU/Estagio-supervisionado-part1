import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import useAuthStore from '../../stores/useAuthStore';
import './Login.css';

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

function Login() {
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.login);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setError
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
      try {
      const response = await authService.login(data.email, data.senha);
      
      setLogin(response.token, response.user); 
      navigate('/');
    } catch (error) {
      console.error("Erro no login", error);
      setError('root', { 
        message: 'Falha no login. Verifique suas credenciais.' 
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Valisys</h1>
        <h2>Acesso ao Sistema</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input 
              id="email" 
              type="email" 
              placeholder="exemplo@valisys.com"
              {...register('email')} 
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input 
              id="senha" 
              type="password" 
              placeholder="Sua senha"
              {...register('senha')} 
            />
            {errors.senha && <span className="error">{errors.senha.message}</span>}
          </div>

          {errors.root && <div className="alert-error">{errors.root.message}</div>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;