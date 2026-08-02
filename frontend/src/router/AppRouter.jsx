import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ParticipantDashboard from '../pages/participant/ParticipantDashboard';
import JudgeDashboard from '../pages/judge/JudgeDashboard';
import DashboardLayout from '../layouts/DashboardLayout';

// Admin Pages
import HackathonList from '../pages/admin/HackathonList';
import CreateHackathon from '../pages/admin/CreateHackathon';
import EditHackathon from '../pages/admin/EditHackathon';
import HackathonDetail from '../pages/admin/HackathonDetail';
import AdminJudges from '../pages/admin/AdminJudges';
import Leaderboard from '../pages/admin/Leaderboard';
import AdminParticipants from '../pages/admin/AdminParticipants';
import AdminTeams from '../pages/admin/AdminTeams';
import AdminProjects from '../pages/admin/AdminProjects';

// Participant Pages
import ParticipantHackathons from '../pages/participant/ParticipantHackathons';
import ParticipantTeam from '../pages/participant/ParticipantTeam';
import ParticipantProject from '../pages/participant/ParticipantProject';
import ParticipantProfile from '../pages/participant/ParticipantProfile';

// Judge Pages
import JudgeProjects from '../pages/judge/JudgeProjects';
import JudgeEvaluation from '../pages/judge/JudgeEvaluation';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="hackathons" element={<HackathonList />} />
            <Route path="hackathons/create" element={<CreateHackathon />} />
            <Route path="hackathons/:id/edit" element={<EditHackathon />} />
            <Route path="hackathons/:id" element={<HackathonDetail />} />
            <Route path="judges" element={<AdminJudges />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="participants" element={<AdminParticipants />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="projects" element={<AdminProjects />} />
          </Route>

          {/* Participant Routes */}
          <Route
            path="/participant"
            element={
              <ProtectedRoute allowedRoles={['PARTICIPANT']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ParticipantDashboard />} />
            <Route path="hackathons" element={<ParticipantHackathons />} />
            <Route path="hackathons/:id" element={<HackathonDetail />} />
            <Route path="team" element={<ParticipantTeam />} />
            <Route path="project" element={<ParticipantProject />} />
            <Route path="results" element={<Leaderboard />} />
            <Route path="profile" element={<ParticipantProfile />} />
          </Route>

          {/* Judge Routes */}
          <Route
            path="/judge"
            element={
              <ProtectedRoute allowedRoles={['JUDGE']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<JudgeDashboard />} />
            <Route path="projects" element={<JudgeProjects />} />
            <Route path="evaluate/:projectId" element={<JudgeEvaluation />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
