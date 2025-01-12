import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ClipLoader } from "react-spinners";

const host = import.meta.env.VITE_API_URL;

const theme = createTheme();

const Dashboard = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${host}/users`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				});
				const data = response.data;
				setUsers(
					data?.data.map((user) => ({
						id: user._id,
						...user,
					}))
				);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching users:", error);
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	const columns = [
		{ field: "email", headerName: "Email", flex: 1 },
		{
			field: "createdAt",
			headerName: "Registered On",
			flex: 1,
			valueGetter: (params) => {
				return new Date(params);
			},
			valueFormatter: (params) => {
				const options = {
					year: "numeric",
					month: "long",
					day: "numeric",
				};
				return params?.toLocaleDateString(undefined, options);
			},
		},
	];

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<ClipLoader color="#4F46E5" size={50} />
			</div>
		);
	}

	return (
		<ThemeProvider theme={theme}>
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					className="text-gray-900 font-bold text-center"
				>
					Dashboard
				</Typography>
				<Paper elevation={3} className="overflow-hidden">
					<div style={{ height: 400, width: "100%" }}>
						<DataGrid
							rows={users}
							columns={columns}
							pageSize={10}
							rowsPerPageOptions={[5, 10, 20]}
							disableSelectionOnClick
							disableRowSelectionOnClick
						/>
					</div>
				</Paper>
			</div>
		</ThemeProvider>
	);
};

export default Dashboard;
