import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
	backgroundColor: theme.palette.grey[200],
	color: theme.palette.text.primary,
}));

const StyledToolbar = styled(Toolbar)({
	display: "flex",
	justifyContent: "space-between",
});

const Logo = styled(Typography)(({ theme }) => ({
	fontWeight: "bold",
	color: theme.palette.primary.main,
	padding: theme.spacing(1),
	border: `2px solid ${theme.palette.primary.main}`,
	borderRadius: "50%",
}));

const NavButton = styled(Button)(({ theme }) => ({
	marginLeft: theme.spacing(2),
}));

const Layout = ({ children }) => {
	const { user, logout } = useAuth();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		setIsDrawerOpen(false);
		navigate("/");
	};

	const drawerItems = [
		{ text: "Users", icon: <PeopleIcon />, path: "/dashboard" },
		{ text: "Transactions", icon: <ReceiptIcon />, path: "/transactions" },
		{ text: "Wallet", icon: <WalletIcon />, path: "/wallet" },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<StyledAppBar position="sticky" elevation={1}>
				<StyledToolbar>
					<div className="flex items-center">
						{user && (
							<IconButton
								edge="start"
								color="inherit"
								aria-label="menu"
								onClick={() => setIsDrawerOpen(true)}
							>
								<MenuIcon />
							</IconButton>
						)}
					</div>
					<div>
						{!user && (
							<>
								<NavButton
									component={Link}
									to="/signin"
									color="inherit"
								>
									Sign In
								</NavButton>
								<NavButton
									component={Link}
									to="/signup"
									variant="contained"
									color="primary"
								>
									Sign Up
								</NavButton>
							</>
						)}
					</div>
					<Link to={"/"}>
						<Logo variant="h6">UIT</Logo>
					</Link>
				</StyledToolbar>
			</StyledAppBar>
			<Drawer
				anchor="left"
				open={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
			>
				<List className="w-64">
					{drawerItems.map((item) => (
						<ListItem
							button
							key={item.text}
							component={Link}
							to={item.path}
							onClick={() => setIsDrawerOpen(false)}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItem>
					))}
					<ListItem
						button
						onClick={handleLogout}
						className="cursor-pointer"
					>
						<ListItemIcon>
							<ExitToAppIcon />
						</ListItemIcon>
						<ListItemText primary="Logout" />
					</ListItem>
				</List>
			</Drawer>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
		</div>
	);
};

export default Layout;
