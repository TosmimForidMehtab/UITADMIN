import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import TransactionsTable from "./pages/Transactions";
import Wallet from "./pages/Wallet";
import Plans from "./components/Plans";

const ProtectedRoute = ({ children, adminOnly = false }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!user || (adminOnly && user.role !== "ADMIN")) {
		return <Navigate to="/signin" replace />;
	}

	return children;
};

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Layout>
					<Routes>
						<Route
							path="/"
							element={
								<ProtectedRoute adminOnly>
									<Plans />
								</ProtectedRoute>
							}
						/>
						<Route path="/signin" element={<SignIn />} />
						<Route path="/signup" element={<SignUp />} />
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute adminOnly>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/transactions"
							element={
								<ProtectedRoute adminOnly>
									<TransactionsTable />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/wallet"
							element={
								<ProtectedRoute adminOnly>
									<Wallet />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</Layout>
			</Router>
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar={false}
			/>
		</AuthProvider>
	);
};

export default App;
