// src/components/NavBar/NavBar.jsx
// Import the useContext hook
import { useContext } from 'react';
import { Link } from 'react-router';
// Import the UserContext object
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  // Get the setUser function from the UserContext
  const { user, setUser } = useContext(UserContext);

  // Add the handleSignOut function
  const handleSignOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Clear the user state
    setUser(null);
  };

  return (
    <nav>
      {user ? (
        <ul>
          <li>Welcome, {user.username}</li>
          <li><Link to='/'>HOME</Link></li>
          <li><Link to='/hoots'>HOOTS</Link></li>
          <li><Link to='/hoots/new'>NEW HOOT</Link></li>
          <li><Link to='/'onClick={handleSignOut}>SIGN OUT</Link></li>
        </ul>
      ) : (
        <ul>
           {/* Another new link */}
          <li><Link to='/'>HOME</Link></li>
          <li><Link to='/sign-in'>SIGN IN</Link></li>
          <li><Link to='/sign-up'>SIGN UP</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;

