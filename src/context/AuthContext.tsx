import { useIsSignedIn } from "hooks/microsoft";
import { createContext, useState } from "react";


const AuthContext = createContext<any>({})

export default AuthContext;

export const AuthProvider = ({children}: {children: any}) => {

  const [isSignedIn] = useIsSignedIn();

  const [isAuth, setIsAuth] = useState<boolean>(isSignedIn);
  const [fullAccess, setFullAccess] = useState<boolean>(false);

  let contextData = {
    fullAccess,
    setFullAccess,
    isAuth,
    setIsAuth
  }

  return(
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  )
}