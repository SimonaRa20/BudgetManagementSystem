
import { Link, Route, Routes } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";
import { nav } from "./navigation";


export const RenderRoutes = () => {

        const { user } = AuthData();
        
        return (
             <Routes>
             { nav.map((r, i) => {
                  
                  if (r.isPrivate && user.isAuthenticated) {
                       return <Route key={i} path={r.path} element={r.element}/>
                  } else if (!r.isPrivate) {
                       return <Route key={i} path={r.path} element={r.element}/>
                  } else return false
             })}
             
             </Routes>
        )
   }
   
   export const RenderMenu = () => {
   
        const { user, logout } = AuthData()
   
        const MenuItem = ({r}) => {
             return (
                  <div style={{margin:'5px'}} className="menuItem"><Link to={r.path} style={{color:'white', textDecoration:'none'}}>{r.name}</Link></div>
             )
        }
        return (
             <div className="menu" style={{display: 'flex', backgroundColor: 'black', justifyContent: 'center', padding: '10px'}}>
                  { nav.map((r, i) => {
   
                       if (!r.isPrivate && r.isMenu) {
                            return (
                                 <MenuItem key={i} r={r}/>
                            )
                       } else if (user.isAuthenticated && r.isMenu) {
                            return (
                                 <MenuItem key={i} r={r}/>
                            )
                       } else return false
                  } )}
   
                  { user.isAuthenticated ?
                  <div className="menuItem" style={{margin:'5px'}}><Link to={'#'} style={{color:'white', textDecoration:'none'}} onClick={logout}>Log out</Link></div>
                  :
                  <>
                    <div className="menuItem" style={{margin:'5px'}}><Link to={'login'} style={{color:'white', textDecoration:'none'}}>Log in</Link></div>
                    <div className="menuItem" style={{margin:'5px'}}><Link to={'register'} style={{color:'white', textDecoration:'none'}}>Register</Link></div>
                  </>
                  
                }
             </div>
        )
   }