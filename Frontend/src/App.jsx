import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import { useState } from 'react';
import Alert from './components/Alert';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NotesSection from './components/NotesSection';
import RecycleBin from './components/RecycleBin';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToastProvider from './context/notification/ToastContext';
import Toast from './context/notification/Toast';
function App() {
  const [alert, setalert] = useState(null)
  return (
    <ToastProvider>
      <NoteState>
        <Router>
          <div>
            <Navbar></Navbar>
            <Toast />
            <div className="container">
              <Routes>
                <Route exact path="/" element={<Home/>}></Route>
                <Route exact path="/about" element={<About />}></Route>
                <Route exact path='/signup' element={<SignUp />}></Route>
                <Route exact path="/login" element={<Login/>}></Route>
                {/* <Route exact path="/dashBoard" element={<Dashboard/>}></Route> */}
                <Route exact path="/notesSection" element={<NotesSection/>}></Route>
                <Route exact path="/recyclebin" element={<RecycleBin/>}></Route>
              </Routes>
            </div>
          </div>
        </Router>
      </NoteState>
    </ToastProvider>
  );
}

export default App;
