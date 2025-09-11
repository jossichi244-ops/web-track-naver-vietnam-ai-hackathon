import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Navbar from "../components/Navbar";
import TasksPage from "../pages/TasksPage";
import GroupsPage from "../pages/GroupsPage";
import GroupDetailPage from "../pages/GroupDetailPage";
import MyGroupsPage from "../pages/MyGroupsPage";
import GroupTasksPage from "../pages/GroupTasksPage";
import CommunityChallengePage from "../pages/CommunityChallengePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/task" element={<TasksPage />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/my-groups" element={<MyGroupsPage />} />
        <Route path="/groups/:groupId" element={<GroupDetailPage />} />
        <Route path="/groups/:groupId/tasks" element={<GroupTasksPage />} />
        <Route path="/challenges" element={<CommunityChallengePage />} />
      </Routes>
    </BrowserRouter>
  );
}
