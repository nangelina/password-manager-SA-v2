import React, { createContext } from 'react';

export const UserContext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = React.useState(null);

    return (
        <div>
            <UserContext.Provider value={{ user, setUser }}>
                {children}
            </UserContext.Provider>
        </div>
    );
}
export default UserProvider;
