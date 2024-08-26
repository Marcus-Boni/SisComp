import { Toaster } from 'react-hot-toast';
import { router } from './routes/index.routes';
import { RouterProvider } from 'react-router-dom';
/* import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from 'react'; */
import { AuthProvider } from './context/AuthProvider';

function App() {
  /*  useEffect(() => {
    const createAdmin = async () => {
      const adminEmail = 'admin@admin.com';
      const adminPassword = 'StrongPassword123';

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          adminEmail,
          adminPassword
        );
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          email: adminEmail,
          role: 'administrador'
        });

        console.log('Administrador criado com sucesso');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log('O administrador já existe.');
        } else {
          console.error('Erro ao criar o administrador:', error);
        }
      }
    };

    createAdmin();
  }, []); 
    Caso necessite de uma função que crie um usuário administrador no Firebase, descomente o trecho de código acima. */

  return (
    <>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
