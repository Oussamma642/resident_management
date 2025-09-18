import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'

function GuestLayout() {

  const { token } = useStateContext();
  const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate("/dashboard");
            return;
        }
    }, [token]);

  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default GuestLayout
