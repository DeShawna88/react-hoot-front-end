// src/App.jsx
// Import useContext
import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router'; // Import React Router
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
// Import the UserContext
import { UserContext } from './contexts/UserContext';
import HootList from './components/HootList/HootList';
import * as hootService from './services/hootService';
import HootDetails from './components/HootDetails/HootDetails';
import HootForm from './components/HootForm/HootForm';


const App = () => {
  const { user } = useContext(UserContext);
  const [hoots, setHoots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();

      // update to set state:
      setHoots(hootsData);
    };
    if (user) fetchAllHoots();
  }, [user]);

  const handleAddHoot = async (hootFormData) => {
    const newHoot = await hootService.create(hootFormData);
    setHoots([newHoot, ...hoots]);
    navigate('/hoots');
  };

  const handleDeleteHoot = async (hootId) => {
    const deletedHoot = await hootService.deleteHoot(hootId);
    setHoots(hoots.filter((hoot) => hoot._id !== deletedHoot._id));
    navigate('/hoots');
  };

  const handleUpdateHoot = async (hootId, hootFormData) => {
    const updatedHoot = await hootService.update(hootId, hootFormData);
    setHoots(hoots.map((hoot) => (hootId === hoot._id ? updatedHoot : hoot)));
    navigate(`/hoots/${hootId}`);
  };

  const handleDeleteComment = async (hootId, commentId) => {
    try {
      await hootService.deleteComment(hootId, commentId); // Ensure backend deletes it
      setHoots(prevHoots =>
        prevHoots.map(hoot =>
          hoot._id === hootId
            ? { ...hoot, comments: hoot.comments.filter(comment => comment._id !== commentId) }
            : hoot
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            {/* Protected routes (available only to signed-in users) */}
            <Route path='/hoots' element={<HootList hoots={hoots} />} />
            <Route
              path='/hoots/:hootId'
              element={<HootDetails handleDeleteHoot={handleDeleteHoot} handleDeleteComment={handleDeleteComment} />}
            />
            <Route
              path='/hoots/:hootId/comments/:commentId'
              element={<HootDetails handleDeleteComment={handleDeleteComment} />} />
            {/* <Route path='/hoots/new' element={<h1>New Hoot</h1>} /> */}
            <Route
              path='/hoots/new'
              element={<HootForm handleAddHoot={handleAddHoot} />}
            />
            <Route
              path='/hoots/:hootId/edit'
              element={<HootForm handleUpdateHoot={handleUpdateHoot} />}
            />
          </>
        ) : (
          <>
            {/* Non-user routes (available only to guests) */}
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;

