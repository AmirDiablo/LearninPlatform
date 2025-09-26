import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext()

export const UserProvider = ({ children })=> {
    const [user, setUser] = useState()
    const [userId, setUserId] = useState(null)
    const [followings, setFollowings] = useState([])


    const updateProfile = (obj)=> {
        setUser([obj])
    }

    const login = (value)=> {
        setUserId(value)
    }

    const logout = ()=> {
        localStorage.removeItem("user")
        setUser(null)
        setUserId(null)
    }


    useEffect(()=> {
        const user = JSON.parse(localStorage.getItem('user'))

        const fetchUser = async (id)=> {
            const response = await fetch("http://localhost:3000/api/user/userInfo?q="+id)
            const json = await response.json()

            if(response.ok) {
                setUser({token: user.token, userInfo: json})
            }
        }

        if (user) {
            fetchUser(user.id)
        }

    }, [ ,userId])

    console.log("user from context: ", user);
    
    return (
        <UserContext.Provider value={{user, setUser, login, updateProfile, logout}}>
            {children}
        </UserContext.Provider>
    )
}

//hook
export const useUser = ()=> {
    return useContext(UserContext)
}