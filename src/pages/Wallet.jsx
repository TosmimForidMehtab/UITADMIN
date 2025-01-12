import React, { useState } from "react";
import { Typography, TextField, Button, Paper, Grid, Box } from "@mui/material";

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

	const handleChange = (field) => (event) => {
		setWalletData({ ...walletData, [field]: event.target.value });
	};

	const handleSave = () => {
		setIsEditing(false);
		console.log("Saving wallet data:", walletData);
	};

	const handleSaveUPI = () => {
		setIsEditingUPI(false);
		console.log("Saving UPI ID:", walletData.upiId);
	};

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
				{["field1", "field2", "field3", "field4"].map((field) => (
					<Grid item xs={12} sm={6} key={field}>
						<TextField
							fullWidth
							label={`Field ${field.slice(-1)}`}
							value={walletData[field]}
							onChange={handleChange(field)}
							disabled={!isEditing}
						/>
					</Grid>
				))}
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
					value={walletData.upiId}
					onChange={handleChange("upiId")}
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
