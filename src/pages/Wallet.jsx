import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Paper, Grid, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
const host = import.meta.env.VITE_API_URL;

const Wallet = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [isEditingUPI, setIsEditingUPI] = useState(false);
	const [walletData, setWalletData] = useState({
		field1: "100",
		field2: "500",
		field3: "1000",
		field4: "2000",
		upiId: "test@upi",
	});
	const [denominations, setDenominations] = useState({
		field1: {},
		field2: {},
		field3: {},
		field4: {},
	});
	const [upi, setUpi] = useState("");

	const handleChange = (field) => (event) => {
		setDenominations({
			...denominations,
			[field]: { ...denominations[field], amount: event.target.value },
		});
	};
	const handleUpiChange = (event) => {
		setUpi(event.target.value);
	};

	const handleSave = async () => {
		try {
			setIsEditing(false);
			const updateDenomination = async (field) => {
				return axios.patch(
					`${host}/wallet/denominations`,
					{
						id: denominations?.[field]?._id,
						amount: denominations?.[field]?.amount,
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);
			};

			const responses = await Promise.all([
				updateDenomination("field1"),
				updateDenomination("field2"),
				updateDenomination("field3"),
				updateDenomination("field4"),
			]);
			toast.success("Amount saved successfully");
			await fetchDenominations();
		} catch (error) {
			console.error("Error saving wallet:", error);
			toast.error("Error saving wallet");
		}
	};

	const handleSaveUPI = async () => {
		try {
			setIsEditingUPI(false);
			const response = await axios.post(
				`${host}/wallet/upi`,
				{ upiId: upi },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			toast.success("UPI ID saved successfully");
			await fetchUpi();
		} catch (error) {
			console.error("Error saving wallet:", error);
			toast.error("Error saving wallet");
		}
	};

	const fetchUpi = async () => {
		try {
			const response = await axios.get(`${host}/wallet/upi`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			const { data } = response.data;
			setUpi(data?.upiId || "");
		} catch (error) {
			console.error("Error fetching wallet:", error);
		}
	};

	const fetchDenominations = async () => {
		try {
			const response = await axios.get(`${host}/wallet/denominations`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			let { data } = response.data;
			data = data?.sort((a, b) => a.amount - b.amount);
			setDenominations({
				field1:
					data?.length > 0
						? { amount: data[0].amount, _id: data[0]._id }
						: {},
				field2:
					data?.length > 1
						? { amount: data[1].amount, _id: data[1]._id }
						: {},
				field3:
					data?.length > 2
						? { amount: data[2].amount, _id: data[2]._id }
						: {},
				field4:
					data?.length > 3
						? { amount: data[3].amount, _id: data[3]._id }
						: {},
			});
		} catch (error) {
			console.error("Error fetching wallet:", error);
		}
	};
	useEffect(() => {
		fetchUpi();
		fetchDenominations();
	}, []);

	return (
		<Paper elevation={3} className="p-6">
			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				className="mb-4 text-center"
			>
				Wallet
			</Typography>
			<Grid container spacing={3}>
				{["field1", "field2", "field3", "field4"].map(
					(field, index) => (
						<Grid item xs={12} sm={6} key={field}>
							<TextField
								fullWidth
								label={`Field ${index + 1} Amount`}
								value={denominations[field].amount || ""}
								onChange={handleChange(field)}
								disabled={!isEditing}
							/>
						</Grid>
					)
				)}
			</Grid>
			<Box mt={3}>
				<Button
					variant="contained"
					color="primary"
					onClick={() =>
						isEditing ? handleSave() : setIsEditing(true)
					}
				>
					{isEditing ? "Save" : "Configure Amount"}
				</Button>
			</Box>
			<Box mt={4}>
				<TextField
					fullWidth
					label="UPI ID"
					value={upi}
					onChange={handleUpiChange}
					disabled={!isEditingUPI}
				/>
			</Box>
			<Box mt={2}>
				<Button
					variant="contained"
					color="primary"
					onClick={() =>
						isEditingUPI ? handleSaveUPI() : setIsEditingUPI(true)
					}
				>
					{isEditingUPI ? "Save UPI ID" : "Configure UPI ID"}
				</Button>
			</Box>
		</Paper>
	);
};

export default Wallet;
