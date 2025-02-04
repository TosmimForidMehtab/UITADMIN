import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Card,
	CardContent,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Box,
	Chip,
	TextField,
	MenuItem,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const host = import.meta.env.VITE_API_URL;

const PlanCard = ({
	plan,
	onChoosePlan,
	isPopular,
	activePlan,
	setPlanToDelete,
	setOpenDeleteModal,
}) => (
	<motion.div
		whileHover={{ scale: 1.05 }}
		transition={{ type: "spring", stiffness: 100 }}
	>
		<Card
			className={`flex flex-col h-full shadow-lg rounded-lg overflow-hidden ${
				isPopular ? "border-2 border-indigo-500" : ""
			}`}
			elevation={isPopular ? 8 : 2}
		>
			<Box className="flex justify-center items-center">
				<Button
					label="Delete Plan"
					color="error"
					size="small"
					sx={{
						marginTop: 2,
						maxWidth: "20%",
						marginLeft: "5%",
					}}
					onClick={() => {
						setPlanToDelete(plan);
						setOpenDeleteModal(true);
					}}
					className="hover:bg-red-500 hover:text-white"
				>
					{<Delete />}
				</Button>

				<Chip
					label={plan.type}
					color="primary"
					variant="outlined"
					size="small"
					className="mt-3 w-[50%] mx-auto"
				/>
			</Box>

			<CardContent className="flex-grow flex flex-col justify-between p-6">
				<div>
					<div className="w-20 h-20 mx-auto mb-4">
						<img
							src={plan.logo || "/placeholder.svg"}
							alt={plan.name}
							className="w-full h-full object-cover rounded-full"
						/>
					</div>
					<Typography
						variant="h4"
						component="h2"
						className="font-bold text-center mb-4"
					>
						{plan.name}
					</Typography>
					<Typography
						variant="h3"
						component="p"
						className="text-center mb-4 text-indigo-600"
					>
						₹{plan.price}
						{plan.duration > 0 && (
							<Typography
								variant="subtitle1"
								component="span"
								className="text-gray-500"
							>
								/{plan.duration} day
								{plan.duration > 1 ? "s" : ""}
							</Typography>
						)}
					</Typography>
					<Typography
						variant="body1"
						className="text-center mb-6 text-gray-600"
					>
						{plan.description}
					</Typography>
					<div className="space-y-2 mb-6">
						<div className="flex justify-between">
							<span>Return Percentage:</span>
							<span className="font-semibold">
								{plan.returnPercentage}%
							</span>
						</div>
						<div className="flex justify-between">
							<span>Total Return Amount:</span>
							<span className="font-semibold">
								₹
								{plan.totalReturnAmount ||
									Number(plan.price * plan.returnPercentage) /
										100 +
										Number(plan.price)}
							</span>
						</div>
					</div>
				</div>
				<Button
					variant="contained"
					color="primary"
					fullWidth
					size="large"
					className="bg-indigo-600 hover:bg-indigo-700 py-3 text-lg font-semibold"
					onClick={() => onChoosePlan(plan._id)}
				>
					Choose Plan
				</Button>
			</CardContent>
		</Card>
	</motion.div>
);

const AddPlanModal = ({ open, handleClose, handleAddPlan }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [duration, setDuration] = useState("");
	const [type, setType] = useState("RUNNING");
	const [returnPercent, setReturnPercent] = useState("");
	const [image, setImage] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("price", price);
		formData.append("duration", duration);
		formData.append("type", type);
		formData.append("returnPercentage", returnPercent);
		formData.append("logo", image);
		handleAddPlan(formData);
		// handleAddPlan({
		// 	name,
		// 	description,
		// 	price: Number.parseFloat(price),
		// 	duration: Number(duration),
		// });
		setName("");
		setDescription("");
		setPrice("");
		setDuration("");
		setType("RUNNING");
		setReturnPercent("");
		setImage(null);
		handleClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle className="bg-indigo-600 text-white">
				Add New Plan
			</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent className="space-y-4 mt-4">
					<TextField
						autoFocus
						margin="dense"
						label="Plan Name"
						type="text"
						fullWidth
						variant="outlined"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="bg-gray-50"
					/>
					<TextField
						margin="dense"
						label="Description"
						multiline
						rows={4}
						fullWidth
						variant="outlined"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
						className="bg-gray-50"
					/>
					<TextField
						margin="dense"
						label="Price"
						type="number"
						fullWidth
						variant="outlined"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
						className="bg-gray-50"
					/>
					<TextField
						margin="dense"
						label="Duration"
						type="number"
						fullWidth
						variant="outlined"
						value={duration}
						onChange={(e) => setDuration(e.target.value)}
						required
						className="bg-gray-50"
					/>
					<TextField
						margin="dense"
						label="Return Percent"
						type="number"
						fullWidth
						variant="outlined"
						value={returnPercent}
						onChange={(e) => setReturnPercent(e.target.value)}
						required
						className="bg-gray-50"
					/>
					{/* Image */}
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setImage(e.target.files[0])}
						id="icon-button-file"
					/>
					<TextField
						margin="dense"
						label="Type"
						select
						fullWidth
						variant="outlined"
						value={type}
						onChange={(e) => setType(e.target.value)}
						required
						className="bg-gray-50"
					>
						{["RUNNING", "UPCOMING", "EXPIRED"].map((option) => (
							<MenuItem key={option} value={option}>
								{option}
							</MenuItem>
						))}
					</TextField>
				</DialogContent>
				<DialogActions className="p-4">
					<Button onClick={handleClose} className="text-gray-600">
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						className="bg-indigo-600 hover:bg-indigo-700"
					>
						Add Plan
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

const DeleteConfirmationModal = ({
	open,
	handleClose,
	handleConfirm,
	planName,
}) => (
	<Dialog
		open={open}
		onClose={handleClose}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	>
		<DialogTitle id="alert-dialog-title" className="bg-red-600 text-white">
			{"Confirm Plan Deletion"}
		</DialogTitle>
		<DialogContent className="mt-4">
			<DialogContentText id="alert-dialog-description">
				Are you sure you want to delete the plan "{planName}"? This
				action cannot be undone.
			</DialogContentText>
		</DialogContent>
		<DialogActions className="p-4">
			<Button onClick={handleClose} className="text-gray-600">
				Cancel
			</Button>
			<Button
				onClick={handleConfirm}
				variant="contained"
				className="bg-red-600 hover:bg-red-700"
				autoFocus
			>
				Delete
			</Button>
		</DialogActions>
	</Dialog>
);

export default function Plans() {
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [planToDelete, setPlanToDelete] = useState(null);

	const fetchPlans = async () => {
		try {
			const res = await axios.get(`${host}/plans`);
			setPlans(res?.data?.data?.plans);
		} catch (err) {
			setError("Failed to load plans. Please try again later.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchPlans();
	}, []);

	const handleAddPlan = async (newPlan) => {
		try {
			const res = await axios.post(`${host}/plans`, newPlan, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			toast.success("New plan added successfully!");
			fetchPlans();
		} catch (err) {
			toast.error("Failed to add new plan. Please try again.");
		}
	};

	const handleDeletePlan = async (planId) => {
		try {
			if (!planId) {
				toast.error("Please select a plan to delete!");
			}
			const res = await axios.delete(`${host}/plans/${planId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			toast.success("Plan deleted successfully!");
			fetchPlans();
		} catch (error) {
			toast.error("Failed to delete plan. Please try again.");
		}
	};

	const closeDeleteConfirmation = () => {
		setPlanToDelete(null);
		setOpenDeleteModal(false);
	};

	const confirmDelete = () => {
		if (planToDelete) {
			handleDeletePlan(planToDelete._id);
			closeDeleteConfirmation();
		}
	};

	if (loading) {
		return (
			<Box className="flex justify-center items-center h-screen">
				<Typography variant="h5" className="text-gray-600">
					Loading plans...
				</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box className="flex justify-center items-center h-screen">
				<Typography variant="h5" className="text-red-500">
					{error}
				</Typography>
			</Box>
		);
	}

	return (
		<Box className="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
			<Typography
				variant="h2"
				component="h1"
				className="font-bold text-center mb-4 text-indigo-800"
			>
				{plans.length > 0
					? "These are the existing plans"
					: "No plans added"}
			</Typography>
			<Typography
				variant="h5"
				component="p"
				className="text-center mb-12 text-gray-600"
			>
				<Button
					variant="contained"
					onClick={() => setOpenModal(true)}
					className="bg-indigo-600 hover:bg-indigo-700"
				>
					Add New Plan
				</Button>
			</Typography>
			<Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
				{plans.map((plan, index) => (
					<PlanCard
						key={plan._id}
						plan={plan}
						onChoosePlan={() => {}}
						isPopular={index === 1}
						activePlan={null}
						setPlanToDelete={setPlanToDelete}
						setOpenDeleteModal={setOpenDeleteModal}
					/>
				))}
			</Box>
			<AddPlanModal
				open={openModal}
				handleClose={() => setOpenModal(false)}
				handleAddPlan={handleAddPlan}
			/>
			<DeleteConfirmationModal
				open={openDeleteModal}
				handleClose={closeDeleteConfirmation}
				handleConfirm={confirmDelete}
				planName={planToDelete?.name}
			/>
		</Box>
	);
}
