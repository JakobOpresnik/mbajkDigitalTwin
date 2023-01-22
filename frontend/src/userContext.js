// using context to track whether a user is logged in or not
import { createContext } from 'react';

export const UserContext = createContext({
    user: null,
    setUserContext: () => {}
});