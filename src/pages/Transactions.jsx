import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
	Typography,
	Paper,
	Button,
	Modal,
	TextField,
	Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ClipLoader } from "react-spinners";

const host = import.meta.env.VITE_API_URL;

const theme = createTheme();

const TransactionsTable = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [rejectionComment, setRejectionComment] = useState("");

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const response = await axios.get(`${host}/transactions/all`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				});
				const data = response.data;
				setTransactions(
					data?.data.map((transaction) => ({
						id: transaction._id,
						...transaction,
						email: transaction.user.email,
					}))
				);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching transactions:", error);
				setLoading(false);
			}
		};

		fetchTransactions();
	}, []);

	const handleAccept = (id) => {
		setTransactions(
			transactions.map((t) =>
				t.id === id ? { ...t, status: "accepted" } : t
			)
		);
	};

	const handleDeny = (transaction) => {
		setSelectedTransaction(transaction);
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setSelectedTransaction(null);
		setRejectionComment("");
	};

	const handleRejectionSubmit = () => {
		setTransactions(
			transactions.map((t) =>
				t.id === selectedTransaction.id
					? {
							...t,
							status: "denied",
							rejectionReason: rejectionComment,
					  }
					: t
			)
		);
		handleModalClose();
	};

	const columns = [
		{ field: "email", headerName: "Email", flex: 1, minWidth: 200 },
		{ field: "amount", headerName: "Amount", flex: 1, minWidth: 120 },
		{
			field: "transactionId",
			headerName: "Transaction ID",
			flex: 1,
			minWidth: 200,
		},
		{
			field: "createdAt",
			headerName: "Initiated At",
			flex: 1,
			minWidth: 200,
			valueGetter: (params) => new Date(params),
			valueFormatter: (params) => {
				const options = {
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				};
				return params?.toLocaleString(undefined, options);
			},
		},
		{
			field: "actions",
			headerName: "Actions",
			flex: 1,
			minWidth: 200,
			renderCell: (params) => (
				<div>
					<Button
						variant="contained"
						color="primary"
						size="small"
						onClick={() => handleAccept(params.row.id)}
						disabled={params.row.status !== "PENDING"}
						style={{ marginRight: "8px" }}
					>
						{params.row.status === "accepted"
							? "Accepted"
							: "Accept"}
					</Button>
					<Button
						variant="contained"
						color="secondary"
						size="small"
						onClick={() => handleDeny(params.row)}
						disabled={params.row.status !== "PENDING"}
					>
						{params.row.status === "denied" ? "Denied" : "Deny"}
					</Button>
				</div>
			),
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
			<div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					className="text-gray-900 font-bold text-center"
				>
					Transactions
				</Typography>
				<Paper elevation={3} className="overflow-hidden">
					<div
						style={{
							height: 400,
							width: "100%",
							overflowX: "auto",
						}}
					>
						<div style={{ minWidth: "1000px", height: "100%" }}>
							<DataGrid
								rows={transactions}
								columns={columns}
								pageSize={10}
								rowsPerPageOptions={[5, 10, 20]}
								disableSelectionOnClick
								disableRowSelectionOnClick
								components={{
									ColumnHeader: CustomHeader,
								}}
							/>
						</div>
					</div>
				</Paper>
			</div>
			<Modal
				open={modalOpen}
				onClose={handleModalClose}
				aria-labelledby="rejection-modal-title"
				aria-describedby="rejection-modal-description"
			>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "90%",
						maxWidth: 400,
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
					}}
				>
					<Typography
						id="rejection-modal-title"
						variant="h6"
						component="h2"
						gutterBottom
					>
						Reason for Rejection
					</Typography>
					<TextField
						id="rejection-comment"
						label="Comment"
						multiline
						rows={4}
						value={rejectionComment}
						onChange={(e) => setRejectionComment(e.target.value)}
						fullWidth
						margin="normal"
					/>
					<Button
						onClick={handleRejectionSubmit}
						variant="contained"
						color="primary"
						fullWidth
					>
						Submit
					</Button>
				</Box>
			</Modal>
		</ThemeProvider>
	);
};

const CustomHeader = (props) => {
	return (
		<div className="bg-gray-100 font-bold text-gray-800 p-2">
			{props.column.headerName}
		</div>
	);
};

export default TransactionsTable;
